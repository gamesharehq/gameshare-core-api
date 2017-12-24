'use strict';
let jwt = require('jsonwebtoken');
let debug = require('debug')('gameshare-core-api:authenticator');
let config = require('../config');

module.exports = (req, res, next) => {

    var token = req.headers['access-token'];
    if (!token) return res.status(403).json({ authenticated: false, message: 'No access token found.' });

    jwt.verify(token, config.app_secret, (err, decoded_data) => {

        if (err){
            return res.status(500).json({ authenticated: false, message: 'Failed to authenticate token.' });
        }

        req.userId = decoded_data._id;

        // if everything good, save to request for use in other routes
        debug('Access token verified successfully!');
        debug('Decoded User Id => ' + req.userId);

        next();
    });
}
