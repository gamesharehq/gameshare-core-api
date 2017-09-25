'use strict';
let debug = require('debug')('gameshare-core-api:category');
let router = require('express').Router();
let Categories = require('../models/category');
let Games = require('../models/games');

//Get all categories
router.get('/categories', (req, res, next) => {

    Categories.find({})
    .then((categories) => {
        return res.json(categories);

    }).catch((err) => next(err));
});

//Get all games in a category
router.get('/categories/:slug', (req, res, next) => {
    
    req.sanitizeParams('slug').escape();

    Categories.findOne({ slug: req.params.slug })
    .then((category) => {

        Games.find({ category: category._id})
        .populate('category', '_id, name, slug')
        .populate('user', '_id, firstname, lastname, avatar, phonenumber')
        .exec((err, game) => {
            if(err) return next(err);
        
            res.json(game);
        });
    })
    .catch((err) => next(err));

});

module.exports = router;