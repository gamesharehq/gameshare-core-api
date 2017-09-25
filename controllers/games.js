'use strict';
let debug = require('debug')('gameshare-core-api:games');
let router = require('express').Router();
let async = require('async');
let Games = require('../models/games');

//Get all games
router.get('/games', paginate);

//Get all games paginated
router.get('/games/:page(\\d+)', paginate);

//Get a particular game
router.get('/games/:id', (req, res, next) => {
    
    req.sanitizeParams('id').escape();

    let _id = req.params.id;
    Games.findById(_id)
    .populate('category', '_id, name, slug')
    .populate('user', '_id, firstname, lastname, avatar, phonenumber')
    .exec((err, game) => {
       if(err) return next(err);
       
       res.json(game);
    });
});

function paginate(req, res, next) {
        
    let perPage = 20;
    let page = (req.params.page ? req.params.page : 1) - 1;

    async.parallel({

        count: (cb) => Games.count({ status: 'Enabled' }).exec(cb),
        games: (cb) => {
            Games.find({ status: 'Enabled' })
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