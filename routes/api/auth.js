const express = require('express');
const router = express.Router();
const { check, body } = require('express-validator');
const authController = require('../../controllers/auth');

router.post('/phone_verification',[
        body('telNo').trim().isMobilePhone().withMessage('Invalid telephone number!'),
        body('country').trim().isLength({min:2, max:60}).withMessage('Invalid country!'),
        body('fbToken').trim().isLength({min:5, max:300}).withMessage('Invalid Token!'),
        body('access_token').trim().isLength({min:5, max:300}).withMessage('Invalid Access token!')
    ],
    authController.phoneVerification
);

module.exports = router;

