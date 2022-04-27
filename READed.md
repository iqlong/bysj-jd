## 我阅读之后的

### 项目中组件的架构

1. 首页就是home组件的页面  component/Home.vue
   其中home页面包括的组件：
   1.1 头部:     component/HomeHeaderView
   1.2 轮播图:   component/HomeBannerView
   
   1.3 导航:     component/HomeNavView
   1.4 商品区:   component/HomeMainView
2. 其中App.vue的作用
   其他路由后组件的包裹组件
3. 其中loading的显示通过axios拦截器控制

需要解决的问题：

1. 点击登录导航后不可以回退
2. 登录后要显示用户的头像，并设置修改密码和退出登录两个选项
3. 貌似是vuex中的error：sub is not a function
   vue devtool的新版本，导致页面的跳转问题
4. $route的watch的问题
5. 将接口部分(back_end)模块化一下
   + node环境中我放弃了commonJs和Es6 Module的混合使用
   + 其中的大概的结构
      + 分为几个文件夹： db, router_handler, router, schema几个文件夹   server.js
      + 其实就是将接口文件： server.js 模块化，
         + db：                中放数据库相关的东西
         + routerHandler：     放路由需要的函数
         + router：            路由级别中间件
         + server.js：         nodeJs接口的入口文件

!!! 拦截器和已修改的多次输出问题
这个就需要看 Event和EvenTarget.dispatchEvent  和  事件的后面的实现细节 --》 箭头函数中的e*
！！ 样式封装再高阶组件中的问题

需要注意的问题：

1. sessionStorage中只可以存放字符串类型
   若是直接存js对象，会调用对象的toString()方法
2. sessionStorage数据在浏览器刷新后不会丢失，vuex会

学习到的知识点：

1. webpack需要加一些配置项，
   cli中有@vue/cli-plugin-babel/preset 类似的内置插件，有些东西就不要特别注意
2. 组件中再加一层组件才会用到样式穿透，  注意spa mpa中使用样式穿透的不同
   style加了scoped但是import导入外部css无效果：
   要使用src属性来导入才可以加上scoped
3. 使用css画三角/不规则图形/对话框
4. express-jwt使用后，可以通过req.user来获取jwtStr中包裹的信息
5. addEventListener中使用箭头函数会让e变得很奇怪

让项目中的功能更加丰富：

1. 登录，修改密码，退出登录
2. 文件上传和下载
3. 图片懒加载
4. 高阶组件
5. 图片的上传和下载 和 resize那个组件的使用
6. 页面的无限滚动
7. 滚动条的出现： 让body中出现了右侧padding，需要修改滚动条样式
8. 退出登录的实现有问题
9. 弹出框的多次点击值提示一次
   !! 10. 回到顶部
10. 评论区域，扫码登录

!!! 监听sessionStorage的removeItem，让JSON.parse()之前少一点判断
main.js中对于es6支持的问题  这个项目/**

10. 用户头像的上传和裁剪
11. 多一点弹窗的提示和提示的放抖操作
12. 写接口的时候怎么： 接口中调用已有的接口
    duration 和 数据库中修改密码

规范：

1. 接口的返回值的规定
