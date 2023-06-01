// Импортируем роутер
const router = require('express').Router();

// Импортируем контроллеры
const {
  getUserData,
  updateUserData,
} = require('../controllers/users');

// Импортируем валидаторы валидируют входящий запрос
const { validationUpdateUser } = require('../middlewares/validators');

// Роутеры
router.get('/me', getUserData);
router.patch('/me', validationUpdateUser, updateUserData);

module.exports = router;
