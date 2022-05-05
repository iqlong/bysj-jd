<template>
  <div class="footer">
  	<footer class="fixBottomBox">
        <ul>
            <router-link tag="li" to="/home" class="tabItem">
            	<div class="tab-item-link" @click="changeSp('home')">
                    <!--<img src="../assets/images/navBottom/a-home.png" alt="" class="tab-item-icon">-->
                <svg class="icon" aria-hidden="true">
                  <use v-bind:xlink:href="iconSelected('home',true,true)"></use>
                </svg>
                <div class="text" :class="{active:iconSelected('home',false)}">首页</div>
              </div>
            </router-link>
            <router-link tag="li" to="/catgory" class="tabItem">
                <div  class="tab-item-link" @click="changeSp('catgory')">
                  <svg class="icon" aria-hidden="true">
                    <use v-bind:xlink:href="iconSelected('catgory',true)"></use>
                  </svg>
                  <div class="text"  :class="{active:iconSelected('catgory',false)}">分类</div>
                </div>
            </router-link>
            <!--<router-link tag="li" to="/find" class="tabItem">-->
            <!--    <div class="tab-item-link" @click="changeSp('find')">-->
            <!--      <svg class="icon" aria-hidden="true">-->
            <!--        <use v-bind:xlink:href="iconSelected('find',true)"></use>-->
            <!--      </svg>-->
            <!--      <div class="text"  :class="{active:iconSelected('find',false)}">发现</div>-->
            <!--    </div>-->
            <!--</router-link>-->
            <router-link tag="li" to="/cart" class="tabItem">
                <div class="tab-item-link" @click="changeSp('cart')">
                  <svg class="icon" aria-hidden="true">
                    <use v-bind:xlink:href="iconSelected('cart',true)"></use>
                  </svg>
                  <div class="text"  :class="{active:iconSelected('cart',false)}">购物车</div>
                </div>
            </router-link>
            <router-link tag="li" to="/mine" class="tabItem">
                <div class="tab-item-link" @click="changeSp('my')">
                  <svg class="icon" aria-hidden="true">
                    <use v-bind:xlink:href="iconSelected('my',true)"></use>
                  </svg>
                  <div class="text" :class="{active:iconSelected('my',false)}">我的</div>
                </div>
            </router-link>
        </ul>
    </footer>
  </div>
</template>

<script>
export default {
  data(){
    return{
      selectPage: location.pathname.split('/')[1],
          // test: this.$route.fullPath
    }
  },
  computed:{

  },
  methods: {
    changeSp(str){
      this.selectPage=str
    },
    iconSelected(iconStr,ifIcon){
      if(ifIcon){
        switch (iconStr){
          case 'home':
            return this.selectPage==iconStr?'#icon-shouye-copy':'#icon-shouye';
            break;
          case 'catgory':
            return this.selectPage==iconStr?'#icon-fenlei-copy':'#icon-fenlei';
            break;
          case 'find':
            return this.selectPage==iconStr?'#icon-faxian1-copy':'#icon-faxian1';
            break;
          case 'cart':
            return this.selectPage==iconStr?'#icon-a-gouwuchegouwu-copy':'#icon-a-gouwuchegouwu';
            break;
          case 'my':
            return this.selectPage==iconStr?'#icon-wode-copy':'#icon-wode';
            break;
          default:
            return false;
        }
      }else {
        return iconStr==this.selectPage
      }
    }
  },
  mounted() {
    window.addEventListener('popstate',(e) => {
      console.log(location.pathname.split('/')[1])
      this.selectPage = location.pathname.split('/')[1]
    })
    // let _wr = function(type) {
    //   let orig = history[type];
    //   return function() {
    //     let rv = orig.apply(this, arguments);
    //     let e = new Event(type);
    //     e.arguments = arguments;
    //     window.dispatchEvent(e);
    //     return rv;
    //   };
    // };
    // history.pushState = _wr('pushState');
    // history.replaceState = _wr('replaceState');
    // window.addEventListener('replaceState', function(e) {
    //   console.log('replaceS')
    //   this.selectPage = location.pathname.split('/')[1]
    // });
    // window.addEventListener('pushState', function(e) {
    //   console.log('pushS',location.pathname)
    //   this.selectPage = location.pathname.split('/')[1]
    // });
  }
}
</script>

<style scoped lang="less">
  a{
    .text{
      font: 12px bold;
    }
  }
  .active{
    color: #ba0c59;
  }
</style>
