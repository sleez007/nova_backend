var express = require('express');
var router = express.Router();

const userController = require('../../controllers/user');

/* GET users listing. */
router.post('/all', userController.allMyContacts);



module.exports = router;
