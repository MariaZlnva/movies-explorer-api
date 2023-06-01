const {
  PORT = '3000',
  NODE_ENV,
  DB_ADDRESS,
  JWT_SECRET,
} = process.env;

// Значения переменых для режима разработки
const JWT_SECRET_DEV = 'jwt_key_dev';
const DB_ADDRESS_DEV = 'mongodb://127.0.0.1:27017/bitfilmsdb';

module.exports = {
  JWT_SECRET_DEV,
  DB_ADDRESS_DEV,
  PORT,
  DB_ADDRESS,
  NODE_ENV,
  JWT_SECRET,
};
