<template>
  <div class="home_h">
    <header class="m_header">
      <div class="m_header_box" id="my_search">
        <a href="#" class="icon_logo"></a>
        <form action="#">
          <span class="icon_search"></span>
          <input type="search" class="search" placeholder="点击搜索" @click="goSearch($event)">
        </form>
        <router-link to="/login" class="logo_btn">登录</router-link>
        <el-popover v-show="userImg"
            placement="top"
            width="160"
            trigger="hover"
            v-model="visible">
          <el-button size="mini" type="text" @click="visible = false; centerDialogVisible=true">修改密码</el-button>
          <br>
          <!-- 对dialog的二次封装，看下原生的element的封装 -->
          <!-- v3 -->
          <el-button size="mini" type="text" @click="visible = false; logoutConfirmDialog=true">退出登录</el-button>
          <template #reference>
            <img :src="userImg" alt="">
          </template>
        </el-popover>
      </div>
    </header>
    <!-- 修改密码 -->
    <el-dialog
        title="修改密码"
        :visible.sync="centerDialogVisible"
        width="30%"
        :lock-scroll="false"
        center>
      <div>
        <div>
          <label for="username">用户名：</label>
          <el-input v-model="username" id="username" size="small" clearable></el-input>
        </div>
        <br>
        <div>
          <label for="password">密码名：</label>
          <el-input @keyup.enter="changePwdConfirm" v-model="password" id="password" show-password size="small"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changePwdCancel" size="mini">取 消</el-button>
        <el-button type="primary" @click="changePwdConfirm" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 退出登录 -->
    <el-dialog
        title="退出登录"
        :visible.sync="logoutConfirmDialog"
        width="30%"
        :lock-scroll="false"
        center>
      <div>
        <h1>您是否退出登录?</h1>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="logoutConfirmDialog=false" size="mini">取 消</el-button>
        <el-button type="primary" @click="logoutConfirm" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>
<script>
let originalSetItem = sessionStorage.setItem;
sessionStorage.setItem = function(key, newValue){
  let setItemEvent = new Event("setItemEvent");
  setItemEvent.newValue = newValue;
  window.dispatchEvent(setItemEvent);
  originalSetItem.apply(this,arguments);
}

import PackagedDialog from "../generalComp/PackagedDialog.vue";
export default {
  components: {
    PackagedDialog
  },
  data(){
    return{
      visible: false,
      centerDialogVisible: false,
      logoutConfirmDialog: false,
      // 输入框默认都是string类型
      username: '',
      password: '',
      // 这里的userInfo就是提供一个简写形式
      userInfo: window.sessionStorage.userInfo
    }
  },
  mounted(){
    let _this=this;
    // 需要使用setItem等方法才可以监听到事件
    window.addEventListener("setItemEvent",function (e) {
      _this.userInfo = e.newValue;
      console.log('修改了')
      e.stopPropagation();
    });
  },
  computed:{
    userImg(){
      // let userInfo=window.sessionStorage.userInfo;
      return this.userInfo&&this.userInfo!=='undefined' ? JSON.parse(this.userInfo)['user_photo'] : undefined;
    }
  },
  methods: {
    goSearch(event) {
      this.$router.push('/search');
      // event.preventDefault()
      // window.event ? window.event.returnValue = false : event.preventDefault();
    },
    changePwdCancel(){
      this.clearInput();
      this.centerDialogVisible = false;
    },
    changePwdConfirm(){
      // 发送修改密码的请求
      this.$http.post('/changePwd',{
        username: this.username,
        password: this.password
      }).then((res) =>{
        // 新旧密码一样
        if(res.data.status == 304){
          this.$durationMes({
            message: res.data.msg,
            type: 'warning'
          })
        //  密码不一样，修改之后需要退出登录
        }else if(res.data.status == 200){
          this.$durationMes({
            message: res.data.msg,
            type: 'success'
          });
          this.logoutConfirm();
        //  一些其他的问题
        }else{
          this.$durationMes({
            message: res.data.msg,
            type: 'error'
          });
        };
      })
      // 页面数据的清除和关闭
      this.clearInput();
      this.centerDialogVisible = false;
    },
    // 输入完就清除，防止通过f12获取密码
    clearInput(){
      this.username='';
      this.password='';
    },
    // 退出登录
    logoutConfirm(){
      this.$http.get('/logout').then((res) =>{
        if(res.data.status == 0){
          localStorage.setItem('token',null);
          // ''不可以用parse()，null可以，但是sessionStorage只可以存储JSON
          sessionStorage.setItem('userInfo',undefined);
          this.$durationMes({
            message: '已退出登录',
            type: 'success',
          })
        }else {
          this.$durationMes({
            message: '退出登录失败',
            type: 'warning'
          })
        }
      })
      this.logoutConfirmDialog=false;
    }
  }
}
</script>

<style scoped lang="less">
/*
  总结 使用webpack时候的图片加载问题
  style的scoped
*/
img{
  width: 40px;
  height: 40px;
  position: absolute;
  right: 10px;
  top: 3px;
  border-radius: 50%;
}

</style>
