const { register, signin } = require("../controllers/seller.controller");

const sellerRouter=require("express").Router();

sellerRouter.post("/register",register);
sellerRouter.post('/signin',signin);

module.exports=sellerRouter