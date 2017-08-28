const MySQL = require('mysql');

let mysqlConfig  = config('database.connections.mysql');
let connection = MySQL.createConnection({
    host: mysqlConfig.host,
    port: mysqlConfig.port,
    user: mysqlConfig.username,
    password: mysqlConfig.password,
    database: mysqlConfig.database,
    charset: mysqlConfig.charset,
});

connection.connect(error => {
    if (error) throw error;
});

module.exports = connection;
