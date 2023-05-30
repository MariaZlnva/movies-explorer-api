// Импортируем схему модели
const Movie = require('../models/movie');

// Импортируем классы ошибок
const BadRequestError = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFound');
const ForbiddenError = require('../errors/Forbidden');

// возвращает все сохранённые текущим  пользователем фильмы  GET /movie
const getUserMovies = (req, res, next) => {
  console.log('пришел запрос на getUserMovies');
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
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные при создании карточки',
          ),
        );
      }
      next(err);
    });
};

const deleteMovie = (req, res, next) => {
  console.log('пришел запрос на deleteMovie');
  const userId = req.user._id;
  const idMovieDB = req.params._id; // id фильма в сохраненных
  Movie.findById(idMovieDB)
    .populate([{ path: 'owner', model: 'user' }])
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не найден');
      }
      if (userId !== String(movie.owner._id)) {
        throw new ForbiddenError('Нет прав на удаление данного фильма');
      }
      movie.deleteOne();
    })
    .then(() => {
      res.send({ message: 'Фильм удален' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные при удалении фильма',
          ),
        );
      }
      next(err);
    });
};

module.exports = {
  getUserMovies,
  addMovieToSave,
  deleteMovie,
};
