import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router'
import routes from './router.config'
// import Less from 'Less'
import axios from 'axios'
import store from './store/'
import VueLazyload from 'vue-lazyload'
import App from './App.vue'
import Loading from './components/loading'
require('./assets/css/base.css'); //全局引入
// Vue.use(Less);
Vue.use(VueRouter);
Vue.use(ElementUI)
Vue.use(Loading);
Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: require('./assets/images/err.png'),
    loading: require('./assets/images/loading.gif'),
    attempt: 1,
    listenEvents: ['scroll']
});
const router = new VueRouter({
    mode: 'history',
    scorllBehavior: () => ({
        y: 0

    }),
    routes
});

axios.interceptors.request.use(function(config) { //配置发送请求的信息
    // 下面dispatch报错：sub is not a function
    store.dispatch('showLoading');

    return config;
}, function(error) {
    store.dispatch('hideLoading');
    console.log('请求错误');
    return Promise.reject(error);
});

axios.interceptors.response.use(function(response) { //配置请求回来的信息
    store.dispatch('hideLoading');
    return response;
}, function(error) {
    store.dispatch('hideLoading');
    console.log('响应错误');
    return Promise.reject(error);
});
axios.defaults.timeout = 4000;
axios.defaults.baseURL = 'http://localhost:3333/';
// 去你妈的改变默认值
// axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers.Authorization = localStorage.getItem('token');
Vue.prototype.$http = axios;
Vue.prototype.$durationMes=function (option){
    return Vue.prototype.$message(Object.assign(option,{duration: 1000}))
}
/*axios.defaults.baseURL = (process.env.NODE_ENV !=='production' ? config.dev.httpUrl:config.build.httpUrl);
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';*/
// 处理刷新的时候vuex被清空但是用户已经登录的情况
    // 有大问题：  vuex中的东西没有的，还是要以放在localStorage中的数据为准
// 注意sessionStorage中判断数据类型的时候，   存储的都是json字符串类型
if (window.sessionStorage.userInfo && window.sessionStorage.userInfo !== 'undefined') {
    store.dispatch('setUserInfo', JSON.parse(window.sessionStorage.userInfo));
}

// 登录中间验证，页面需要登录而没有登录的情况直接跳转登录
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (store.state.userInfo.user_id) {
            next();
        } else {
            next({
                path: '/login',
                query: { redirect: to.fullPath }
            });
        }
        console.log("================");
    } else {
        console.log("nnnnnnnnnnnnnnnnnn");
        next();
    }
});
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
