## 项目的后续需要的新增功能 和 对前端需要的功能的感悟

+ googel中书签管理的排序和文件放入别的文件夹
+ 我遇到的问题
  + searchPage页面
    + 

### 对于后端接口的架构重构
+ 后端的内容都放在Program/back_end文件夹中
+ 分为三个文件：
    + db：mysql数据库的createPool
    + router：express的路由中间件
    + router_handler: 路由中间件使用方法的抽离
    + schema： 用户密码的保存加密方法
