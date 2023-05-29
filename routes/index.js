// Импортируем роутер из express
const router = require('express').Router();

// Импортируем роутеры
const users = require('./users');
const movies = require('./movies');

// Импортируем контроллеры
const {
  createUser,
  login,
} = require('../controllers/users');

// Импортируем мидлвэрs
const auth = require('../middlewares/auth');
const {
  validationCreateUser,
  validationLogin,
} = require('../middlewares/validators');

// Импортируем классы ошибок
const NotFoundError = require('../errors/NotFound');

// Роутеры без авторизации
router.post('/signup', validationCreateUser, createUser);
router.post('/signin', validationLogin, login);

// Роутеры с авторизацией
router.use('/users', auth, users);
router.use('/movies', auth, movies);

// Роутер запросов по несуществующим адресам
router.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
