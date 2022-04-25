<template>
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
              <span class="all">全部</span>
              <img class="all_icon"/>
            </li>
            <li>
              <span @click="getbyHot()">销量</span>

            </li>
            <li class="p_price">
              <span>价格</span>
              <img class="price_up" @click="getByPriceUp()"/>
              <img class="price_down" @click="getByPriceDown()"/>
            </li>
            <li>
              <span>筛选</span>
              <img class="saixuan"/>
            </li>
          </ul>
        </section>
        <main class="main_goods_box">
          <ul>
            <li class="goods_item" v-for="item in mDatas">
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
                    <span>{{ item.product_comment_num }}条评价</span>
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
      mDatas: []
    }
  },
  methods: {
    goSearch(event) {
      let _this = this;
      _this.$http.get('/search', {
        params: {
          kw: _this.keyword || 'iphone 6s',
          hot: '',
          priceUp: '',
          priceDown: ''
        }
      }).then((res) => {
        _this.mDatas = res.data;
        console.log(_this.mDatas);
      }, (err) => {
        console.log(err);
      });
      window.event ? window.event.returnValue = false : event.preventDefault();
    },
    getbyHot() {
      let _this = this;
      if (_this.keyword == '') {
        alert('请输入商品名称');
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
          console.log(_this.mDatas);
        }, (err) => {
          console.log(err);
        });
      }
    },
    getByPriceUp() {
      let _this = this;
      if (_this.keyword == '') {
        alert('请输入商品名称');
      } else {
        _this.$http.get('/search', {
          params: {
            kw: _this.keyword,
            hot: 'hot',
            priceUp: 'priceUp',
            priceDown: ''
          }
        }).then((res) => {
          _this.mDatas = res.data;
          console.log(_this.mDatas);
        }, (err) => {
          console.log(err);
        });
      }
    },
    getByPriceDown() {
      let _this = this;
      if (_this.keyword == '') {
        alert('请输入商品名称');
      } else {
        _this.$http.get('/search', {
          params: {
            kw: _this.keyword,
            hot: 'hot',
            priceUp: '',
            priceDown: 'priceDown'
          }
        }).then((res) => {
          _this.mDatas = res.data;
          console.log(_this.mDatas);
        }, (err) => {
          console.log(err);
        });
      }
    }
  }
}
</script>
<style scoped>
body {
  background-color: #fff;
}

.h_layout {
  min-width: 300px;
  max-width: 640px;
  margin: 0 auto;
  position: relative;
  height: 1000px;
  background-color: #fff;
}

.h_layout .top_bar {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 40px;
  z-index: 2;
}

.h_layout .search_condition {
  width: 100%;
  height: 40px;
  margin-top: 40px;
  border-bottom: 1px solid #DFDFDF;
  border-top: 1px solid #DFDFDF;
}

.search_condition ul {
  width: 100%;
  display: flex;
  justify-content: space-around;
}

.search_condition ul li {
  width: 25%;
  height: 100%;
  float: left;
  text-align: center;
  line-height: 40px;
}

li img {
  width: 8px;
  height: 7px;
  display: inline-block;
  background: url("../assets/images/jd-sprites.png") no-repeat;
  background-size: 200px 200px;
}

.all_icon {
  background-position: 0 -109px;
}

.price_up {
  background-position: -170px -28px;
}

.price_down {
  background-position: -170px -36px;
  margin-left: -12px;
}

.saixuan {
  width: 15px;
  height: 13px;
  display: inline-block;
  background: url("../assets/images/jd-search-sprites.png") no-repeat;
  background-size: 200px 200px;
  background-position: -178px 3px;
  margin-left: -4px;
}

.all {
  color: #F23030;
}

.main_goods_box {
  width: 100%;
  border-top: 1px solid #DFDFDF;
  margin-top: 10px;
}

.main_goods_box .goods_item {
  width: 100%;
  height: 120px;
  padding: 10px;
}

.goods_item .goods_item_link {
  display: block;
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #eee;
  position: relative;
}

.goods_item_link .goods_item_pic {
  display: inline-block;
  width: 100px;
  height: 100px;
}

.goods_item_link .goods_right {
  position: absolute;
  left: 104px;
  top: 0;
  height: 100%;
}

.goods_right .pp_name {
  height: 40%;
}

.goods_right .price_box {
  color: #F34545;
  height: 20%;
  line-height: 20px;
  margin-top: 10px;
}

.goods_right .price_box span:nth-child(2) {
  font-size: 18px;
  margin: 0 -3px;
}

.goods_right .pinglun_box {
  margin-top: 5px;
  color: #848689;
}

</style>
