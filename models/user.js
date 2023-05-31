// Импортируем пакеты
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// Импортируем класс ошибок
const UnauthorizedError = require('../errors/Unauthorized');

const { INVALID_EMAIL, INCORRECT_EMAIL_PASSWORD } = require('../utils/constants');

// Создаем схему для пользователя через Mongoose
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => validator.isEmail(email), // isEmail()проверяет явл ли строка email
        message: INVALID_EMAIL, // если validator - false выведется это сообщение
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
    },
  },
  // чтобы пароль не отправлялся при регистрации и отключаем поле "__v"
  { toJSON: { useProjection: true }, toObject: { useProjection: true }, versionKey: false },
);

// доб.собств.метод в св-во statics - проверяет почту и пароль на соотв.в БД
userSchema.statics.findUserByCredentials = function (email, password) {
  // console.log('пришли проверять наличие в БД емайл и пароль');
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError(INCORRECT_EMAIL_PASSWORD));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) { // хеши не совпали — отклоняем промис
            return Promise.reject(new UnauthorizedError(INCORRECT_EMAIL_PASSWORD));
          }
          return user;
        });
    });
};
// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);
