const jwt = require('jsonwebtoken');

const { JWT_SECRET_DEV, NODE_ENV, JWT_SECRET } = require('../utils/config');

// Импортируем класс ошибок
const UnauthorizedError = require('../errors/Unauthorized');

const { UNAUTHORIZED_USER_TOKEN_NOTFOUND, UNAUTHORIZED_USER_TOKEN_INCORRECT } = require('../utils/constants');

const auth = (req, res, next) => {
  console.log('пришли проходить аутентификацию');

  const { authorization } = req.headers;
  console.log('проверяем наличие токена в авторизайшн');
  // убеждаемся, что заголовок есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError(UNAUTHORIZED_USER_TOKEN_NOTFOUND));
  }
  // если токен есть - извлекаем его и убираем приставку Bearer
  const token = authorization.replace('Bearer ', '');
  let payload;
  console.log('токен есть - проверим тот ли он самый');
  try { // проверяем что токен тот самый
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV);
  } catch (err) {
    return next(new UnauthorizedError(UNAUTHORIZED_USER_TOKEN_INCORRECT));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next();
};

module.exports = auth;
