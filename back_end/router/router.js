const express = require('express');
const common = require('../schema/common');
const jwt = require('jsonwebtoken')
const secretKey = 'happy everyday!'
const route = express.Router();
const routerHandler = require('../router_handler/routeHandler')
const db = require('../db/index');
const expressJwt = require('express-jwt')

const getHomeStr = `SELECT product_id,product_name,product_price,product_img_url,product_uprice FROM product`;
const getCateNames = `SELECT * FROM category ORDER BY category_id desc`;

//get homePage datas
route.get('/home', (req, res) => {
    routerHandler.getHomeData(getHomeStr, res);
});



route.get('/category', (req, res) => {
    routerHandler.getCateNamesData(getCateNames, res);
});


route.get('/categorygoods', (req, res) => {
    let mId = req.query.mId;
    const sql = `select * from product,category where product.category_id=category.category_id and category.category_id='${mId}'`;
    routerHandler.getCateGoods(sql, res);
});


route.get('/detail', (req, res) => {
    let produId = req.query.mId;
    const imagesStr = `select image_url from product_image where product_id='${produId}'`;
    const productStr = `select * from product where product_id='${produId}'`;
    let detailData = [];
    db.query(imagesStr, (err, imgData) => {
        if (err) {
            console.error(err);
            res.status(500).send('database err').end();
        } else {
            detailData.push(imgData);
            db.query(productStr, (err, data) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('database err').end();
                } else {
                    detailData.push(data);
                    res.send(detailData);
                }
            });
        }
    });
});
route.get('/cart', (req, res) => {
    const cartStr = "SELECT cart_id,user.user_id,product.product_id," +
        "product_name,product_uprice,product_img_url,goods_num,product_num,shop_name FROM product,user," +
        "goods_cart,shop where product.product_id=goods_cart.product_id and user.user_id=goods_cart.user_id " +
        "and shop.shop_id = product.shop_id";
    db.query(cartStr, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(200).send({
                    msg: 'no datas',
                    status: 'null'
                }).end();
            } else {
                res.send(data);
            }
        }
    });
})
route.post('/addCart',(req,res) => {

    let {uId,pId,createTime: created} = req.body;
    let insCartStr;
    if(uId){
        insCartStr=`insert into goods_cart (user_id,product_id,goods_num,created) 
                            values(${uId},${pId},1,'${created}')`;
    }else {
        insCartStr=`insert into goods_cart (product_id,goods_num,created) 
                            values(${pId},1,'${created}')`;
    }

    const selectStr=`select * from goods_cart where product_id=${pId}`;
    db.query(selectStr,(err,data) => {
        if(err){
            console.log(err)
            return res.send({
                msg: '服务器错误',
                status: '500'
            })
        }else{
            let add;
            if(data.length>0){
                // goods_num ++
                add=true;
                db.query(`update goods_cart set goods_num=goods_num+1
                            where product_id=${pId}`,(err) => {
                    if (err){
                        return res.send({
                            msg: '服务器错误',
                            status: '500'
                        })
                    }
                })
            }else {
                db.query(insCartStr,(err)=>{
                    if(err){
                        return res.send({
                            msg: '服务器错误',
                            status: '500'
                        })
                    }
                })
            }
            return res.send({
                msg: add?'购物车数量加壹':'已添加购物车',
                status: '00'
            })
        }
    })
})
// 对接口进行token认证
route.post('/pay',
    expressJwt({
        secret: secretKey,
        algorithms: ['HS256']
    })

)
route.post('/pay',(req,res) => {
    let {money: payMoney,uId} = req.body;
    const getBalance=`select balance from user where user_id=${uId}`
    // 若是金额不足，那就直接res.send()
    db.query(getBalance,(err,data)=>{
        if(err){
            console.log(err);
            res.send({
                msg:'sql语句问题'
            })
        }else {
            const balance=data[0].balance;
            if(payMoney>balance){
                return res.send({
                    msg:'余额不足，请充值',
                    status: '01'
                })
            }else {
                // 钱扣除了，在删除
                const reduceMoney=`update user set balance=(balance-${payMoney}) where user_id=${uId}`;
                db.query(reduceMoney,(err,data) => {
                    if(err){
                        console.log(err);
                        res.end({
                            msg: 'sql查询错误',
                            status: '444'
                        })
                    }else {
                        if(req.body.detail){
                            res.send({
                                msg: '付款成功',
                                status: 1
                            })
                        }else {
                            let deleteArr=req.body.selectBuy,n=0;
                            let len=deleteArr.length;
                            let payStr = `delete from goods_cart where product_id in (`;
                            while(1){
                                n++;
                                if(n==len){
                                    payStr+=`${deleteArr[n-1]});`;
                                    break;
                                }else {
                                    payStr+=`${deleteArr[n-1]},`
                                }
                            }
                            db.query(payStr,(err,data)=>{
                                if(err){
                                    console.log(err);
                                    res.send({ 'msg': '服务器出错', 'status': 0 }).end();
                                }else {
                                    res.send({
                                        msg: '付款成功',
                                        status: 1
                                    })
                                }
                            })
                        }

                    }
                })
            }
        }

    })
})

route.post('/delProduct',(req,res) => {
    let{pId} = req.body;
    const delStr = `delete from goods_cart where product_id=${pId}`;
    db.query(delStr,(err)=>{
        if(err){
            console.log(err);
            res.send({
                msg: 'sql查询错误',
                status: '444'
            })
        }else {
            res.send({
                msg:'删除成功',
                status: '00'
            })
        }
    })
})

route.post('/changeGN',(req,res) => {
    let ifAdd=req.body.ifAdd,pId=req.body.pId
    const operateStr= `Update goods_cart set goods_num=goods_num${ifAdd?'+':'-'}1
                            where product_id=${pId};`;
    db.query(operateStr,(err) => {
        if (err){
            console.log(err);
        }else {
            res.send({
                msg: 'num修改成功',
                status: '00'
            })
        }
    })
})

route.get('/search', (req, res) => {
    let keyWord = req.query.kw;
    let hot = req.query.hot;
    let priceUp = req.query.priceUp;
    let priceDown = req.query.priceDown;
    const keywordStr = `select  *  from product,shop where product.shop_id=shop.shop_id and 
            product.product_name like '%${keyWord}%'`;
    const hotStr = `select  *  from product,shop where product.shop_id=shop.shop_id and 
            product.product_name like '%${keyWord}%' order by product_comment_num desc`;
    const priceUpStr = `select  *  from product,shop
                        where product.shop_id=shop.shop_id 
                            and product.product_name like "%${keyWord}%"
                        order by product_uprice asc`;
    const priceDownStr = `select  *  from product,shop where product.shop_id=shop.shop_id and 
            product.product_name like '%${keyWord}%' order by product_uprice desc`;
    if (keyWord != '') {
        if (hot != '') {
            routerHandler.getSearchData(hotStr, res);
        } else if (priceUp != '') {
            routerHandler.getSearchData(priceUpStr, res);
        } else if (priceDown != '') {
            routerHandler.getSearchData(priceDownStr, res);
        } else {
            // 正常返回库表中顺序
            routerHandler.getSearchData(keywordStr, res);
        }
    }
});

/*
 *user reg func
 */
route.post('/reg', (req, res) => {
    let regName = req.body.regName;
    let regPasswd = req.body.regPasswd
    let {address,tel,balance}=req.body;
    let selectU = `SELECT * FROM user where user_name='${regName}'`
    db.query(selectU,(err,data) => {
        if(err){
            console.log(err);
            res.send({ 'msg': '服务器出错', 'status': 0 }).end();
        }else {
            if(data.length == 0){
                regPasswd = common.md5(regPasswd + common.MD5_SUFFXIE);
                const insUserInfo = `INSERT INTO user(user_name,login_password,user_photo,balance,user_number,address)`+
                    `VALUES('${regName}','${regPasswd}','https://iqlong.github.io/staticBysj/pigHead.jpg',`+
                    `${balance?balance:2000},'${tel?tel:'18570552406'}','${address?address:'郴州市北湖区文化路'}')`;
                routerHandler.delReg(insUserInfo, res);
            }else {
                console.log('用户存在了')
                res.send({
                    'msg': '用户已存在',
                    'status': -1
                })
            }
        }
    })
});

route.post('/login', (req, res) => {
    let username = req.body.loginName;
    let password = common.md5(req.body.loginPawd + common.MD5_SUFFXIE);
    const selectUser = `SELECT * FROM user where user_name='${username}'`;
    db.query(selectUser, (err, data) => {
        if (err) {
            console.log(err);
            res.send({ 'msg': '服务器出错', 'status': 0 }).end();
        } else {
            if (data.length == 0) {
                res.send({ 'msg': '该用户不存在', 'status': -1 }).end();
            } else {
                let userSearched = data[0];
                //login success
                if (userSearched.login_password === password) {
                    //save the session
                    // req.session['user_id'] = userSearched.user_id;
                    const tokenStr = jwt.sign({...userSearched}, secretKey, {expiresIn: '24h'});
                    res.send({
                        msg: '登录成功',
                        status: 1,
                        userSearched,
                        token: 'Bearer '+tokenStr
                    }).end();
                } else {
                    res.send({ 'msg': '密码不正确', 'status': -2 }).end();
                }
            }
        }
    });
});

route.get('/logout', (req, res) => {
    // const tokenStr = jwt.sign({}, secretKey, {expiresIn: '0s'});
    res.send({
        // token: tokenStr,
        msg: '退出成功',
        status: 0
    }).end();

});
route.post('/changePwd', (req, res) => {
    // 根据名字查找用户，要是密码改变了，就修改库表
    let username = req.body.username;
    let password = common.md5(req.body.password + common.MD5_SUFFXIE);
    const getPwd = `SELECT login_password FROM user where user_name='${username}'`;
    const setPwd = `UPDATE user set login_password='${password}' WHERE user_name='${username}'`;
    // 简单的实现角色功能 --- 权限问题
    if(req.user['user_name'] !== username){
        res.send({
            msg: '权限不够',
            status: 403
        })
    }else {
        // 然后退出登录    前端中调用接口
        db.query(getPwd,(err, data) => {
            if(err){
                console.log(err);
                res.send({
                    msg: 'sql查询错误',
                    status: 'sql500'
                }).end();
            }else {
                if(data.length === 0){
                    res.send({
                        msg: '没有此用户',
                        status: 204
                    })
                }else {
                    if(data[0]['login_password'] === password){
                        res.send({
                            msg: '密码未更改',
                            status: 304,
                        })
                    }else {
                        db.query(setPwd,(err, data) => {
                            res.send({
                                msg: '密码已修改',
                                status: 200
                            })
                        })
                    }
                }
            }
        })
    };

});

route.get('/userinfo', (req, res) => {
    let uId = req.query.uId;
    const getU = `SELECT * FROM user where user_id='${uId}'`;
    db.query(getU, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                res.send(data[0]);
            }
        }
    });
});

module.exports = route;
