// Импортируем роутер
const router = require('express').Router();

// Импортируем валидаторы валидируют входящий запрос
const {
  validationDataMovie,
  validationIdMovie,
} = require('../middlewares/validators');

// Импортируем контроллеры
const {
  getUserMovies,
  addMovieToSave,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getUserMovies);
router.post('/', validationDataMovie, addMovieToSave);
router.delete('/:_id', validationIdMovie, deleteMovie);

module.exports = router;
