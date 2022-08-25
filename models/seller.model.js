let mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
     name:String,
     email:String,
     password:String,
     authToken:String
});

const Seller = mongoose.model("Seller", sellerSchema);

module.exports = Seller;
