let mongoose = require("mongoose");

const BuyerSchema = new mongoose.Schema({
     name:String,
     email:String,
     password:String,
     authToken:String
});

const Buyer = mongoose.model("Buyer", BuyerSchema);

module.exports = Buyer;
