<template>
	<div class="m_r">
		<header class="top_bar">
		    <a onclick="window.history.go(-1)" class="icon_back"></a>
		    <h3 class="cartname">注册</h3>
		</header>
		<main class="user_login_box">
		    <div class="login_dialog">
		        <div class="_username">
		            <input type="text" name="regname" placeholder="用户名" class="user_input" v-model="regname">
		        </div>
		        <div class="_username u_passwd">
		            <input type="password" name="regpasswd" placeholder="请输入密码" class="user_input" v-model="regpasswd">
		        </div>
		        <div class="_username u_passwd">
		            <input type="password" name="regpasswd_ag" placeholder="请再次输入密码" class="user_input" v-model="regpasswd_ag">
		        </div>
            <div class="_username">
              <input type="text" name="regname" placeholder="充值金额" class="user_input" v-model="balance">
            </div>
            <div class="_username">
              <input type="text" name="regname" placeholder="电话号码" class="user_input" v-model="telephone">
            </div>
            <div class="_username">
              <input type="text" name="regname" placeholder="地址" class="user_input" v-model="address">
            </div>

		        <div class="login_box">
		            <a @click="goSearch()" class="btn_login">注册</a>
		        </div>
		    </div>
		</main>
	</div>
</template>
<script>
	export default{
		data(){
			return{
				regname:'',
				regpasswd:'',
				regpasswd_ag:'',
        address:'',
        telephone: undefined,
        balance: undefined,
				regInfo:{}
			}
		},
		methods:{
			goSearch(){
				let _this = this;
				if(_this.regname ==''){
          this.$durationMes.warning({
            message: '请输入手机号',
          })
				}else if(_this.regpasswd == '' || _this.regpasswd_ag == ''){
          this.$durationMes.warning({
            message: '请输入密码',
          })
				}else if(_this.regpasswd!==_this.regpasswd_ag){
          this.$durationMes.warning({
            message: '两次输入的密码不一致',
          })
				}else{
					_this.$http.post('/reg',{
						regName:_this.regname,
						regPasswd:_this.regpasswd,
            address: this.address,
            tel: this.telephone,
            balance: this.balance
				}).then((res)=>{
					if(res.status == 200){
						_this.regInfo = res.data;
						if(_this.regInfo.status == 1){
							//reg success, go to this login page
							window.history.go(-1);
						}else{
							this.$durationMes.warning({
                message: _this.status.msg,
              })
						}
					}else{
						this.$durationMes.error({
              message: '出现错误',
            })
					}
					console.log(res);
				},(err)=>{
					console.log(err);
				});
				}

			}
		}
	}
</script>
<style>
@import '../assets/css/reg.css';
</style>
