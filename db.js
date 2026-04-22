const mysql=require("mysql2/promise");

const db=mysql.createPool({
  host:"localhost",
  user:"root",
  password:"root123",
  database:"node_coding"
})

module.exports=db;