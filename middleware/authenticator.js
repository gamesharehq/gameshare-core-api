'use strict';
let jwt = require('jsonwebtoken');
let config = require('../config');

module.exports = (req, res, next) => {

    var token = req.headers['access-token'];

    if (!token)
        return res.status(403).json({ authenticated: false, message: 'No access token found.' });

    jwt.verify(token, config.app_secret, (err, decoded_data) => {
        if (err)
            return res.status(500).json({ authenticated: false, message: 'Failed to authenticate token.' });

        // if everything good, save to request for use in other routes
        req.userId = decoded._id;
        next();
    });
}
