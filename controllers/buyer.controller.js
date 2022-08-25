require("dotenv").config();

const mongoose = require("mongoose");
const Buyer = require("../models/buyer.model");
const ObjectId = mongoose.Types.ObjectId;
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
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
         res.status(400).send({msg:"buyer succesfully registered",buyer:buyer})
        }
          
    } catch (error) {
        res.status(400).send({msg:error.message})
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
        res.status(400).send({msg:error.message})
    }
}

module.exports={
    register,
    signin
}