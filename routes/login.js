let router = require('express').Router();
let controller = require('../controllers/login');

//POST user login
router.post('/login', controller.login_post);

module.exports = router;