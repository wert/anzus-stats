var express = require('express');
var router = express.Router();

// Require controller modules.
var user_controller = require('../controllers/userController');


/// user ROUTES ///

router.post('/user/login', user_controller.login);
router.post('/user/create', user_controller.create);
router.post('/user/delete', user_controller.delete);
router.post('/user/update', user_controller.update);


router.post('/player/lookup', user_controller.player_lookup);
router.post('/garage/lookup', user_controller.garage_lookup);

module.exports = router;