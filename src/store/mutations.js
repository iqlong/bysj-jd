import getters from './getter.js';
const state = {
    isShow: false,
    isNavShow: true,
    userInfo: {},
    allMoney: 0
}
const mutations = {
    // 第一个参数是state容器，第二个是参数
    showLoading: (state) => {
        state.isShow = true
    },
    hideLoading: (state) => {
        state.isShow = false
    },
    showNav: (state) => {
        state.isNavShow = true
    },
    hideNav: (state) => {
        state.isNavShow = false
    },
    setUserInfo: (state, userInfo) => {
        state.userInfo = userInfo;
    },
    addMoney: (state, [money, status]) => {
        status?state.allMoney+=money:state.allMoney-=money;
    },
    moneyGoZero: (state) => {
        state.allMoney=0;
    }
}

export default {
    getters,
    state,
    mutations
}
