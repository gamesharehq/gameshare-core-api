'use strict';
let config = {};

config.app_port = process.env.PORT || '3000';
config.app_secret = process.env.APP_SECRET || '2max-abh4-6k10-5hjx-8gks';
config.database = process.env.DB || 'mongodb://root:chameleon@localhost:27017/gameshare?authSource=admin';

module.exports = config;