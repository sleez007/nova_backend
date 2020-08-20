const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../../controllers/auth');
const multerConfig = require('../../config/multer');

router.post('/phone_verification',[
        body('telNo').trim().isMobilePhone().withMessage('Invalid phone number!'),
        body('country').trim().isLength({min:2, max:60}).withMessage('Invalid country!')
    ],
    authController.phoneVerification
);

router.post('/otp_verification', [
        body('telNo').trim().isMobilePhone().withMessage('Invalid phone number!'),
        body('otp_code').trim().trim().isLength({min:4,max:4}).withMessage('Invalid Otp!')
    ],
    authController.optVerification
)

router.post('/:folder/:sub_folder/:name', multerConfig.upload.single('file'), authController.createProfile)

module.exports = router;

