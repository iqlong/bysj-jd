<template>
	<div class="mine_mm">
	<main class="mine_layout">
	    <section class="mine_infos clearfix">
	        <div class="mmm_info">
	            <div class="user_icon">
                <!--<img src="../../assets/images/my_icon.jpg" alt="">-->
                <img :src="userImg" alt="">
              </div>
	            <div class="user_detal">
	                <p class="user_name">{{uInfs.user_name}}</p>
	                <div class="reg">
	                    <a href="#" class="reg_link">注册会员</a>
	                    <div class="vip">
	                    <span class="vip_icon">
	                        <img src="../../assets/images/vip.png" alt="">
	                    </span>
	                        <a href="#">
	                            立享PLUS特权 >
	                        </a>
	                    </div>
	                </div>
	            </div>
	            <div class="manage_account">
	                <span @click="userMesDialog=true" class="pointerBox">
	                    详情信息 >
	                </span>
	            </div>
	        </div>
	        <div class="yguanzhu_box">
	            <ul class="gunzhuf">
	                <li class="item">
	                    <a href="" class="item_link">
	                        <span>0</span>
	                        <span>关注的商品</span>
	                    </a>
	                </li>
	                <li class="item">
	                    <a href="" class="item_link">
	                        <span>0</span>
	                        <span>关注的店铺</span>
	                    </a>
	                </li>
	                <li class="item">
	                    <a href="" class="item_link">
	                        <span>8</span>
	                        <span>浏览记录</span>
	                    </a>
	                </li>
	            </ul>
	        </div>
	    </section>
	    <section class="my_order_box">
	        <div class="order_top_box">
	            <div class="order_left">
	                <img src="../../assets/images/my_order_icon.png" alt="">
	                <span>我的订单</span>
	            </div>
	            <div class="order_right">
	                <span>全部订单></span>
	            </div>
	        </div>
	        <div class="order_bottom_box">
	            <ul>
	                <li class="order_item">
	                    <a href="#" class="order_item_link">
	                        <img src="../../assets/images/waitpay.png" alt="" class="order_item_pic">
	                        <span class="order_item_pay">待付款</span>
	                    </a>
	                </li>
	                <li class="order_item">
	                    <a href="#" class="order_item_link">
	                        <img src="../../assets/images/wuliu.png" alt="" class="order_item_pic">
	                        <span class="order_item_pay">待收货</span>
	                    </a>
	                </li>
	                <li class="order_item">
	                    <a href="#" class="order_item_link">
	                        <img src="../../assets/images/tuihuan.png" alt="" class="order_item_pic">
	                        <span class="order_item_pay">退换/售后</span>
	                    </a>
	                </li>
	            </ul>
	        </div>
	    </section>
	    <section class="my_order_box">
	        <div class="order_top_box">
	            <div class="order_left">
	                <img src="../../assets/images/mypackage.png" alt="">
	                <span>我的钱包</span>
	            </div>
	            <div class="order_right">
	                <span>></span>
	            </div>
	        </div>
	        <div class="order_bottom_box">
	            <ul>
	                <li class="order_item">
	                    <a href="#" class="order_item_link">
	                        <span style="margin-top: -5px;display: block">{{uInfs.balance||0}}</span>
	                        <span class="order_item_pay">账户余额</span>
	                    </a>
	                </li>
	                <li class="order_item">
	                    <a href="#" class="order_item_link">
	                        <span style="margin-top: -6px;display: block">0</span>
	                        <span class="order_item_pay">优惠券</span>
	                    </a>
	                </li>
	                <li class="order_item">
	                    <a href="#" class="order_item_link">
	                        <span style="margin-top: -6px;display: block">0</span>
	                        <span class="order_item_pay">京豆</span>
	                    </a>
	                </li>
	                <li class="order_item">
	                    <a href="#" class="order_item_link">
	                        <span style="margin-top: -6px;display: block">0</span>
	                        <span class="order_item_pay">京东卡/E卡</span>
	                    </a>
	                </li>
	            </ul>
	        </div>
	    </section>
	    <section class="my_order_box my_b_info">
	        <div class="order_top_box">
	            <div class="order_left">
	                <img src="../../assets/images/baitiao1.png" alt="">
	                <span>京东白条</span>
	            </div>
	            <div class="order_right">
	                <span>白条还款、激活获礼包></span>
	            </div>
	        </div>
	        <div class="order_top_box">
	            <div class="order_left">
	                <img src="../../assets/images/baitiao2.png" alt="">
	                <span>客户服务</span>
	            </div>
	            <div class="order_right">
	                <span>返修/退换货、在线客服></span>
	            </div>
	        </div>
	        <div class="order_top_box">
	            <div class="order_left">
	                <img src="../../assets/images/bai3.png" alt="">
	                <span>会员plus</span>
	            </div>
	            <div class="order_right">
	                <span>PLUS绝密攻略></span>
	            </div>
	        </div>
	        <div class="order_top_box">
	            <div class="order_left">
	                <img src="../../assets/images/bai4.png" alt="">
	                <span>京东会员</span>
	            </div>
	            <div class="order_right">
	                <span>会员俱乐部></span>
	            </div>
	        </div>
	    </section>
	    <section class="my_order_box my_b_info">
	        <div class="order_top_box">
	            <div class="order_left">
	                <img src="../../assets/images/huo1.png" alt="">
	                <span>京东火车票</span>
	            </div>
	            <div class="order_right">
	                <span>来京东轻松抢票></span>
	            </div>
	        </div>
	        <div class="order_top_box">
	            <div class="order_left">
	                <img src="../../assets/images/huo2.png" alt="">
	                <span>1元抢宝</span>
	            </div>
	            <div class="order_right">
	                <span>1元成就梦想></span>
	            </div>
	        </div>
	        <div class="order_top_box">
	            <div class="order_left">
	                <img src="../../assets/images/huo3.png" alt="">
	                <span>我的预约</span>
	            </div>
	            <div class="order_right">
	                <span>></span>
	            </div>
	        </div>
	        <div class="order_top_box">
	            <div class="order_left">
	                <img src="../../assets/images/huo4.png" alt="">
	                <span>我的必购码</span>
	            </div>
	            <div class="order_right">
	                <span>></span>
	            </div>
	        </div>
	        <div class="order_top_box">
	            <div class="order_left">
	                <img src="../../assets/images/huo5.jpg" alt="">
	                <span>应用推荐</span>
	            </div>
	            <div class="order_right">
	                <span>></span>
	            </div>
	        </div>
	    </section>
	</main>
    <el-dialog
        title='用户信息详情表'
        :visible.sync="userMesDialog"
        width="50%"
        center>
      <div class="flexBox">
        <el-avatar shape="square" size="large" :src="userImg"></el-avatar>
      </div>

      <el-descriptions class="margin-top" title="" :column="3" >
        <template slot="extra">
          <!--<el-button type="primary" size="small">操作</el-button>-->
          <div></div>
        </template>
        <el-descriptions-item label="用户名">{{uInfs['user_name']}}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{uInfs['user_number']}}</el-descriptions-item>
        <el-descriptions-item label="账户余额">{{uInfs['balance']}}元</el-descriptions-item>
        <el-descriptions-item label="备注-id">
          <el-tag size="small">{{uInfs['user_id']}}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="联系地址">{{uInfs['address']}}</el-descriptions-item>
        <el-descriptions-item label="头像">{{uInfs['user_photo']}}</el-descriptions-item>

      </el-descriptions>
      <span slot="footer" class="dialog-footer">
        <el-button @click="userMesDialog = false" size="small">取 消</el-button>
        <el-button type="primary" @click="userMesDialog = false" size="small">确 定</el-button>
      </span>
    </el-dialog>
	</div>
</template>
<script>
	export default{
		data(){
			return{
				uInfs:{},
        userInfo: window.sessionStorage.userInfo,
        userMesDialog: false
			}
		},
    computed:{
      userImg(){
        // let userInfo=window.sessionStorage.userInfo;
        return this.userInfo&&this.userInfo!=='undefined' ? JSON.parse(this.userInfo)['user_photo'] : undefined;
      }
    },
		mounted(){
		  window.vue=this;
			this.getUDatas();
		},
		methods:{
			getUDatas(){
				let uObj ={};
				if(window.sessionStorage.userInfo && sessionStorage.userInfo!=='undefined'){
					let uObj = JSON.parse(window.sessionStorage.userInfo);
					let useId = uObj.user_id;
					this.$http.get('/userinfo',{
						params:{
							uId:useId
						}
					}).then((res)=>{
						this.uInfs = res.data;
						console.log(this.uInfs);
					},(err)=>{
						console.log(err);
					});
				}else{
				  // 没有登录就使用push方法，但是这样会导致 go(-1)出现问题
					this.$router.push({
						path:'/login',
					})
				}
			}
		}
	}
</script>
<style scoped lang="less">
.flexBox{
  display: flex;
  justify-content: center;
  align-content: center;
}

</style>
