const express = require('express');
const wrapsync = require('../utils/wrapsync');
const router = express.Router();
const User = require('../model/user');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');

const userController = require('../controllers/users');

router
    .route('/signup')
    .get(userController.renderSignupForm)
    .post(wrapsync(userController.signup)
);

router.route('/login')
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate('local', {
            failureRedirect: '/login',
            failureFlash: true,
        }),
        userController.login
);

router.get('/logout' , userController.logout);


module.exports = router;

