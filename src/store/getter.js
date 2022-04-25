export default {
    // 这样弄个相同的值的意义所在
    loading: (state) => {
        return state.isShow;
    },
    shownav: (state) => {
        return state.isNavShow;
    },
    getUserInfo: (state) => {
        return state.userInfo;
    }
}
