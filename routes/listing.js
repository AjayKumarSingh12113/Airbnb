const express = require("express");
const router = express.Router();
const Listing = require("../model/listing");
const Rating = require("../model/review");
const { ratingSchema } = require("../schema");
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapsync");
const flash = require("connect-flash");
const { isLoggedIn, isOwner } = require("../middleware");


const listingController = require("../controllers/listings");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingController.index))
  //.post(isLoggedIn, wrapAsync(listingController.createListing)
   .post(
    isLoggedIn,
    upload.single("listing[image]"),
    wrapAsync(listingController.createListing)
  );

router.get("/search", wrapAsync(async (req, res) => {
  const query = req.query.query?.trim();

  if (!query) {
    req.flash("error", "Please enter a destination to search!");
    return res.redirect("/listings");
  }

  const allListing = await Listing.find({
    location: { $regex: query, $options: "i" },
  });

  if (allListing.length === 0) {
    req.flash("error", `No listings found for "${query}".`);
    return res.redirect("/listings");
  }

  res.render("listings/index.ejs", { allListing, searchQuery: query, activeCategory: null });
}));



router.get("/category/:category", wrapAsync(async (req, res) => {
    const { category } = req.params;
    const allListing = await Listing.find({ category });
    res.render("listings/index.ejs", { allListing, activeCategory: category });
}));
router.get("/new", isLoggedIn, listingController.renderNewForm);


router
    .route("/:id")
    .get( wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        wrapAsync(listingController.updateListing)
    )
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.deleteListing)
);


router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
