const express = require('express');
const common = require('../schema/common');
const jwt = require('jsonwebtoken')
const secretKey = 'happy everyday!'
const route = express.Router();
const routerHandler = require('../router_handler/routeHandler')
const db = require('../db/index');
const expressJwt = require('express-jwt')
const multer = require('multer')
const fs = require('fs')
const path=require('path')

const getHomeStr = `SELECT product_id,product_name,product_price,product_img_url,product_uprice FROM product`;
const getCateNames = `SELECT * FROM category ORDER BY category_id desc`;

//get homePage datas
route.get('/home', (req, res) => {
    routerHandler.getHomeData(getHomeStr, res);
});

// 分页查询shop表格
route.get('/shop',(req,res) =>{
    console.log('gg',req.query)
    let {size=10,num=0}=req.query;
    size=parseInt(size);
    num=parseInt(num);
    const selectStr='select * from shop limit ?,?';
    const start=(num-1)*size;
    let allDataLen;
    db.query('select * from shop',(err,data) => {
        allDataLen=data.length;
        db.query(selectStr,[start,size],(err,data) => {
            if(err){
                console.log(err);
            }else {
                if(data.length>0){
                    res.send({
                        msg: '查询成功',
                        status: '00',
                        data: data,
                        allDataLen:allDataLen
                    })
                }else {
                    res.send({
                        msg: '库中无想要的数据',
                        status: '10',
                        allDataLen:allDataLen
                    })
                }
            }
        })
    })
})
route.post('/addShop',(req,res) => {
    let {name,address} = req.body;
    const insetStr = `insert into shop (shop_name,shop_address) values(?,?)`
    db.query(insetStr,[name,address],(e) => {
        if(e){
            console.log(e)
        }else {
            res.send({
                msg: '已创建商铺',
                status: '00'
            })
        }
    })
})


route.get('/category', (req, res) => {
    routerHandler.getCateNamesData(getCateNames, res);
});


route.get('/categorygoods', (req, res) => {
    let mId = req.query.mId;
    const sql = `select * from product,category where product.category_id=category.category_id and category.category_id='${mId}'`;
    routerHandler.getCateGoods(sql, res);
});
function x(r){
    r.send({
            msg: '错误',
            status: '00'
        })
};
route.post('/category/add',(req,res) => {
    let {pid,name,description}=req.body;
    const insertStr=`insert into category (category_pid,category_name,description) 
                        values(${pid},'${name}',${description?description:'null'})`;
    console.log(insertStr);
    // throw  new Error('gg')
    db.query(insertStr,(err) => {
        if(err){
            x(res);
            // throw  new Error('gg')
            return new Error('gg')
            throw err
            console.log(err)
        }else {
            res.send({
                msg: '已添加商品种类',
                status: '00'
            })
        }
    })
})

//创建一个multer对象，dest用来设置上传文件存放的目录
// let upload = multer({dest: path.join(__dirname,'../uploads')});
let upload = multer({dest: path.join(__dirname,'../uploads')});
let uploadDir=path.join(__dirname,'../uploads');
//single()方法是用来处理单个文件上传，注意参数的名字要与表单中的name值一致
route.post('/upload', upload.single('file'), function (req, res) {
    const url=`http://localhost:3333/${req.file.originalname}`
    console.log(req.file)
    if(fs.existsSync(`${uploadDir}/${req.file.originalname}`)){
        // 文件重名了，删除原文件再上传并重命名
        fs.unlink(`${uploadDir}/${req.file.originalname}`,(err)=>{
            if(err){
                console.log(`删除文件错误，原因是${err}`)
            }else {
                console.log(`删除文件${req.file.originalname}成功`)
                console.log(`开始将${req.file.filename}改名字为${req.file.originalname}`)
                fs.renameSync(`${uploadDir}/${req.file.filename}`,`${uploadDir}/${req.file.originalname}`);
                res.send ({
                    msg: '覆盖成功',
                    status: '00',
                    url
                });
            }
        })

    }else {
        // 直接上传并重命名
        let oldPath=`${uploadDir}/` + req.file.filename,
            newPath=`${uploadDir}/${req.file.originalname}`;
        let re=fs.renameSync(oldPath,newPath);
        res.send ({
            msg: '上传成功',
            status: '00',
            url
        });
    }
});
route.post('/test',(req,res) => {
    db.query('select * from user where user_id=1;select * from shop where shop_id=1',(e,data) => {
        console.log(data)
        res.send()
    })
})
route.post('/addProduct',(req,res) => {
    let {pid,images,name,uPrice,productNum,description,shopId}=req.body;
    const insertStr=`insert into product (category_id,product_img_url,product_name,product_uprice,
                        product_num,product_detail,shop_id) values(${pid},'${images[0]}','${name}',${uPrice},
                        ${productNum},'${description}',${shopId})`;
    if(!pid || !shopId || images.length<2){
        res.send({
            msg: '信息不全，建议补充',
            status: '11'
        })
    }else {
        db.query(insertStr,(err,data) => {
            if(err){
                console.log(err)
            }else {
                let insId = data.insertId;
                let insertImg=`insert into product_image (product_id,image_url) values(${insId},`;
                let endInsert='',temp;
                for(let i=0;i<images.length;i++){
                    // temp = insertImg+images[i]+');'
                    temp = `${insertImg}'${images[i]}');`
                    endInsert+=temp;
                }
                db.query(endInsert,err => {
                    if(err){
                        console.log(err)
                    }else {
                        res.send({
                            msg: '商品添加成功',
                            status: '00'
                        })
                    }
                })
            }
        })
    }
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
                    console.log(data,data[0]['shop_id'])
                    db.query('select shop_name,shop_address from shop where shop_id=?',[data[0]['shop_id']],(e,inData) => {
                        data[0].shopName=inData[0]['shop_name']
                        data[0].shopAddress=inData[0]['shop_address']
                        detailData.push(data);
                        res.send(detailData);
                    })

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
    let {address, tel, balance} = req.body;
    let selectU = `SELECT * FROM user where user_name='${regName}'`
    db.query(selectU,(err,data) => {
        if(err){
            console.log(err);
            res.send({ 'msg': '服务器出错', 'status': 0 }).end();
        }else {
            if(data.length == 0){
                regPasswd = common.md5(regPasswd + common.MD5_SUFFXIE);
                const insUserInfo = `INSERT INTO user(user_name,login_password,user_photo,balance,user_number,
                    address,isAdmin)`+
                    `VALUES('${regName}','${regPasswd}','https://iqlong.github.io/staticBysj/pigHead.jpg',`+
                    `${balance?balance:2000},'${tel?tel:'18570552406'}','${address?address:'郴州市北湖区文化路'}',0)`;
                routerHandler.delReg(insUserInfo, res);
                console.log(insUserInfo)
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
route.post('/changePwd',
    expressJwt({
        secret: secretKey,
        algorithms: ['HS256']
    })

)
route.post('/changePwd', (req, res) => {
    // 根据名字查找用户，要是密码改变了，就修改库表
    let username = req.body.username;
    let nowUser=req.body.nowUser;
    let password = common.md5(req.body.password + common.MD5_SUFFXIE);
    const getPwd = `SELECT login_password FROM user where user_name='${username}'`;
    const setPwd = `UPDATE user set login_password='${password}' WHERE user_name='${username}'`;
    // 简单的实现角色功能 --- 权限问题
    // console.log(req.user);
    // if(req.user['user_name'] !== username){
    if(nowUser !== username){
        res.send({
            msg: '权限不够',
            status: 403
        })
    }else {
        // 然后退出登录    前端中调用接口
        db.query(getPwd,(err, data) => {
            console.log('2')
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
    let {uId,isAdmin}=req.query;
    let getU
    if(uId){
        if(!isAdmin) {
            getU = `SELECT * FROM user where user_id=${uId} and isAdmin=0`;
        }else {
            getU = `SELECT * FROM user where user_id=${uId} and isAdmin=1`;
        }
    }else {
        if(!isAdmin) {
            getU = `SELECT * FROM user where isAdmin=0`;
        }else {
            getU = `SELECT * FROM user where isAdmin=1`;
        }
    }
    console.log(getU)
    db.query(getU, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                if(uId){
                    res.send(data[0]);
                }else {
                    res.send(data)
                }
            }
        }
    });
});

module.exports = route;
