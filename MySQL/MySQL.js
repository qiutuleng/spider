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

module.exports = connection;