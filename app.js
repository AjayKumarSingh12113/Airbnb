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
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}

const sessionOptions={
  secret: "mysecretcode",
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


// app.get("/fakeUser", async (req,res) =>{
//   let fakeUser = new User({
//     username:"ajaykumar",
//     email:"ajay@gmail.com"
//   });
//   let newUser = await User.register(fakeUser,"1234");
//   res.send(newUser);
// })


// app.get("/", (req, res) => {
//   res.send("Hello, World!");
// });
// Example: /listings/category/mountain
// app.get("/listings/category/:category", async (req, res) => {
//     const { category } = req.params;
//     const allListing = await Listing.find({ category });
//     res.render("listings/index.ejs", { allListing, activeCategory: category });
// });

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




// app.get('/testListing',async (req,res) =>{
//     let flist = new Listing({
//         title:'MY new Villa',
//         description: "By the beath",
//         price:1200,
//         location:'calanguala',
//         country:'Italy',
//     })
//     await flist.save();
//     console.log(flist);
    
//     res.send("Listing created");
// })

// app.get("/", (req, res) => {
//     res.send("Hello, World!")
// })