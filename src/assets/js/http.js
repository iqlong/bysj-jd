import axios from "axios";
import store from "../../store";

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

export default axios
