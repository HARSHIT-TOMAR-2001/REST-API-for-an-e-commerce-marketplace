const { register, signin, getallsellers, getlistofproducts, createOrder } = require("../controllers/buyer.controller");
const verifyToken = require("../middlewares/auth");

const buyerRouter=require("express").Router();

buyerRouter.post("/register",register);
buyerRouter.post('/signin',signin);

buyerRouter.get("/list-of-sellers",verifyToken,getallsellers)
buyerRouter.get("/seller-catalog/:seller_id",verifyToken,getlistofproducts)
buyerRouter.post("/create-order/:seller_id",verifyToken,createOrder)

module.exports=buyerRouter