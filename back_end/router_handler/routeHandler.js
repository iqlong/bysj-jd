const db = require('../db/index');


function getHomeData(getHomeStr, res) {
    db.query(getHomeStr, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                res.send(data);
            }
        }
    });
}

function getCateNamesData(getCateNames, res) {
    db.query(getCateNames, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                res.send(data);
            }
        }
    });
};

function getCateGoods(sql, res) {
    db.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                res.send(data);
            }
        }
    });
};

/**
 * get search datas
 */
function getSearchData(keywordStr, res,str) {
    db.query(keywordStr, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.send({
                  msg: 'no data',
                }).end();
            } else {
                res.send(data);
            }
        }
    });
};

/**
 * deal user register
 **/
function delReg(insUserInfo, res) {
    db.query(insUserInfo, (err) => {
        if (err) {
            console.error(err);
            res.send({ 'msg': '服务器出错', 'status': 0 }).end();
        } else {
            res.send({ 'msg': '注册成功', 'status': 1 }).end();
        }
    })
};
module.exports = {
    getHomeData,
    getCateNamesData,
    getCateGoods,
    getSearchData,
    delReg,
}
