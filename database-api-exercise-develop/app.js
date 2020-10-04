/* eslint-disable no-unused-vars */
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const cors = require('cors');

const usersRouter = require('./routes/users');
const itemsRouter = require('./routes/items');
const reviewsRouter = require('./routes/reviews');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', usersRouter);

app.use('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  next();
});

app.use('/items', itemsRouter);
app.use('/reviews', reviewsRouter);

// error handler
app.use((error, req, res, next) => {
  res.status(error.status || 404);
  res.json({
    success: false,
    error: true,
    message: error.message,
  });
});

module.exports = app;
