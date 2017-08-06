const MySQL = require('mysql');
let connection = MySQL.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'spider'
});

connection.connect(error => {
    if (error) throw error;
});

connection.create = (table, object) => {
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
        connection.query(`INSERT INTO ${table} (${columns.join(',')}) VALUES (${values})`, (error, result) => {
            if (error) {
                return reject(error);
            } else {
                return resolve(result);
            }
        });
    })
};

module.exports = connection;