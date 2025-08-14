const { createPool } = require("mysql");
const util = require('util');

const db = createPool({
  port: 3306,
  host: "db-1", //change to "localhost" for local
  user: "blab",
  password: "z2^E6J4$;u;d",
  database: "blab",
  connectionLimit: 10,
});

const getConnection = util.promisify(db.getConnection).bind(db);
const query = util.promisify(db.query).bind(db);

module.exports = { db, getConnection, query };