'use strict';
let config = {};

config.app_port = process.env.PORT || '3000';
config.app_secret = process.env.APP_SECRET || '2max-abh4-6k10-5hjx-8gks';

config.database = process.env.DB || 'mongodb://root:chameleon@gamesharecluster-shard-00-00-53khx.mongodb.net:27017,gamesharecluster-shard-00-01-53khx.mongodb.net:27017,gamesharecluster-shard-00-02-53khx.mongodb.net:27017/gameshare_db?ssl=true&replicaSet=GameShareCluster-shard-0&authSource=admin';

config.token_expiration = 86400; //expire in 24Hrs

module.exports = config;