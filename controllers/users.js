// Импортируем bcrypt модуль для хеширования пароля
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // импортируем модуль создания токенов

// Импорт классов ошибок из mongoose.Error
const { CastError, ValidationError } = require('mongoose').Error;

const { NODE_ENV, JWT_SECRET } = process.env;
const { JWT_SECRET_DEV } = require('../utils/config');

// Импортируем схему модели
const User = require('../models/user');

// Импортируем классы ошибок
const NotFoundError = require('../errors/NotFound');
const ConflictReqError = require('../errors/ConflictReq');
const BadRequestError = require('../errors/BadRequest');

// Импортируем сообщения ответов
const {
  USER_REGISTERED,
  USER_NOT_FOUND,
  INVALID_USER_DATA,
  INVALID_DATA,
} = require('../utils/constants');

// создаёт пользователя с переданными в теле  email, password и name  POST /signup
const createUser = (req, res, next) => {
  console.log('создаем юзера');
  const {
    email, password, name,
  } = req.body;
  // хешируем пароль перед добавлением в БД
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictReqError(USER_REGISTERED));
      } else if (err instanceof ValidationError) {
        next(new BadRequestError(INVALID_USER_DATA));
      } else {
        next(err);
      }
    });
};

// проверяет переданные в теле почту и пароль и возвращает JWT POST /signin
const login = (req, res, next) => {
  console.log('пришел запрос на авторизацию');

  const { email, password } = req.body;
  console.log(email, password);
  User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна - email и пароль проверены
      // создадем токен
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV, {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch((err) => next(err));
};

const getUserData = (req, res, next) => {
  console.log('Пришел запрос на получение юзера');
  console.log(req.user);
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND);
      } else {
        res.send(user); // возвращает информацию о пользователе (email и имя)
      }
    })
    .catch((err) => next(err));
};

const updateUserData = (req, res, next) => {
  // console.log('Пришел запрос на updateUserData');
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND);
      } else {
        res.send(user); // обновляет информацию о пользователе (email и имя)
      }
    })
    // .catch((err) => next(err));
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError(INVALID_DATA));
      } else if (err instanceof ValidationError) {
        next(new BadRequestError(INVALID_USER_DATA));
      } else if (err.code === 11000) {
        next(new ConflictReqError(USER_REGISTERED));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUserData,
  updateUserData,
  createUser,
  login,
};
