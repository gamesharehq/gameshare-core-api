'use strict';
let debug = require('debug')('gameshare-core-api:games');
let router = require('express').Router();
let async = require('async');
let mongoose = require('mongoose');
let Games = require('../models/games');
let games_paginator = require('../helpers/games');

//Get all or one games
exports.get_all_or_one_game = (req, res, next) =>{
    let game_data = games_paginator(req, res, next);
    game_data.then((games) => {
        return res.json(games);
    });
};

//Get all games paginated
exports.get_paginated_games = (req, res, next) => {
    return exports.get_all_or_one_game(req, res, next);
};

