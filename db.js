'use strict';
let mongoose = require('mongoose');
let config = require('./config');
let debug = require('debug')('gameshare-core-api:db');

const db = mongoose.connect(config.database, { useMongoClient: true });
db.on('error', console.error.bind(console, 'Database Connection Error: '));

debug('Database Connected');

mongoose.Promise = global.Promise; //use the default promises library for mongoose
module.exports = mongoose;