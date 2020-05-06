const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressValidator = require('express-validator');
const multer = require('multer');
const upload = multer({dest: './uploads'});
const flash = require('connect-flash');
const bcrypt = require('bcryptjs');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const db = mongoose.connection;

const routes = require('./routes/index');
const users = require('./routes/users');

const app = express();

//console.log('log 1 dentro do app.js');

// // view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//console.log('Log 2 dentro do app.js');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//console.log('Log 3 dentro do app.js');

// Handle Sessions
app.use(session({
   secret:'secret',
  saveUninitialized: true,
   resave: true
 }));

//console.log('Log 3 dentro do app.js');

 // Passport
 app.use(passport.initialize());
 app.use(passport.session());

 // Validator
 app.use(expressValidator({
   errorFormatter: function(param, msg, value) {
       const namespace = param.split('.')
       , root    = namespace.shift()
       , formParam = root;

     while(namespace.length) {
       formParam += '[' + namespace.shift() + ']';
     }
     return {
       param : formParam,
       msg   : msg,
       value : value
     };
   }
 }));

//console.log('Log 4 dentro do app.js');

 app.use(cookieParser());
 app.use(express.static(path.join(__dirname, 'public')));

 app.use(flash());
 app.use(function (req, res, next) {
   res.locals.messages = require('express-messages')(req, res);
   next();
 });

//console.log('Log 5 dentro do app.js');

 app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
   next();
 });

//console.log('Log 6 dentro do app.js');

 app.use('/', routes);
 app.use('/users', users);

//console.log('Log 7');

// catch 404 and forward to error handler
 app.use(function(req, res, next) {
   const err = new Error('Not Found');
   err.status = 404;
   next(err);
 });

 // error handlers

//console.log('Log 8 dentro do app.js');

// development error handler
 // will print stacktrace
 if (app.get('env') === 'development') {
   app.use(function(err, req, res, next) {
     res.status(err.status || 500);
     res.render('error', {
       message: err.message,
       error: err
     });
   });
 }

//console.log('Log 9 dentro do app.js');

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
   res.render('error', {
     message: err.message,
     error: {}
   });
 });


 module.exports = app;
