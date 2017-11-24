'use strict';
let debug = require('debug')('gameshare-core-api:games');
let async = require('async');
let mongoose = require('mongoose');
let Games = require('../../models/games');
let public_game_controller = require('../games');

//create a game (game/create/:id?)
exports.create_game = (req, res, next) => {
    
    debug('Game creation started by user: ' + req.userId);

    //run validation checks
    req.checkBody('title', 'Please provide a valid title').notEmpty();
    req.checkBody('release_year', 'Your provide the year the game was released').notEmpty();
    req.checkBody('category', 'You must select a category').notEmpty();
    req.checkBody('image', 'Game photo is required').notEmpty();
    req.checkBody('mode', 'The selected mode is not valid').notEmpty().isIn(['Sell', 'Exchange']);
   
    //sanitize the input
    req.sanitizeBody('title').escape();
    req.sanitizeBody('release_year').escape();
    req.sanitizeBody('category').escape();
    req.sanitizeBody('image').escape();
    req.sanitizeBody('mode').escape();

    //run the validation
    req.getValidationResult()
    .then((validation_result) => {

        if(!validation_result.isEmpty()){ //there is error
            
            let error = new Error(validation_result.array({ onlyFirstError: true })[0].msg);
            error.status = 400; //bad request

            debug('Encountered validation error: ' + error.message);
            return next(error);
        }

        //validate that category is a Mongo ObjectId
        try{
            let mongoose = require('mongoose');
            let category_id = mongoose.Types.ObjectId(req.body.category);
        }catch(err){ 

            debug('Invalid category id was posted');
            return next(new Error('Specified category is invalid'));
        }

        let game = new Games({
            user: req.userId,
            category: req.body.category,
            title: req.body.title,
            release_year: req.body.release_year,
            image: req.body.image,
            mode: req.body.mode,
            description: req.body.description,
            video: req.body.video
        });

        if(game.mode === 'Sell'){
            if(req.body.price) game.price = req.body.price;
            else{
                let err = new Error('Your must specify a price if you wish to sell a game');
                err.status = 400;
                return next(err);
            }
        }

        let callback = (err) => {
            if(err) return next(err);

            //fetch all games
            if(req.params.id) req.params.id = undefined; //to return all instead of one game for this user
            return public_game_controller.get_all_or_one_game(req, res, next);
        };

        //save
        if(req.params.id){ //if id parameter is specified, it's an edit
            game._id = req.params.id;
            Games.findOneAndUpdate({ _id: req.params.id, user: req.userId }, game, callback);
        }else game.save(callback);

    });

};

//update game status (/games/status/:id)
exports.update_game_status = (req, res, next) => {
    
    debug('Game status update started by user: ' + req.userId);

    //run validation checks
    req.checkBody('status', 'Please specify a valid status').notEmpty().isIn(['Enabled', 'Disabled']);
    req.sanitizeBody('status').escape(); //sanitize the input

    //run the validation
    req.getValidationResult()
    .then((validation_result) => {

        if(!validation_result.isEmpty()){ //there is error
            
            let error = new Error(validation_result.array({ onlyFirstError: true })[0].msg);
            error.status = 400; //bad request

            debug('Encountered validation error: ' + error.message);
            return next(error);
        }
 
        Games.findOneAndUpdate({ _id: req.params.id, user: req.userId }, { status: req.body.status }, { new: true }, (err, game) => {
            if(err) return next(err);

            debug('User successfully updated the game status');
            return public_game_controller.get_all_or_one_game(req, res, next);
        });

    });

};

