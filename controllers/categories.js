'use strict';
let debug = require('debug')('gameshare-core-api:category');
let Categories = require('../models/category');
let Games = require('../models/games');

//GET all categories (or one category)
exports.get_all_categories = (req, res, next) => {

    let search = {};
    if(req.params.id) search = {_id: req.params.id};

    Categories.find(search)
    .then((categories) => {

        debug('Get all categories returned ' + categories.length + ' records');
        return res.json(categories);

    }).catch((err) => next(err));
};

//Get all games in a category by slug
exports.get_all_games_in_category = (req, res, next) => {
     
    req.sanitizeParams('slug').escape();

    Categories.findOne({ slug: req.params.slug })
    .then((category) => {

        if(!category) next(); //send to 404

        Games.find({ category: category._id})
        .populate('user', '_id email firstname lastname avatar phonenumber')
        .exec((err, games) => {
            if(err) return next(err);
        
            res.json({
                category: category,
                games: games
            });
        });
    })
    .catch((err) => next(err));

};