const mysql = require('mysql2');
const mysqlPromise = require('mysql2/promise');

const getDbConfig = () => {
  const {
    DB_HOST,
    DB_USER,
    DB_PASS,
    DB_NAME,
    DB_PORT,
    DB_CONNECTION_LIMIT,
  } = process.env;

  if (!DB_HOST || !DB_USER || !DB_NAME) {
    throw new Error('Missing required DB env vars: DB_HOST, DB_USER, DB_NAME');
  }

  return {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    port: DB_PORT ? Number(DB_PORT) : 3306,
    waitForConnections: true,
    connectionLimit: DB_CONNECTION_LIMIT ? Number(DB_CONNECTION_LIMIT) : 10,
    queueLimit: 0,
    charset: 'utf8mb4',
  };
};

const dbConfig = getDbConfig();

const promisePool = mysqlPromise.createPool(dbConfig);
const sessionPool = mysql.createPool(dbConfig);

module.exports = {
  promisePool,
  sessionPool,
};
