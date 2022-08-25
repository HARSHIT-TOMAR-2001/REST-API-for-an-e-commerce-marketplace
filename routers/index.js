const buyerRouter = require("./buyer.router");
const sellerRouter = require("./seller.router");

const Router = require("express").Router();

Router.use("/buyer",buyerRouter)
Router.use("/seller",sellerRouter)

module.exports = Router;