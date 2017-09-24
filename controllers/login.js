'use strict';
let debug = require('debug')('gameshare-core-api:login');
let router = require('express').Router();
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let User = require('../models/user');
let config = require('../config');

router.post('/login', (req, res, next) => {
    
    //validate posted info
    req.checkBody('email', 'Your email is invalid').isEmail();
    req.checkBody('password', 'Your Password is required').notEmpty();

    //cleanup data
    req.sanitizeBody('email').escape();
    req.sanitizeBody('password').escape();

    req.getValidationResult()
    .then((validation_result) => {

        if(!validation_result.isEmpty()){

            let error = new Error(validation_result.array({ onlyFirstError: true })[0].msg);
            error.status = 400; //bad request

            debug("Encountered validation error: " + error.message);
            return next(error);
        }

        User.findOne({ email: req.body.email }, (err, user) => {

            if (err) return next(err);

            if (!user){
                err = new Error('Account does not exist');
                err.status = 404;
                return next(err);
            }

            if (!bcrypt.compareSync(req.body.password, user.password)) {
                 
                err = new Error('Login failed, your password is incorrect');
                err.status = 401;
                return next(err);
            }

            //check if account is active
            if(user.status === 'Disabled'){
                err = new Error('Login failed, your account is disabled');
                err.status = 401;
                return next(err);
            }

            // create a token
            let _ = require('lodash');
            let token_data = _.pick(user, ['_id', 'email', 'firstname', 'lastname']);
            var token = jwt.sign(token_data, config.app_secret, { expiresIn: config.token_expiration }); 

            debug('User logged in: token =' + token);

            let data = {
                authenticated: true, 
                token: token,
                user: user
            };
            res.json(data);

        });// end finding a user
        
    });// end validation run
});

module.exports = router;