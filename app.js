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
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { corsOptions } = require('./middlewares/cors');

// Импортируем переменные
const { PORT, DB_ADDRESS } = require('./config');

// Импортируем роутеры
const router = require('./routes/index');

// Подключаемся к серверу mongo
mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
});

// Миддлвэры для парсинга входящих данных со стороны клиента
app.use(express.json()); // для собирания JSON-формата
app.use(express.urlencoded({ extended: true }));

app.use(cors(corsOptions));

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
