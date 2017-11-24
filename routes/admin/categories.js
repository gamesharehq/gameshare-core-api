let router = require('express').Router();
let controller = require('../../controllers/admin/categories');

router.post('/category/:id?', controller.creat_update_category);

module.exports = router;