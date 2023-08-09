const express = require('express');
const Chats = require('../models/chats');
const sequelize=require('../database/database');

exports.getchats=async(req,res,next)=>{
    const chat=await Chats.findAll({
        attributes:['userName','message','userId']
    });
    res.json({chat:chat,cid:req.user.id})


}
exports.addChat=async (req,res,next)=>{
    const msg = req.body.msg;
    try{
        
        
        const result = await Chats.create({ message:msg,userName:req.user.name, userId:req.user.id});
        res.status(200).json(result)

    }catch(err){
        console.log(err)
        res.status(202).json({success:false,error:err})
    }
    
}