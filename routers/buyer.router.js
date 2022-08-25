const { register, signin } = require("../controllers/buyer.controller");

const buyerRouter=require("express").Router();

buyerRouter.post("/register",register);
buyerRouter.post('/signin',signin);

module.exports=buyerRouter