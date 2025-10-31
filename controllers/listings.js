const Listing = require('../model/listing');

module.exports.index = async(req,res) =>{
    let allListing = await Listing.find({});
    res.render("listings/index.ejs", {allListing});
}

module.exports.renderNewForm =  (req,res) =>{
    res.render("listings/new.ejs");
    //res.send("helloslsdfs")
}

module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    //let list = await Listing.findById(id).populate('reviews').populate("owner");
    let list = await Listing.findById(id)
    .populate({path:'reviews', populate:{
        path:'author',
    }})
    .populate("owner");
    res.render("listings/show.ejs" ,{list});
}

module.exports.createListing = async (req,res,next) =>{
        let url = req.file.path;
        let filename = req.file.filename;
        // console.log(url);
        // console.log(filename);
        if(!req.body.listing){
            throw new ExpressError(400,'Invalid Listing Data');
        }
        let newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = {url,filename};
        await newListing.save();
        req.flash('success', 'Successfully made a new listing!');
        res.redirect('/listings');
    
    //let {title, description,  location, country, price} = req.body;
    //let list = req.body.listing;
    //let newListing = new Listing(list);
    //console.log(newListing);
    
    // let newListing = new Listing({
    //     title,
    //     description,
    //     location,
    //     country,
    //     price
    // })
    // await newListing.save();
    // res.redirect('/listings');
    // console.log(newListing);
    // res.send("Listing created");
    
}


module.exports.renderEditForm = async(req,res) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    //console.log(listing);
    
    res.render("listings/edit.ejs" , {listing});
}

module.exports.updateListing = async(req,res) =>{
    let {id} = req.params;
    if(!req.body.listing){
        throw new ExpressError(400,'Invalid Listing Data');
    }
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !== 'undefined'){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    req.flash('success', 'Successfully updated listing!');
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async(req,res) =>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}