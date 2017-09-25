'use strict';
let debug = require('debug')('gameshare-core-api:games');
let router = require('express').Router();
let async = require('async');
let mongoose = require('mongoose');
let Games = require('../../models/games');

router.get('/games', paginate);
router.get('/games/:page(\\d+)', paginate);

//create a game
router.post('/game/create/:id?', (req, res, next) => {
    
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
            else return next(new Error('Your must specify a price if you wish to sell a game'));
        }

        if(req.params.id){ //if id parameter is specified, it's an edit

            game._id = req.params.id;
            Games.findOneAndUpdate({ _id: req.params.id, user: req.userId }, game, { new: true }, (err, game) => {
                if(err) return next(err);

                debug('User edited the game successfully');
                return res.json(game);
            });

        }else{ //else is a new game being created

            game.save((err, game) => {
                if(err) return next(err);

                debug('User created game successfully');
                return res.json(game);
            });
        }

    });

});

//update game status
router.put('/game/status/:id', (req, res, next) => {
    
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
            return res.json(game);
        });

    });

});

//Get a particular game
router.get('/games/:id', (req, res, next) => {
    
    req.sanitizeParams('id').escape();

    try{

        let _id = req.params.id;

        Games.findOne({ _id: _id, user: req.userId })
        .populate('category', '_id name slug description')
        .populate('user', '_id email firstname lastname avatar phonenumber')
        .exec((err, game) => {

            if(err) return next(err);
            if(!game) return next(); //send to 404

            return res.json(game);
        });

    }catch(err){ return next (new Error("Invalid data requested - Game not found")); }

    
});

function paginate(req, res, next) {
        
    let perPage = 20;
    let page = (req.params.page ? req.params.page : 1) - 1;

    async.parallel({

        count: (cb) => Games.count({ user: req.userId }).exec(cb),
        games: (cb) => {
            Games.find({ user: req.userId })
            .limit(perPage)
            .skip(perPage * page)
            .sort({ date_created: 'desc' })
            .exec(cb)
        }

    }, function(err, result){

        if(err) return next(err);

        let data = {};
        data.perPage = perPage;
        data.count = result.count;
        data.currentPage = parseInt(req.params.page ? req.params.page : '1');
        data.games = result.games;

        return res.json(data);
    });
        
}

module.exports = router;