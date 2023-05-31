// Импортируем пакеты
const mongoose = require('mongoose');
const validator = require('validator');

const { INVALID_LINK } = require('../utils/constants');

// Создаем схему для пользователя через Mongoose
const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
      validate: {
        validator: (url) => validator.isURL(url),
        message: INVALID_LINK,
      },
    },
    trailerLink: {
      type: String,
      required: true,
      validate: {
        validator: (url) => validator.isURL(url),
        message: INVALID_LINK,
      },
    },
    thumbnail: { // миниатюрное изображение постера к фильму
      type: String,
      required: true,
      validate: {
        validator: (url) => validator.isURL(url),
        message: INVALID_LINK,
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    movieId: {
      type: Number,
      required: true,
    },
    nameRU: {
      type: String,
      required: true,
    },
    nameEN: {
      type: String,
      required: true,
    },
  },
  { versionKey: false },
);

// создаём модель и экспортируем её
module.exports = mongoose.model('movie', movieSchema);
