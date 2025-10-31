const Listing = require('../model/listing');
const Rating = require('../model/review');

module.exports.createReview = async(req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Rating(req.body.review);
    newReview.author = req.user._id;
    //console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    console.log("new review saved");
    //res.send("new review saved");
    res.redirect(`/listings/${id}`);
    //res.redirect(`/listings/${listing/id}`)
    
}


module.exports.deleteReview = async(req,res) =>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id , {$pull : {reviews: reviewId}})
    await Rating.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}