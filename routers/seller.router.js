const { register, signin, createCatalogue, getallOrders } = require("../controllers/seller.controller");
const verifyToken = require("../middlewares/auth");

const sellerRouter=require("express").Router();

sellerRouter.post("/register",register);
sellerRouter.post('/signin',signin);

sellerRouter.post('/create-catalog',verifyToken,createCatalogue)
sellerRouter.get('/orders',verifyToken,getallOrders)
module.exports=sellerRouter