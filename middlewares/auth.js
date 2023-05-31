const jwt = require('jsonwebtoken');

const { JWT_SECRET_DEV, NODE_ENV, JWT_SECRET } = require('../utils/config');

// Импортируем класс ошибок
const UnauthorizedError = require('../errors/Unauthorized');

const { UNAUTHORIZED_USER } = require('../utils/constants');

const auth = (req, res, next) => {
  // console.log('пришли проходить аутентификацию');

  const { authorization } = req.headers;
  // убеждаемся, что заголовок есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError(UNAUTHORIZED_USER));
  }

  // если токен есть - извлекаем его и убираем приставку Bearer
  const token = authorization.replace('Bearer ', '');

  let payload;

  try { // проверяем что токен тот самый
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV);
  } catch (err) {
    return next(new UnauthorizedError(UNAUTHORIZED_USER));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next();
};

module.exports = auth;
