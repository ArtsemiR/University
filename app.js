var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const schema = require('./data/schema');
const graphQL = require('express-graphql');

const firebase = require('firebase');
firebase.initializeApp({
  apiKey: "AIzaSyDyr3_khOPO9azovFoWZuomKOw8MN9s0s0",
  authDomain: "university-26e9c.firebaseapp.com",
  databaseURL: "https://university-26e9c.firebaseio.com",
  projectId: "university-26e9c",
  storageBucket: "university-26e9c.appspot.com",
  messagingSenderId: "965388838124",
  appId: "1:965388838124:web:7fe5d6f0b377fe1a"
});

const firebaseAdmin = require('firebase-admin');
const firebaseServiceAccount = require('./university-26e9c-firebase-adminsdk-yufum-be1090d3a3');
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseServiceAccount),
  storageBucket: 'gs://university-26e9c.appspot.com'
});

// firebase.auth().signInWithEmailAndPassword('1@gmail.com', 'password')
//     .then(user=> {
//       console.log(user)
//     })
//     .catch(function(error) {
//       // Handle Errors here.
//       var errorCode = error.code;
//       var errorMessage = error.message;
//     }
// );

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const ordersRoutes = require('./routes/orders');
const ratingRoutes = require('./routes/rating');
const commentsRoutes = require('./routes/comments');

app.use('/', indexRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/orders', ordersRoutes);
app.use('/api/v1/rating', ratingRoutes);
app.use('/api/v1/comments', commentsRoutes);
app.use('/graphql', graphQL({ schema:schema, pretty:true }));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
