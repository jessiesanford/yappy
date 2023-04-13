// db.js
import mysql from 'mysql2'

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  port: 3306,
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD
})

export default async function excuteQuery({ query, values }: any) {
  return connection.promise().query(query, values).then((results) => {
    return results
  });
}
