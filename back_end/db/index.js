const mysql = require('mysql');
module.exports = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Zhanghuilong1231',
    database: 'bysj',
    multipleStatements: true

})
