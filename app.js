if (process.env.NODE_ENV != "production") {
  require('dotenv').config();
  
}
const express = require('express');
const app = express();
const port = 8000;
const mongoose = require('mongoose');
const Listing = require("./model/listing");
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapsync');
const ExpressError = require('./utils/ExpressError');
const Rating = require('./model/review');
const {ratingSchema} = require('./schema');
const ListingRoutes = require('./routes/listing');
const ReviewRoutes = require('./routes/review');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require("./model/user");
const userRoutes = require("./routes/userRoute");

app.use(express.static(path.join(__dirname, "public")));
app.set("views",path.join(__dirname, "views"));
app.set("view engine" , "ejs");
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);


main().then(() => console.log("Connected to MongoDB"))
.catch(err => console.log(err));
async function main(){
    await mongoose.connect(process.env.ATLAS_URL);
}

const store = MongoStore.create({
  mongoUrl: process.env.ATLAS_URL,
  crypto:{
    secret:process.env.SECRET
  },
  touchAfter:24*3600
});

store.on("error" , ()=>{
  console.log("session store error");
})

const sessionOptions={
  store:store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() + 7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  }
}

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
//passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) =>{
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currUser = req.user;
  next();
})

app.use("/listings", ListingRoutes);
app.use("/listings/:id/reviews" , ReviewRoutes);
app.use('/', userRoutes);



app.get("/listings/search", async (req, res) => {
  try {
    // 1️⃣ Get query parameter from URL (?query=India)
    const query = req.query.query?.trim();

    if (!query) {
      req.flash("error", "Please enter a destination to search!");
      return res.redirect("/listings");
    }

    // 2️⃣ Find all listings whose location matches the query (case-insensitive)
    const allListing = await Listing.find({
      location: { $regex: query, $options: "i" }
    });

    // 3️⃣ If no results found
    if (allListing.length === 0) {
      req.flash("error", `No listings found in "${query}".`);
      return res.redirect("/listings");
    }

    // 4️⃣ Render the same index page with filtered results
    console.log("done");
    
    res.send("allListing");
  } catch (error) {
    console.error("Search error:", error);
    req.flash("error", "Something went wrong while searching!");
    res.redirect("/listings");
  }
});

// Agar koi route match na ho
app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err,req,res,next) =>{
    let {status=500, message="bahut gatiya error"} = err;
    res.status(status).send(message);
    //res.send("revolved validation error");
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});




