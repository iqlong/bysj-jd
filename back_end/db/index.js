const mysql = require('mysql');
module.exports = mysql.createPool({
    host: 'localhost',
    user: 'root',
    // password: 'huangche201314',
    password: '118097',
    // database: 'bysj',
    database: 'myigou'

})
