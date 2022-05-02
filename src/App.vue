<template>
  <div id="app">
    <loading v-show="loading"></loading>
    <router-view></router-view>
    <!-- router-link在下面这个组件中 -->
    <NavBottomView v-show="shownav"></NavBottomView>
  </div>
</template>

<script>
import NavBottomView from './components/NavBottom.vue';
import {mapGetters,mapActions} from 'vuex';
export default {
  name: 'app',
  // vuex中的 getter 混入到computed中
  computed:mapGetters(['loading','shownav']),
  //监听路由的变化
  watch:{
    $route(to,from){
      if(to.path.indexOf('detail')!=-1){
        this.$store.dispatch('hideNav');
        console.log(to.path.indexOf('detail'),"-----");
      }else{
        this.$store.dispatch('showNav');
        console.log(to.path.indexOf('detail'),"==========");
      }
      if(to.path == '/cart' || to.path == '/search' || to.path == '/login' || to.path == '/register'){
        this.$store.dispatch('hideNav');
      }
    }
  },
  components:{
    NavBottomView
  }
}
</script>

<style>
@import './assets/css/index.css';
</style>
