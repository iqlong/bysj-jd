<template>

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
          this.$durationMes.warning({
            message: '请选择商品',
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
        this.$durationMes.success({
          message: '支付成功',
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
