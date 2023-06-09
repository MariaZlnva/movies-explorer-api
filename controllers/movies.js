// Импортируем схему модели
const Movie = require('../models/movie');

// Импортируем классы ошибок
const NotFoundError = require('../errors/NotFound');
const ForbiddenError = require('../errors/Forbidden');

// Импортируем переменные, содержащие сообщения ответов/ошибок
const {
  MOVIE_NOT_FOUND,
  DELETE_NOT_ALLOWED,
  MOVIE_DELETED,
} = require('../utils/constants');

// возвращает все сохранённые текущим  пользователем фильмы  GET /movie
const getUserMovies = (req, res, next) => {
  // console.log('пришел запрос на getUserMovies');
  const userId = req.user._id;
  Movie.find({ owner: userId })
    .populate('owner')
    .then((movies) => {
      res.send(movies);
    })
    .catch((err) => next(err));
};

const addMovieToSave = (req, res, next) => {
  console.log('пришел запрос на addMovieToSave');
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    // .populate('owner')
    .then((movie) => movie.populate('owner'))
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => next(err));
};

const deleteMovie = (req, res, next) => {
  console.log('пришел запрос на deleteMovie');
  const userId = req.user._id;
  const idMovieDB = req.params._id; // id фильма в сохраненных
  console.log(userId, idMovieDB);
  Movie.findById(idMovieDB)
    .populate([{ path: 'owner', model: 'user' }])
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(MOVIE_NOT_FOUND);
      }
      if (userId !== String(movie.owner._id)) {
        throw new ForbiddenError(DELETE_NOT_ALLOWED);
      }
      return movie.deleteOne();
    })
    .then((movie) => {
      res.send({ message: MOVIE_DELETED, movie });
    })
    .catch((err) => next(err));
};

module.exports = {
  getUserMovies,
  addMovieToSave,
  deleteMovie,
};
