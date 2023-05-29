const {
  // JWT_SECRET = 'jwt_key_dev',
  PORT = '3000',
  DB_ADDRESS = 'mongodb://127.0.0.1:27017/bitfilmsdb',
} = process.env;

module.exports = {
  // JWT_SECRET,
  PORT,
  DB_ADDRESS,
};
