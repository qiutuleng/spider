const mysql = require('../MySQL/MySQL.js');
const BaseModel = {};

BaseModel.create = (table, object) => {
    let columns = [];
    let values = '';
    for (let item in object) {
        if (object.hasOwnProperty(item)) {
            columns.push(item);
            values += '\'' + object[item] + '\',';
        }
    }
    values = values.slice(0, -1);
    return new Promise((resolve, reject) => {
        mysql.query(`INSERT INTO ${table} (${columns.join(',')}) VALUES (${values})`, (error, result) => {
            if (error) {
                return reject(error);
            } else {
                return resolve(result);
            }
        });
    })
};

BaseModel.all = table => {
    return new Promise((resolve, reject) => {
        mysql.query(`select * from ${table}`, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
};

module.exports = BaseModel;