<template>
  <!-- 样式在此页面中 -->
  <div class="search_page">
    <div class="h_layout">
      <div class="search_ma">
        <header class="top_bar">
          <a onclick="window.history.go(-1)" class="icon_back"></a>
          <form class="goods_search" v-on:submit.prevent>
            <input class="goods_search_content" placeholder="iphone 6s" v-model="keyword"
                   @keyup.enter="goSearch($event)">
          </form>
          <a href="#" class="icon_menu"></a>
        </header>
        <section class="search_condition">
          <ul>
            <li>
              <span class="canClick" :class="[{active: screenWord=='all'}]"
                    @click="getAll($event)">全部</span>
            </li>
            <li>
              <span class="canClick" :class="{active: screenWord=='hot'}"
                    @click="getByHot()">销量</span>
            </li>
            <li class="p_price">
              <span class="canClick" :class="{active: screenWord=='price'}"
                    @click="getByPrice()">价格</span>
              <div class="container">
                <div class="price_up" :class="[upPrice===true?'actPriceUp':'']"></div>
                <div class="price_down" :class="[upPrice===false?'actPriceDown':'']"></div>
              </div>
            </li>
            <li>
              <span class="canClick" :class="{active: screenWord=='select'}">筛选</span>
              <div class="select"/>
            </li>
          </ul>
        </section>
        <main class="main_goods_box">
          <ul>
            <li class="goods_item" v-for="item in mDatas" v-show="mDatas.length>0">
              <router-link :to="'/detail/'+item.product_id" class="goods_item_link">
                <img v-lazy="item.product_img_url" alt="" class="goods_item_pic">
                <div class="goods_right">
                  <div class="pp_name">
	                            <span>
	                                {{ item.product_name }}
	                            </span>
                  </div>
                  <div class="price_box">
                    <span>￥</span>
                    <span>{{ item.product_uprice }}</span>
                    <span>.00</span>
                  </div>
                  <div class="pinglun_box">
                    <span>{{ item.product_comment_num }}条 评价</span>
                    <span>{{ item.shop_name }}</span>
                  </div>
                </div>
              </router-link>
            </li>

          </ul>
        </main>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      keyword: '',
      mDatas: [],
      screenWord: 'all',
      // 利用隐式类型转换
      upPrice: 0,
    }
  },
  methods: {
    getAll(event){
      this.upPrice=0
      this.screenWord = 'all';
      this.goSearch(event);

    },
    goSearch(event) {
      if(this.keyword==''){
        this.keyword = 'iphone 6s'
      }
      this.$http.get('/search', {
        params: {
          kw: this.keyword,
          hot: '',
          priceUp: '',
          priceDown: ''
        }
      }).then((res) => {
        if(res.data.msg=='no data'){
          this.mDatas=[];
          this.$durationMes.warning({
            message: '暂无商品'
          })
        }else {
          this.mDatas = res.data;
        }
      }, (err) => {
        console.log(err);
      });
      window.event ? window.event.returnValue = false : event.preventDefault();
    },
    getByHot() {
      this.screenWord = 'hot';
      this.upPrice=0;
      let _this = this;
      if (_this.keyword == '') {
        this.$durationMes.warning({
          message: '请输入商品名称',
        })
      } else {
        _this.$http.get('/search', {
          params: {
            kw: _this.keyword,
            hot: 'hot',
            priceUp: '',
            priceDown: ''
          }
        }).then((res) => {
          _this.mDatas = res.data;
        }, (err) => {
          console.log(err);
        });
      }
    },
    getByPrice() {
      this.screenWord = 'price'
      this.upPrice=!this.upPrice;
      if (this.keyword == '') {
        this.$durationMes.warning({
          message: '请输入商品名称',
        })
      } else {
        this.$http.get('/search', {
          params: {
            kw: this.keyword,
            hot: '',
            priceUp: this.upPrice===true?'priceUp':'',
            priceDown: this.upPrice===false?'priceDown':''
          }
        }).then((res) => {
          this.mDatas = res.data;
        }, (err) => {
          console.log(err);
        });
      }
    },
  }
}
</script>
<style scoped lang="less">
body {
  background-color: #fff;
}
// searchPage居中的部分
.h_layout {
  min-width: 300px;
  max-width: 640px;
  margin: 0 auto;
  position: relative;
  height: 1000px;
  background-color: #fff;

  // 1-搜索框部分
  .top_bar {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 40px;
    z-index: 2;
  }

  // 2-筛选区域
  .search_condition {
    width: 100%;
    height: 40px;
    margin-top: 40px;
    border-bottom: 1px solid #dfdfdf;
    border-top: 1px solid #dfdfdf;
    ul {
      width: 100%;
      display: flex;
      justify-content: space-around;
      height: 40px;
      li {
        width: 25%;
        height: 100%;
        float: left;
        text-align: center;
        line-height: 40px;
        position: relative;
        >div.container{
          position: absolute;
          width: 8px;
          height: 14px;
          top: 14px;
          left: 97px;
          div {
            width: 8px;
            height: 7px;
            background: url("../assets/images/jd-sprites.png") no-repeat;
            background-size: 200px 200px;
          }

          .price_up {
            background-position: -170px 2px;
          }
          .actPriceUp{
            background-position: -170px -13px;
          }

          .price_down {
            background-position: -170px -36px;
          }
          .actPriceDown{
            background-position: -170px -4px;
          }
        }
      }
    }
  }

  // 3-商品展示区域
  .main_goods_box {
    width: 100%;
    border-top: 1px solid #dfdfdf;

    .goods_item {
      width: 100%;
      height: 120px;
      padding: 10px;
      .goods_item_link {
        display: block;
        width: 100%;
        height: 100%;
        border-bottom: 1px solid #eee;
        position: relative;
        .goods_item_pic {
          display: inline-block;
          width: 100px;
          height: 100px;
        }

        .goods_right {
          position: absolute;
          left: 104px;
          top: 0;
          height: 100%;
          .pp_name {
            height: 40%;
          }

          .price_box {
            color: #f34545;
            height: 20%;
            line-height: 20px;
            margin-top: 10px;

            span {
              &:nth-child(2) {
                font-size: 18px;
                margin: 0 -3px;
              }
            }
          }

          .pinglun_box {
            margin-top: 5px;
            color: #848689;
          }
        }
      }
    }
  }

  /* 被选中的才会发生颜色变换，且只会有单个发生变化 */
  .active {
    color: #f23030;
  }
  .canClick:hover {
    cursor: pointer;
  }
}




</style>
