require("dotenv").config();

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt");
const Seller = require("../models/seller.model");
const { remove } = require("../models/buyer.model");
const Catalogue = require("../models/catalogue.model");
const Order = require("../models/orders.model");
const register=async(req,res)=>{
    const {name,email,password}=req.body;
    try {
        const result=await Seller.findOne({email});
        if(result){
           return res.status(400).send({msg:"seler already exist with this email"});
        }
        else{
            const encryptedPassword=await bcrypt.hash(password,10);
            
            const token=jwt.sign({
               name:name,password:password 
            },process.env.TOKEN_KEY,{
                expiresIn:"2h"
            })
            const seller=new Seller({
                name,
                email,
                password:encryptedPassword,
                authToken:token,
            })
            await seller.save();
         res.status(200).send({success:true,msg:"seller succesfully registered",seller:seller})
        }
          
    } catch (error) {
        res.status(400).send({success:false,msg:error.message})
    }
}

const signin=async(req,res)=>{
    const {email,password}=req.body;
    try {
        const result=await Seller.findOne({email});
        if(result===null){
           return res.status(400).send({msg:"No seller exist with this email"});
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

            const updatedseller=await Seller.findByIdAndUpdate(result.id,{
                authToken:token
            })

           res.status(200).send({success:true,seller:updatedseller})
        }
    } catch (error) {
        res.status(400).send({success:false,msg:error.message})
    }
}

const createCatalogue=async(req,res)=>{
    const {sellerId,items}=req.body;
    try {
        const remove=await Catalogue.findOneAndDelete({sellerId});
        const newCatalogue=new Catalogue({
            sellerId,
            list:items
        })
        await newCatalogue.save();
        res.status(400).send({success:true,msg:"supplier catalogue updated"})
    } catch (error) {
        res.status(400).send({success:false,msg:error.message}) 
    }
}

const getallOrders=async(req,res)=>{
    const id=req.query.seller_id;
    try {

        const orders=await Order.find({sellerId:id});
        res.status(200).send({success:true,orders:orders})
    } catch (error) {
        res.status(400).send({success:false,msg:error.message}) 
    }
}
module.exports={
    register,
    signin,
    createCatalogue,
    getallOrders
}