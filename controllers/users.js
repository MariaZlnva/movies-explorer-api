// Импортируем bcrypt модуль для хеширования пароля
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // импортируем модуль создания токенов

const { NODE_ENV, JWT_SECRET } = process.env;
// Импортируем схему модели
const User = require('../models/user');

// Импортируем классы ошибок
const BadRequestError = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFound');
const ConflictReqError = require('../errors/ConflictReq');

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
      console.log(err);
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      if (err.code === 11000) {
        next(
          new ConflictReqError(
            'Пользователь с таким электронным адресом уже зарегистрирован',
          ),
        );
      }
      next(err);
    });
};

// проверяет переданные в теле почту и пароль и возвращает JWT POST /signin
const login = (req, res, next) => {
  console.log('пришел запрос на авторизацию');
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна - email и пароль проверены
      // создадим токен
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'jwt_key_dev', {
        expiresIn: '7d',
      });
      // вернём токен
      res.send({ token });
    })
    .catch((err) => next(err));
};

const getUserData = (req, res, next) => {
  console.log('Пришел запрос на получение юзера');
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(user); // возвращает информацию о пользователе (email и имя)
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    });
};

const updateUserData = (req, res, next) => {
  console.log('Пришел запрос на updateUserData');
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(user); // обновляет информацию о пользователе (email и имя)
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    });
};

module.exports = {
  getUserData,
  updateUserData,
  createUser,
  login,
};
