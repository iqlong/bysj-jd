<template>
  <div class="goods_detail">
    <header class="top_bar">
      <a onclick="window.history.go(-1)" class="icon_back"></a>
      <h3 class="cartname">商品详情</h3>
      <a href="#" class="icon_menu"></a>
    </header>
    <main class="detail_box">
      <section class="banner_box">
        <ul class="banner_child_box">
          <li class="banner_item" v-for="item in goodsImages">
            <img v-lazy="item.image_url" alt="" class="banner_pic">
          </li>

        </ul>
        <div class="banner_count">
          <em id="slide-nub" class="fz18">1</em>
          <em class="nub-bg">/</em>
          <em id="slide-sum" class="fz12">5</em>
        </div>

      </section>
      <section class="product_info clearfix">
        <div class="product_left">
          <p class="p_name">{{ goodsData.length>0?goodsData[0]['product_name']:'' }}</p>
          <div class="product_pric">
            <span>￥</span>
            <span class="rel_price">{{ goodsData.length>0?goodsData[0]['product_uprice']:'' }}</span>
            <span>.00</span>
          </div>
          <div class="product_right">
            降价通知
          </div>
        </div>

      </section>
      <section class="product_intro">
        <p class="pro_det">
          {{ goodsData.length>0?goodsData[0]['product_detail']:'' }}
        </p>
      </section>

    </main>
    <footer class="cart_d_footer">
      <div class="m">
        <ul class="m_box">
          <li class="m_item">
            <!--<a href="javascript:" class="m_item_link">-->
            <!--    <em class="m_item_pic"></em>-->
            <!--    <span class="m_item_name">卖家</span>-->
            <!--</a>-->
            <a href="javascript:" class="m_item_link flexA">
              <div class="pointerBox just">
                <em class="m_item_pic two"></em>
                <span class="m_item_name">关注</span>
              </div>
            </a>
            <a href="javascript:" class="m_item_link jstPointer flexA" @click="$router.push('/cart')">
              <div class="pointerBox just">
                <em class="m_item_pic three"></em>
                <span class="m_item_name">购物车</span>
              </div>
            </a>
          </li>
        </ul>
        <div class="btn_box clearfix">
          <a href="javascript:" class="buy_now pointerBox" @click="addCart">加入购物车</a>
          <a href="javascript:" class="buybuy pointerBox" @click="centerDialogVisible=true;">立即购买</a>
        </div>
      </div>
    </footer>
    <el-dialog
        title="提示"
        :visible.sync="centerDialogVisible"
        width="30%"
        center>
      <div class="textCenter">是否支付{{  goodsData.length>0?goodsData[0]['product_price']:'' }}元？</div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmPay">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
const moment = require('moment');
export default {
  data() {
    return {
      cateGoodsAllData: [],
      goodsImages: [],
      goodsData: [],
      centerDialogVisible: false
    }
  },
  mounted() {
    this.$store.dispatch('hideNav');
    this.fetchData(this.$route.params.id);
    window.vue=this;
  },
  watch: {
    $route(to) {
      //console.log(to);
      var reg = /detail\/\d+/;
      if (reg.test(to.path)) {
        var categotyId = this.$route.params.id || 0;
        this.fetchData(categotyId);
      }
    }
  },
  methods: {
    fetchData(id) {
      var _this = this;

      _this.$http.get('/detail', {
        params: {
          mId: id
        }
      }).then((res) => {
        _this.goodsImages = res.data[0];
        _this.goodsData = res.data[1];

      }, (err) => {
        console.log(err);
      })
    },
    addCart() {
      let uId;
      if (sessionStorage.userInfo !== 'undefined' && sessionStorage.userInfo) {
        uId = JSON.parse(sessionStorage.userInfo)['user_id'];
      }
      this.$http.post('/addCart', {
        pId: this.$route.params.id,
        uId: uId,
        createTime: moment().format('YYYY-MM-DD hh:mm:ss')
      }).then((res) => {
        let msgType = '';
        if (res.data.status == '00') {
          msgType = 'success';
        } else {
          msgType = 'error'
        }
        this.$durationMes[msgType]({
          message: res.data.msg
        })
      })
    },
    confirmPay(){
      // 让cartMain去进行支付
      let uId;
      if(sessionStorage.userInfo!=='undefined'&&sessionStorage.userInfo){
        uId=JSON.parse(sessionStorage.userInfo)['user_id'];
      }
      if(!uId){
        return this.$durationMes.warning({
          message: 'session无信息,请先登录',
        })
      }
      this.$http.post('/pay',{
        detail: true,
        money: this.goodsData[0]['product_price'],
        uId: uId
      }).then((res) => {
        if(res.data.status===1){
          // 重新请求，更新数据
          this.centerDialogVisible = false;
          this.$durationMes.success({
            message: '支付成功',
          })
        }else if(res.data.status===401){
          this.$durationMes.warning({
            message: '请先登录',
          })
        }else {
          if(res.data.status==='01'){
            this.$durationMes.warning({
              message: res.data.msg
            })
            this.centerDialogVisible=false;
          }else {
            this.$durationMes.error({
              message: res.data.msg,
            })
          }
        }
      })
    },
  }
}
</script>
<style scoped>
@import '/src/assets/css/detail.css';

.flexA {
  display: flex;
  align-items: center;
  justify-content: center;
}

.pointerBox.just {
  width: 42px;
}
</style>
