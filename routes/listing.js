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
//index route
//router.get("/" , wrapAsync(listingController.index));

//new route
//router.get("/new" ,isLoggedIn,listingController.renderNewForm);

//show route
// router.get("/:id", wrapAsync(listingController.showListing));

//create route
//router.post("/" ,isLoggedIn, wrapAsync(listingController.createListing));

//edit route
// router.get(
//   "/:id/edit",
//   isLoggedIn,
//   isOwner,
//   wrapAsync(listingController.renderEditForm)
// );

//update route
// router.put(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   wrapAsync(listingController.updateListing)
// );

//delete route
// router.delete(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   wrapAsync(listingController.deleteListing)
// );

// module.exports = router;
