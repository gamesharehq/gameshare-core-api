let router = require('express').Router();
let controller = require('../controllers/login');

//POST user login
router.post('/login', controller.login);

//GET user logout
router.get('/logout', controller.logout);

module.exports = router;