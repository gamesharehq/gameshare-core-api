'use strict';
let jwt = require('jsonwebtoken');
let debug = require('debug')('gameshare-core-api:authenticator');
let config = require('../config');

module.exports = function(req, res, next){

    let error = new Error();
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
            error.message = 'Invalid token, failed to authenticate.';
            return next(error);
        }
        
        //TODO: check if user is in database and is active

        req.userId = decoded_data._id;
        req.userIsAdmin = decoded_data.is_admin;

        // if everything good, save to request for use in other routes
        debug('Access token verified successfully!');
        debug('Decoded User Id => ' + req.userId);

        next();
    });
}
