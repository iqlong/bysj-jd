<template>
		<main class="cart_box">
		    <div class="cart_tip clearfix">
		        <span>登录后可同步电脑与手机购物车中的商品</span>
		        <a href="#" class="login">登录</a>
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
</template>
<script>
	export default{
		data(){
			return{
				cartDatas:[],
        selectBuy:[],
			}
		},
		mounted(){
			this.getCartDatas();
			this.$bus.$on('selectAll',(ifAll) => {
			  // 如果是确定
			  if(ifAll){
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
      })
      // 确定支付后需要删除selectBuy中的数据
      this.$bus.$on('doPay',() => {
        this.$http.post('/pay',{
          selectBuy: this.selectBuy
        }).then((res) => {
          if(res.data.status==1){
            // 重新请求，更新数据
            this.selectBuy=[];
            this.getCartDatas().then(() => {
              this.$bus.$emit('didPay');
            });
          }else {
            this.$durationMes({
              message: res.data.msg,
              type: 'error'
            })
          }
        })
      })
		},
    methods:{
			getCartDatas(){
				return this.$http.get('/cart').then((res)=>{
				  if(res.data.status=='null'){
            this.cartDatas = [];
				    this.$durationMes({
              message: '暂无商品添加购物车',
              type: 'success'
            })
          }else {
            res.data.forEach((item) => {
              item.checked = false;
            })
            // 后端返回的数据不好，自己加一点
            this.cartDatas = res.data;
          }
				},(err)=>{
					console.log(err);
				})
			},
      singleClick(item){
        item.checked=!item.checked;
        if(item.checked){
          // money增加，打上勾勾
          this.$store.commit('addMoney',[item['product_uprice']*item['goods_num'],true]);
          this.selectBuy.push(item['product_id'])
        }else {
          this.$store.commit('addMoney',[item['product_uprice']*item['goods_num'],false]);
          this.selectBuy.splice(this.selectBuy.indexOf(item['product_id']),1);
          // 去掉钩子要告诉footer页面别再选中全选按钮了
          this.$bus.$emit('cancelAll')
        }
        console.log(this.selectBuy)
      },
      changeNum(ifAdd,pId,num){
			  if(num==1){
			    this.$durationMes({
            message: '最少购买一条',
            type: 'warning'
          })
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
</style>
