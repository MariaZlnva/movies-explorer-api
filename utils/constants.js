// Переменные, содержащие сообщения об ошибках/ответах
const USER_REGISTERED = 'Пользователь с указанным электронным адресом уже зарегистрирован';
const USER_NOT_FOUND = 'Пользователь не найден';
const MOVIE_NOT_FOUND = 'Фильм не найден';
const DELETE_NOT_ALLOWED = 'Нет прав на удаление';
const MOVIE_DELETED = 'Фильм удален';
const UNAUTHORIZED_USER = 'Необходима авторизация';
const SERVER_ERROR = 'На сервере произошла ошибка';
const PAGE_NOT_FOUND = 'Страница не найдена';
const INVALID_EMAIL = 'Некорректный адрес почты';
const INCORRECT_EMAIL_PASSWORD = 'Неправильные почта или пароль';
const INVALID_LINK = 'Некорректная ссылка';
const INVALID_USER_DATA = 'Переданы некорректные данные';
const INVALID_DATA = 'Некорректные данные';

const REGEX_URL = /https*:\/\/(www.)?([a-y0-9-]+).([a-y]{2,10})((\/[\w^\W/]+))?#?/;

module.exports = {
  USER_REGISTERED,
  USER_NOT_FOUND,
  MOVIE_NOT_FOUND,
  DELETE_NOT_ALLOWED,
  MOVIE_DELETED,
  UNAUTHORIZED_USER,
  SERVER_ERROR,
  PAGE_NOT_FOUND,
  INCORRECT_EMAIL_PASSWORD,
  INVALID_EMAIL,
  INVALID_LINK,
  INVALID_USER_DATA,
  INVALID_DATA,
  REGEX_URL,
};
