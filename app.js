'use strict';
let express = require('express');
let bodyParser = require('body-parser');

require('./db');
var app = express();

app.use(require('helmet')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('express-validator')());


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
  res.json({ error: err.message, status: err.status, trace: error.stack });
});

module.exports = app;
