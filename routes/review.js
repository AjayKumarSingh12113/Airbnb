const express = require('express');
const router = express.Router({mergeParams:true});
const Listing = require("../model/listing");
const Rating = require("../model/review");
const {ratingSchema} = require("../schema");
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapsync");
const { isLoggedIn, isReviewAuthor } = require('../middleware');

const reviewControllers = require('../controllers/reviews')

const validateReview = (req,res,next) =>{
    const {error} = ratingSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(400, msg)
    } else{
        next();
    }
}


router.post('/',isLoggedIn,validateReview ,wrapAsync(reviewControllers.createReview));


// Delete review 
router.delete('/:reviewId',isLoggedIn,isReviewAuthor , wrapAsync(reviewControllers.deleteReview));

module.exports = router;