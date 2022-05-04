<template>
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
		            <strong>{{$store.state.mutations.allMoney}}元</strong>
		        </div>
		        <div class="total_money clearfix">
		            <span>总额:</span>
		            <i>￥</i>
		            <span>{{$store.state.mutations.allMoney}}块</span>
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
      <div class="textCenter">是否支付{{$store.state.mutations.allMoney}}元？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmPay">确 定</el-button>
      </span>
    </el-dialog>
	</div>
</template>
<script>
  export default {
    data(){
      return{
        ifAll: false,
        centerDialogVisible: false
      }
    },
    methods: {
      selectAll(){
        this.ifAll=!this.ifAll;
        this.$bus.$emit('selectAll',this.ifAll);
      },
      confirmPay(){
        // 让cartMain去进行支付
        this.$bus.$emit('doPay')
      },
      ifPay(){
        if(this.$store.state.mutations.allMoney==0){
          this.$durationMes({
            message: '请选择商品',
            type: 'warning'
          })
        }else {
          this.centerDialogVisible=true;
        }
      }
    },
    mounted() {
      this.$bus.$on('cancelAll',() => {
        this.ifAll = false
      });
      // 支付成功
      this.$bus.$on('didPay',() => {
        // 支付成功，清除余额
        this.$store.commit('moneyGoZero');
        this.centerDialogVisible = false;
        this.$durationMes({
          message: '支付成功',
          type: 'success'
        })
      })
    }
  }
</script>
<style scoped lang="less">
.cart_fo{
  height: 50px;
}
</style>
