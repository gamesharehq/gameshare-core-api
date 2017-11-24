'use strict';
let express = require('express');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let debug = require('debug')('gameshare-core-api:app');

require('./db');
var app = express();

app.use(morgan('dev'));
app.use(require('helmet')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('express-validator')());

//Public Routes
app.use('/', require('./routes/login'));
app.use('/', require('./routes/register'));
app.use('/', require('./routes/games'));
app.use('/', require('./routes/categories'));

//Authentication Middleware - prevents access to user route without a valid token
app.use(require('./middleware/authenticator'));

//User Routes
app.use('/account', require('./routes/games'), require('./routes/account/games'));

//Authenticate if user is Admin before accessing admin routes
app.use((req, res, next) => {
    if(!req.userIsAdmin){
      let err = new Error("Invalid Admin Token")
      err.status = 401; err.stack = '';
      next(err);
    }else next();
});

//Admin Routes
app.use('/admin', require('./routes/admin/categories'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // return the error response
  res.status(err.status || 500);

  debug('Returning Error Response => ' + err.message );
  debug('Error Stack => ' + err.stack);

  res.json(
    { 
      error: err.message, 
      status: err.status || 500, 
      trace: req.app.get('env') === 'development' ? err.stack : '' 
    });
});

module.exports = app;
