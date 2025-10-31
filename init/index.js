const initdata = require("./data");
const mongoose = require("mongoose");
const Listing = require("../model/listing");


main().then(() => console.log("Connected to MongoDB"))
.catch(err => console.log(err));
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}


const initfun = async () => {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((data) => ({...data , owner : '68f9c71b01b2b2b7a18ec9ac'}));
    await Listing.insertMany(initdata.data);
    console.log("Data Initialized");
}

initfun();

