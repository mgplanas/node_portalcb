const mysql = require('mysql');


function Connection() {
    this.pool = null;

    this.init = function() {
        this.pool = mysql.createPool({
            //   debug: configuration.debug,
            connectionLimit: process.env.MYSQL_CON_LIMIT,
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DB,
            dateStrings: process.env.MYSQL_DATESTRINGS
        });
    };

    this.acquire = function(callback) {
        this.pool.getConnection(function(err, connection) {
            callback(err, connection);
        });
    };
}

module.exports = new Connection();