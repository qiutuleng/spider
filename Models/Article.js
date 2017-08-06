const mysql = require('./BaseModel.js');
const articles = {};

articles.all = new Promise((resolve, reject) => {
    mysql.query(`select * from articles`, (error, result) => {
        if (error) {
            reject(error);
        } else {
            resolve(result);
        }
    });
});

articles.create = (object) => {
    return mysql.create('articles', object);
};

module.exports = articles;