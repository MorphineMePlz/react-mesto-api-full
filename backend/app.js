require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const router = require('./routes/users');

const routerCards = require('./routes/cards');
const {
  createUser, login, logOut,

} = require('./controllers/users');

const { notFoundError } = require('./controllers/notFound');
const {
  SERVER_ERROR,
} = require('./utils/constants');
const auth = require('./middlewares/auth');
const { validateLogin } = require('./middlewares/validator');

const { PORT = 3000 } = process.env;

const app = express();
const options = {
  origin: [
    'http://localhost:3000',
    'http://ageidar.nomoredomains.club',
    'https://ageidar.nomoredomains.club',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

app.use('*', cors(options));

app.use(express.json());
app.use(helmet());
app.use(cookieParser());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', validateLogin, createUser);
app.post('/signin', validateLogin, login);
app.post('/logout', logOut);

app.use('/users', auth, router);
app.use('/cards', auth, routerCards);
app.use('*', notFoundError);

app.use(errorLogger);
app.use(errors());

app.use((err, req, res) => {
  const { status = 500, message } = err;
  res
    .status(status)
    .send({
      message: status === SERVER_ERROR
        ? 'Ошибка сервера'
        : message,
    });
});

async function start() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
    app.listen(PORT, () => {
      console.log(`App is listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
