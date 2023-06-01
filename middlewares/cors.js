const corsOptions = {
  origin: [
    'https://movies.zlnva.nomoredomains.rocks',
    'http://movies.zlnva.nomoredomains.rocks',
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
