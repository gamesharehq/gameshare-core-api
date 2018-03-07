'use strict';
let debug = require('debug')('gameshare-core-api:login');
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let stringify = require('json-stringify-safe');
let gameHelper = require('../helpers/games');
let session = require('../helpers/session');
let User = require('../models/user');
let config = require('../config');

/* GET: perform user logout */
/* ROUTE: /auth/logout */
exports.logout = (req, res, next) => {
    debug("User is logging out");

    if(!req.userToken){
        return res.json();
    }

    debug("User token is " + req.userToken);
    session.destroyToken(req.userToken);
    
    return res.json();
}

/* POST: perform user login */
/* ROUTE: /auth/login */
exports.login = (req, res, next) => {
    
    //validate posted info
    req.checkBody('email', 'Please provide a valid email').isEmail();
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
            let user_data = _.pick(user, ['_id', 'email', 'firstname', 'lastname', 'phonenumber', 'address', 'status', 'avatar', 'is_admin']);
            var token = jwt.sign(user_data, config.app_secret, { expiresIn: config.token_expiration }); 

            debug('User logged in: token =' + token);
            debug('Fetching user account data');

            //get games for this user - first out the user id in request stream
            req.userId = user._id;
            let game_data = gameHelper(req, res, next);
            
            game_data.then((userGames) => {

                debug("GAME DATA RETRIEVED => (" + req.userId + "): " + stringify(userGames));
                user_data.datecreated = user.datecreated;

                let data = {
                    authenticated: true, 
                    token: token,
                    user: user_data,
                    games: userGames
                };
                res.json(data);

            })
            .catch((error) =>{
                next(error);
            });
            
        });// end finding a user
        
    });// end validation run
};