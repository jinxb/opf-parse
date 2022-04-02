const mysql = require('mysql2');

const MYSQL_HOST='localhost'
const MYSQL_PORT=3306
const MYSQL_DATABASE='book'
const MYSQL_USER='root'
const MYSQL_PASSWORD='******'
const connections = mysql.createPool({
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  database: MYSQL_DATABASE,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD
})
connections.getConnection((err, conn) => {
  conn.connect((err) => {
    if (err) {
      console.log("连接失败", err);
    } else {
      console.log("数据库连接成功！");
    }
  })
})

module.exports = connections.promise();