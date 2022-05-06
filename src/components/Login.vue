<template>
  <div class="my_l">
    <header class="top_bar">
      <a @click="goWhichPath" class="icon_back"></a>
      <h3 class="cartname">登录</h3>
    </header>
    <main class="user_login_box">
      <div class="login_dialog">
        <div class="_username">
          <input type="text" name="username" placeholder="请输入用户名" class="user_input" v-model="username"/>
        </div>
        <div class="_username u_passwd">
          <input type="password" name="password" @keyup.enter="goLogin()"
                 placeholder="请输入密码" class="user_input" v-model="password"/>
        </div>

        <div class="login_box">
          <a @click="goLogin()" class="btn_login">登录</a>
        </div>
        <div class="go_reg_box">
          <router-link tag="span" to="/register">快速注册</router-link>
        </div>
      </div>
    </main>
  </div>
</template>
<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      userInfo: {}
    }
  },

  methods: {
    goWhichPath() {
      // popstate不可监听这个push事件
      if(!localStorage.token || localStorage.token=='null'){
        history.go(-2)
      }else{
        this.$router.push('/home')
      }
      // history.pushState('/home')
    },
    goLogin() {
      let _this = this;
      if (_this.username == '') {
        this.$durationMes.warning({
          message: '请输入用户名',
        })
      } else if (_this.password == '') {
        this.$durationMes.warning({
          message: '请输入密码',
        })
      } else {
        _this.$http.post('/login', {
          loginName: _this.username,
          loginPawd: _this.password,
        }, {
          headers: {
            // 'content-type': 'application/x-www-form-urlencoded'
          }
        }).then((res) => {
          // console.log(_this.password);
          if (res.status == 200) {
            _this.userInfo = res.data.userSearched;
            if (res.data.status == 1) {
              //LOGIN success
              // sessionStorage中只能存放字符串数据
              window.sessionStorage.userInfo = JSON.stringify(_this.userInfo);
              localStorage.setItem('token', res.data.token)
              // console.log(_this.$store);
              _this.$store.dispatch('setUserInfo', _this.userInfo);
              let redirect = decodeURIComponent(_this.$route.query.redirect || '/');
              _this.$router.push({
                path: redirect
              });
              this.$message({
                message: res.data.msg,
                type: 'success'
              })
            } else {
              this.$message({
                message: res.data.msg,
                type: res.data.status == -2 ? 'warning' : 'error'
              })
            }

          } else {
            alert('请求出现错误');
          }
          console.log(res);
        }, (err) => {
          console.log(err);
        });
      }

    }
  }
}
</script>
<style>
@import '../assets/css/login.css';
</style>
