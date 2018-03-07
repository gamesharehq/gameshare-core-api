'use strict';
let config = {};

//app
config.app_port     =       process.env.PORT || '3000';
config.app_secret   =       process.env.APP_SECRET || '2max-abh4-6k10-5hjx-8gks';

//Database 
config.database     =       process.env.DB || 'mongodb://root:chameleon@gamesharecluster-shard-00-00-53khx.mongodb.net:27017,gamesharecluster-shard-00-01-53khx.mongodb.net:27017,gamesharecluster-shard-00-02-53khx.mongodb.net:27017/gameshare_db?ssl=true&replicaSet=GameShareCluster-shard-0&authSource=admin';

//Redis
config.redis_host   =     process.env.REDIS_HOST || 'redis-18200.c11.us-east-1-2.ec2.cloud.redislabs.com';
config.redis_port   =     process.env.REDIS_PORT || '18200';

module.exports = config;