const { SERVER_ERROR } = require('../utils/constants');

const errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err; // если у ошибки нет статуса, выставляем 500
  res.status(statusCode).send({
    message: statusCode === 500
      ? SERVER_ERROR
      : message,
  });
  next();
};

module.exports = errorHandler;
