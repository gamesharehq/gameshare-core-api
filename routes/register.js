let router = require('express').Router();
let controller = require('../controllers/register');

router.post('/register', controller.register_user_post);

module.exports = router;