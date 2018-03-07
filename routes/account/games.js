let router = require('express').Router();
let controller = require('../../controllers/account/games');

//POST or EDIT a game
router.post('/games/create/:id?', controller.create_game);

//PUT update a game status
router.put('/games/status/:id', controller.update_game_status);

module.exports = router;