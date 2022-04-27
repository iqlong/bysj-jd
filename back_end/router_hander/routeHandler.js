const db = require('../back_end/db/index');

function getHomeDatas(getHomeStr, res) {
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
module.exports = {
    getHomeDatas,
}
