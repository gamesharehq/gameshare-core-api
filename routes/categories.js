let router = require('express').Router();
let controller = require('../controllers/categories');

//GET all or one category
router.get('/categories/:id?', controller.get_all_categories);

//GET all games in a category (by slug)
router.get('/categories/:slug', controller.get_all_games_in_category);

module.exports = router;