const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const { JWT_SECRET_DEV } = require('../config');

// Импортируем класс ошибок
const UnauthorizedError = require('../errors/Unauthorized');

const auth = (req, res, next) => {
  console.log('пришли проходить аутентификацию');

  const { authorization } = req.headers;
  // убеждаемся, что заголовок есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  // если токен есть - извлекаем его и убираем приставку Bearer
  const token = authorization.replace('Bearer ', '');

  let payload;

  try { // проверяем что токен тот самый
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV);
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next();
};

module.exports = auth;
