export default {
    // 第一个参数是小型vuex，第二个是传入的参数
    showLoading: ({ commit }) => {
        commit('showLoading')
    },
    hideLoading: ({ commit }) => {
        commit('hideLoading')
    },
    showNav: ({ commit }) => {
        commit('showNav')
    },
    hideNav: ({ commit }) => {
        commit('hideNav')
    },
    setUserInfo: ({
        commit,
        userInfo,
    }) => {
        commit('setUserInfo', userInfo);
    }
}
