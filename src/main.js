import Vue from 'vue'
import ElementUI,{Message} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router'
import routes from './router.config'
// import Less from 'Less'
import http from './assets/js/http'
import store from './store/'
import VueLazyload from 'vue-lazyload'
import App from './App.vue'
import Loading from './components/loading'
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
Vue.config.productionTip = false
Vue.prototype.$http = http;

// 为了实现Class的私有属性
const showMessage = Symbol('showMessage')
/**
 *  重写ElementUI的Message
 *  single默认值true，因为项目需求，默认只弹出一个，可以根据实际需要设置
 */
class DonMessage {
    success (options, single = true) {
        this[showMessage]('success', options, single)
    }
    warning (options, single = true) {
        this[showMessage]('warning', options, single)
    }
    info (options, single = true) {
        this[showMessage]('info', options, single)
    }
    error (options, single = true) {
        this[showMessage]('error', options, single)
    }

    [showMessage] (type, options, single) {
        if (single) {
            // 判断是否已存在Message
            if (document.getElementsByClassName('el-message').length === 0) {
                Message[type](Object.assign(options,{duration: 1000}))
                console.log(options)
            }
        } else {
            Message[type](options)
        }
    }
}
// Vue原型上加设置了时间的element message
Vue.prototype.$durationMes=
    // return new DonMessage(Object.assign(option,{duration: 1000}))
     new DonMessage()

// }

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
    } else {
        next();
    }
});
new Vue({
    el: '#app',
    router,
    store,
    beforeCreate() {
        Vue.prototype.$bus = this;
    },
    render: h => h(App)
})
