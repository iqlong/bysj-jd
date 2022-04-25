const express = require('express');
// express的v4.16.0+版本后就有了urlencoded了
// const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const cors = require('cors')
const mysql = require('mysql');
const server = express();
const expressJwt = require('express-jwt')

const secretKey = 'happy everyday!'

server.use(express.json())
server.use(express.urlencoded({ extended: false }));
server.use(cors());
server.use(expressJwt({
    secret: secretKey,
    algorithms: ['HS256']
}).unless({path:['/login','/home','/search']}))
    // .unless({path:[/^\/.*/]}))

//the cores config
server.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

    if (req.method == 'OPTIONS') {
        res.send(200);
        /* make the require of options turn back quickly */
    } else {
        next();
    }
});


//deal (cookie,session)
// (() => {
//     server.use(cookieParser());
//     let keyArr = [];
//     for (let i = 0; i < 100000; i++) {
//         keyArr[i] = "xsa_" + Math.random() * 100 + i;
//     }
//     server.use(cookieSession({
//         name: "hc",
//         keys: keyArr,
//         maxAge: 30 * 60 * 1000
//     }))
// })();


//deal router
server.use('/', require('./api/index.js')());

server.use((err,req,res,next) => {
    if(err.name === 'UnauthorizedError') {
        return res.send({status: 401, message: '无效的token'});
    }
    res.send({status: 500, message: '未知的错误'})
})

server.listen(3333, () => {
    console.log("running at http://localhost:3333");

});
