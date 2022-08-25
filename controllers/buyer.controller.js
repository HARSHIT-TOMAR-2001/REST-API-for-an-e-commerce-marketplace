require("dotenv").config();

const mongoose = require("mongoose");
const Buyer = require("../models/buyer.model");
const ObjectId = mongoose.Types.ObjectId;
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt");
const Seller = require("../models/seller.model");
const Catalogue = require("../models/catalogue.model");
const Order = require("../models/orders.model");
const register=async(req,res)=>{
    const {name,email,password}=req.body;
    try {
        const result=await Buyer.findOne({email});
        if(result){
           return res.status(400).send({msg:"Buyer already exist with this email"});
        }
        else{
            const encryptedPassword=await bcrypt.hash(password,10);
            
            const token=jwt.sign({
               name:name,password:password 
            },process.env.TOKEN_KEY,{
                expiresIn:"2h"
            })
            const buyer=new Buyer({
                name,
                email,
                password:encryptedPassword,
                authToken:token,
            })
            await buyer.save();
         res.status(200).send({msg:"buyer succesfully registered",buyer:buyer})
        }
          
    } catch (error) {
        res.status(400).send({success:false,msg:error.message})
    }
}

const signin=async(req,res)=>{
    const {email,password}=req.body;
    try {
        const result=await Buyer.findOne({email});
        if(result===null){
           return res.status(400).send({msg:"No Buyer exist with this email"});
        }
        else{
           const encryptedPassword=await bcrypt.compare(password,result.password);
           if(!encryptedPassword)return res.status(400).send({msg:"wrong password"})

            const token=jwt.sign({
               name:result.name,
               password:password 
            },process.env.TOKEN_KEY,{
                expiresIn:"2h"
            })

            const updatedbuyer=await Buyer.findByIdAndUpdate(result.id,{
                authToken:token
            })

           res.status(200).send({success:true,buyer:updatedbuyer})
        }
    } catch (error) {
        res.status(400).send({success:false,msg:error.message})
    }
}

const getallsellers=async(req,res)=>{
    try {
        const sellers=await Seller.find();
        res.status(200).send({success:true,list:sellers})
    } catch (error) {
        res.status(400).send({success:false,msg:error.message})
    }
}
const getlistofproducts=async(req,res)=>{
    const id=req.params.seller_id;
    try {
        const list=await Catalogue.findOne({sellerId:id});
        res.status(200).send({success:true,list:list})
    } catch (error) {
        res.status(400).send({success:false,msg:error.message})
    }
}

const createOrder=async(req,res)=>{
  const id=req.params.seller_id;
  const {items,buyerId}=req.body;
  try {
    const order=new Order({
        sellerId:id,
        buyerId,
        prod_list:items,
        date:new Date()
    })
    await order.save();
    res.status(200).send({success:true,msg:"Order successfully created"})
  } catch (error) {
    res.status(400).send({success:false,msg:error.message})
  }
} 

module.exports={
    register,
    signin,
    getallsellers,
    getlistofproducts,
    createOrder
}