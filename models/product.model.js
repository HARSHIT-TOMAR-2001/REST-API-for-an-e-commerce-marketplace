let mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
     sellerId:String,
     name:String,
     price:Number
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
