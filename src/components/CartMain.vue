<template>
  <div>
    <main class="cart_box">
      <div  v-show="$store.state.mutations.userInfo!==undefined &&
            Object.keys($store.state.mutations.userInfo)!=[]" class="cart_tip clearfix">
        <span>登录后可同步电脑与手机购物车中的商品</span>
        <a href="#"
           class="login" @click="$router.push('/login')">登录</a>
      </div>
      <div class="cart_content clearfix" v-for="(item,index) in cartDatas" :key="item['cart_id']">
        <!-- 盒子的上部分 -->
        <div class="cart_shop clearfix">
          <div class="cart_check_box">
            <!-- 这一块用来选择所有店铺的钩子 -->
            <!--<div class="check_box" @click="item.checked=true">-->
            <!--  {{item.checked?'√':''}}-->
            <!--</div>-->
          </div>
          <div class="shop_info clearfix">
            <img src="../assets/images/buy-logo.png" alt="" class="shop_icon">
            <span class="shop_name">{{item.shop_name}}</span>
          </div>
          <div class="cart_free clearfix">
            <span class="free_tip">优惠券></span>
          </div>
        </div>
        <!-- 盒子的主体 -->
        <div class="cart_item">
          <div class="cart_item_box">
            <div class="check_box" @click="singleClick(item)" >
              <!--:class="{checked: item.checked}">-->
              {{item.checked?'✔':''}}️
            </div>
          </div>
          <div class="cart_detial_box clearfix">
            <a href="#" class="cart_product_link">
              <img v-lazy="item.product_img_url" alt="">
            </a>
            <div class="item_names">
              <a href="#">
                <span>{{item.product_name}}</span>
              </a>
            </div>
            <div class="cart_weight">
              <i class="my_weigth">重量:0.45kg</i>
              <span class="my_color">颜色:AT800/16</span>
            </div>
            <div class="cart_product_sell">
              <span class="product_money">￥<strong class="real_money">{{item.product_uprice}}</strong>.00</span>
              <div class="cart_add clearfix">
                <span class="my_add pointerBox" @click="changeNum(true,item['product_id'])">+</span>
                <input type="tel" class="my_count" :value="item.goods_num">
                <span class="my_jian pointerBox" @click="changeNum(false,item['product_id'],item['goods_num'])">-</span>
              </div>
            </div>
            <div class="cart_del clearfix">
              <div class="del_top">
              </div>
              <div class="del_bottom">
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <div class="cart_fo">
      <footer class="cart_footer">
        <div class="all_check_box">
          <div class="check_box" @click="selectAll" :class="{checked: ifAll}">

          </div>
          <span>全选</span>
        </div>
        <div class="count_money_box">
          <div class="heji">
            <strong>合计:</strong>
            <strong>￥</strong>
            <strong>{{allMoney}}元</strong>
          </div>
          <div class="total_money clearfix">
            <span>总额:</span>
            <i>￥</i>
            <span>{{allMoney}}块</span>
            <span>立减:</span>
            <i>￥</i>
            <span>0.00</span>
          </div>>
          <a href="#" class="go_pay" @click="ifPay()">
            <span>去支付</span>
          </a>
        </div>
      </footer>
      <!-- dialog聚集地 -->
      <el-dialog
          title="提示"
          :visible.sync="centerDialogVisible"
          width="30%"
          center>
        <div class="textCenter">是否支付{{allMoney}}元？</div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmPay">确 定</el-button>
      </span>
      </el-dialog>
    </div>
  </div>

</template>
<script>
	export default{
		data(){
			return{
				cartDatas:[],
        selectBuy:[],

        ifAll: false,
        centerDialogVisible: false
			}
		},
    computed:{
		  allMoney(){
		    let sumM=0;
		    this.cartDatas.filter((item) => {
		      return item.checked==true;
        }).forEach((item) => {
          sumM+=item['product_uprice']*item['goods_num'];
        })
        return sumM
      }
    },
		mounted(){
			this.getCartDatas();
			window.vue=this;
		},
    methods:{
			getCartDatas(){
				return this.$http.get('/cart').then((res)=>{
				  if(res.data.status=='null'){
            this.cartDatas = [];
				    this.$durationMes.success({
              message: '暂无商品添加购物车',
            })
          }else {
            // res.data.forEach((item) => {
            //   item.checked = false;
            // })
            // 后端返回的数据不好，自己加一点
            // this.cartDatas = Object.assign({},this.cartDatas,res.data);
            if(this.cartDatas.length==0){
              this.cartDatas = res.data;
            }else {
              this.cartDatas.forEach((item,index) => {
                Object.assign(item,res.data[index])
              })
            }
            // this.cartDatas = tempObj;
            // this.$set(this.data(),'cartDatas',Object.assign(this.cartDatas,res.data))
          }
				},(err)=>{
					console.log(err);
				})
			},
      // 一个一个的打勾
      singleClick(item){
			  item.checked==undefined?this.$set(item,'checked',false):'';
        item.checked=!item.checked;
        if(item.checked){
          // money增加，打上勾勾
          // this.$store.commit('addMoney',[item['product_uprice']*item['goods_num'],true]);
          this.selectBuy.push(item['product_id'])
        }else {
          // this.$store.commit('addMoney',[item['product_uprice']*item['goods_num'],false]);
          this.selectBuy.splice(this.selectBuy.indexOf(item['product_id']),1);
          // 去掉钩子要告诉footer页面别再选中全选按钮了
          this.ifAll = false
        }
        // 一个个都打完钩，全选才亮
        this.selectBuy.length==this.cartDatas.length?this.ifAll=true:'';
      },
      changeNum(ifAdd,pId,num){
			  if(num==1){
			    this.$durationMes.warning({
              message: '最少购买一条',
            }
          )
        }else {
          this.$http.post('/changeGN',{
            ifAdd: ifAdd,
            pId: pId
          }).then((res) => {
            if(res.data.status=='00'){
              this.getCartDatas()
            }
          })
        }
      },

      selectAll(){
        this.ifAll=!this.ifAll;
        // 如果是确定
        if(this.ifAll){
          let sum=0;
          this.cartDatas.forEach((item) => {
            if(!item.checked){
              sum+=item['product_uprice']*item['goods_num'];
            }
            item.checked=true;
            this.selectBuy.push(item['product_id'])
          })
          this.$store.commit('addMoney',[sum,true]);
        }else {
          this.cartDatas.forEach((item) => {
            item.checked=false;
          })
          this.selectBuy=[];
          this.$store.commit('moneyGoZero')
        }
      },
      confirmPay(){
        // 让cartMain去进行支付
        this.$http.post('/pay',{
          selectBuy: this.selectBuy
        }).then((res) => {
          if(res.data.status==1){
            // 重新请求，更新数据
            this.selectBuy=[];
            this.getCartDatas().then(() => {
              this.$store.commit('moneyGoZero');
              this.centerDialogVisible = false;
              this.$durationMes.success({
                message: '支付成功',
              })
            });
          }else if(res.data.status==401){
            this.$durationMes.warning({
              message: '请先登录',
            })
          }else {
            this.$durationMes.error({
              message: res.data.msg,
            })
          }
        })
      },
      ifPay(){
        if(this.allMoney==0){
          this.$durationMes.warning({
            message: '请选择商品',
          })
        }else {
          this.centerDialogVisible=true;
        }
      }
		}
	}
</script>
<style scoped lang="less">
  .check_box{
    cursor: pointer;
    // 让钩子看的好看一些
    text-align: center;
  }
  .cart_fo{
    height: 50px;
  }
</style>
