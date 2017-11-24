let router = require('express').Router();
let controller = require('../controllers/games');

//GET all or one game
router.get('/games/:id?', controller.get_all_or_one_game);

//GET paginated games list
router.get('/games/:page(\\d+)', controller.get_paginated_games);

module.exports = router;