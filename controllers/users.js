const User = require('../model/user');


module.exports.renderSignupForm = (req,res)=>{
    //res.send("Signup Page");
    res.render('users/signup.ejs');
}


module.exports.signup = async(req,res)=>{
    try {
        const {username, email, password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success" , "signup completed");
            res.redirect("/listings");
        })
    } catch (error) {
        req.flash("error" , error.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req,res)=>{
    res.render('users/login.ejs');
}


module.exports.login = (req, res) => {
    // res.send('Logged in successfully');
    req.flash('success', 'welcome back!');
    res.redirect(res.locals.redirectUrl || '/listings');
}


module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
          next(err);
        }
        req.flash('success', 'logged out successfully!');
        res.redirect('/listings');
    })
}