<template>
	<div class="home">
		<div class="m_layout">
            <!-- 头部搜索区 -->
           <HomeHeaderView></HomeHeaderView>
            <!-- 轮播图-->
            <HomeBannerView></HomeBannerView>
            <!--导航-->
            <HomeNavView></HomeNavView>
            <!--商品区-->
            <HomeMainView></HomeMainView>
        </div>
	</div>
</template>
 <script>
    import HomeHeaderView from './HomeHeader.vue';
    import HomeBannerView from './HomeBanner.vue';
    import HomeNavView from './HomeNav.vue';
    import HomeMainView from './HomeMain.vue';
    import {bindEvent,scrollPic} from '../../assets/js'
    export default{
       components:{
        HomeHeaderView,
        HomeBannerView,
        HomeNavView,
        HomeMainView
       },

       mounted(){
        bindEvent();
        scrollPic();
       }
    }
</script>
<style  lang="css">
/* 这种引入方式相当于发请求，scoped没有效果，需要写在src中 */
        /* 根据我的实践：还是有效果的 */
  @import '../../assets/css/index.css';
</style>
<style  lang="less">
  body .el-popover{
    left: 1121px !important;
    width: auto !important;
    min-width: 0;
    .popper__arrow {
      left: 38px !important;
    }
  }
</style>
