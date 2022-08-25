require("dotenv").config();

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt");
const Seller = require("../models/seller.model");
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
         res.status(400).send({msg:"seller succesfully registered",seller:seller})
        }
          
    } catch (error) {
        res.status(400).send({msg:error.message})
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
        res.status(400).send({msg:error.message})
    }
}

module.exports={
    register,
    signin
}