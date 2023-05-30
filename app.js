// Импортируем модуль
require('dotenv').config();

// Импортируем npm-пакеты
const express = require('express');

// Cоздаём приложение методом express
const app = express();
const mongoose = require('mongoose');

// Импортируем мидлвары
const cors = require('cors');
const { errors } = require('celebrate');
const helmet = require('helmet');
const errorHandler = require('./middlewares/errorHandler');
const limiter = require('./middlewares/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { corsOptions } = require('./middlewares/cors');

// Импортируем переменные
const {
  NODE_ENV, PORT, DB_ADDRESS_DEV, DB_ADDRESS,
} = require('./config');

// Импортируем роутеры
const router = require('./routes/index');

// Подключаемся к серверу mongo
mongoose.connect(NODE_ENV === 'production' ? DB_ADDRESS : DB_ADDRESS_DEV, {
  useNewUrlParser: true,
});

app.use(cors(corsOptions)); // настройка кросс-домен. запр.
app.use(limiter); // ограничивает количество запросов с одного IP
app.use(helmet()); // автом.простав.заголовки безопастности

// Миддлвэры для парсинга входящих данных со стороны клиента
app.use(express.json()); // для собирания JSON-формата
app.use(express.urlencoded({ extended: true }));

// Логгер запросов
app.use(requestLogger);

// Роутинг
app.use(router);

// Обработчики ошибок
app.use(errorLogger); // Логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(errorHandler); // централизованная обработка

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
