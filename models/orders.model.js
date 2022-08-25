let mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
     buyerId:String,
     sellerId:String,
     prod_list:[],
     date:Date
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
