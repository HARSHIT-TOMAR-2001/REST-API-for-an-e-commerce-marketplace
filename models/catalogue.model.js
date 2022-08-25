let mongoose = require("mongoose");

const catalogueSchema = new mongoose.Schema({
     sellerId:{
        type:String,
        unique:true
     },
     list:[{
        name:String,
        price:Number
    }]
});

const Catalogue = mongoose.model("Catalogue", catalogueSchema);

module.exports = Catalogue;
