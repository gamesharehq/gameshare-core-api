'use strict';
let jwt = require('jsonwebtoken');
let debug = require('debug')('gameshare-core-api:authenticator');
let session = require('../helpers/session');
let config = require('../config');

module.exports = function(req, res, next){

    let error = new Error();
    error.message = 'Invalid token, failed to authenticate.';
    error.status = 401;
    error.stack = '';

    var token = req.headers['access-token'];
    if (!token){

        error.message = 'No access token found.';
        return next(error);
        //return res.status(403).json({ authenticated: false, message: '' });
    }

    jwt.verify(token, config.app_secret, (err, decoded_data) => {

        if (err){
            debug("JWT Error: " + err.message);
            return next(error);
        }
        
        //check if user token is in redis store
        session.isValidToken(token, (err, redisToken) => {
            if(err){
                debug(err);
                return next(error);
            }
            
            debug("Redis response: " + redisToken);
            
            // if everything good, save to request for use in other routes
            req.userId = decoded_data._id;
            req.userToken = token;
            req.userIsAdmin = decoded_data.is_admin;

            debug('Decoded User Id => ' + req.userId);

            next();
        });
        //end check if token is in redis

    });
}
