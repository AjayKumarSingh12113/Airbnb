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

//router.get('/signup',userController.renderSignupForm);

//router.post('/signup',wrapsync(userController.signup));

//router.get('/login',userController.renderLoginForm);

// router.post('/login',passport.authenticate('local',{failureRedirect:"/login", failureFlash:true}),(req,res)=>{
//     req.flash("success" , "welcome back!");
//     res.redirect("/listings");
// });

// router.post(
//   '/login',saveRedirectUrl,
//   passport.authenticate('local', {
//     failureRedirect: '/login',
//     failureFlash: true,
//   }),
//   userController.login
// );

// router.get('/logout' , userController.logout);


// module.exports = router;