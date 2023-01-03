require('dotenv').config();
const bodyParser = require('body-parser');
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
const auth = require('./middlewares/auth');
const { validateLogin } = require('./middlewares/validator');
const { handleErrors } = require('./middlewares/handleErrors');
const routerCrash = require('./errors/crashTest');

const { PORT = 3000 } = process.env;

const app = express();

const allowedCors = [
  'http://localhost:3000',
  'http://ageidar.nomoredomains.club',
  'https://ageidar.nomoredomains.club',
  'http://api.ageidar.nomoredomains.club',
  'https://api.ageidar.nomoredomains.club',
];

const cosrOptions = {
  origin: allowedCors,
  optionSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
  credentials: true,
};

app.use(cors(cosrOptions));

app.use(express.json());
app.use(bodyParser.json());
app.use(helmet());
app.use(cookieParser());

app.use(requestLogger);

app.use(routerCrash);

app.post('/signup', validateLogin, createUser);
app.post('/signin', validateLogin, login);
app.post('/logout', logOut);

app.use('/users', auth, router);
app.use('/cards', auth, routerCards);
app.use('*', notFoundError);

app.use(errorLogger);
app.use(errors());
app.use(handleErrors);

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
