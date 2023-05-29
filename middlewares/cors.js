const corsOptions = {
  origin: [
    // 'https://mesto.zlnva.nomoredomains.monster',
    // 'http://mesto.zlnva.nomoredomains.monster',
    'https://localhost:3000',
    'http://localhost:3000',
    'https://localhost:3001',
    'http://localhost:3001',
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

module.exports = corsOptions;
