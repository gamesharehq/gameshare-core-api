'use strict';
let debug = require('debug')('gameshare-core-api:session');
let config = require('../config');
let jwt = require('jsonwebtoken');
let redis = require('redis');

//Connect to redis server
let redisClient = redis.createClient({ host: config.redis_host, port: config.redis_port });
redisClient.on("error", function (err) {
    debug("Redis Connection Error: " + err);
    throw err;
});

//Promisify some redis commands
const {promisify} = require('util');
const getAsync = promisify(redisClient.get).bind(redisClient);
const existsAsync = promisify(redisClient.EXISTS).bind(redisClient);


//generate a token and Save to redis store
let generateTokenAndSave = (data) => {
    var token = jwt.sign(data, config.app_secret);//no {expiresIn} option. - should happen on frontend/on redis when user logs out
    saveToken(token); //asynchronously save the Token to REDIS

    return token;
}

//save the token to redis store
let saveToken = (token) => {
    redisClient.set(token, "OK", (err, response) => {
        if(err){
            debug("Error Saving Token: " + err);
            return err;
        }

        debug("OK, Saved Token: " + response);
    });
}

//retriev a token from redis - useless because nothing valid is stored - tokens are keys in redis
let getToken = (token) => {

    getAsync(token).then((response) => {
        debug("OK, Got Token: " + response);
        return response;
    })
    .catch((err) => { 
        debug("Error Retrieving Token: " + err);
        return err; 
    });
}

//check is token is still in Redis
let isValidToken = (token) => {

    existsAsync(token).then((response) => {
        debug("OK, isValidToken: " + response);
        return response;

    })
    .catch((err) => { 
        debug("Error checking Token exists: " + err);
        return err; 
    });
}

//when token expires/user logs out, remove token from redis store
let destroyToken = (token) => {
    redisClient.del(token, (err, response) => {
        if(err){
            debug("Error Deleting Token: " + err);
            return err;
        }

        debug("OK, Destroyed Token: " + response);
    });
}

module.exports = {
    generateToken,
    saveToken,
    isValid,
    destroyToken
}