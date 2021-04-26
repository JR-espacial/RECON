const mysql = require('mysql2');

const pool = mysql.createPool({
    host: '34.70.212.76',
    user: 'root',
    database: 'RECON',
    password: 'Natdev1234!', 
});

module.exports = pool.promise();