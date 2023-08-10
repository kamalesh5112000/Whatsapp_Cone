const express = require('express');
const Chats = require('../models/chats');
const { Op } = require('sequelize');
const sequelize=require('../database/database');

exports.getchats=async(req,res,next)=>{
    const lastMsgId= req.query.lastMsgId;
    console.log("Last Message ID: ",lastMsgId)
    const chat=await Chats.findAll({
        attributes:['id','userName','message','userId'],
        where: { id: { [Op.gt]: lastMsgId }}
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

// const express = require('express');
// const { Op } = require('sequelize'); // Import the Op property from Sequelize
// const Chats = require('../models/chats');
// const sequelize = require('../database/database');

// exports.getchats = async (req, res, next) => {
//     const chat = await Chats.findAll({
//         attributes: ['userName', 'message', 'userId', 'createdAt'],
//         order: [['createdAt', 'ASC']]
//     });

//     res.json({ chat: chat, cid: req.user.id });
// };

// exports.getNewChats = async (req, res, next) => {
//     try{
//         const timestamp = req.query.timestamp; // Extract timestamp from the request query

//         let whereCondition = {}; // Initialize an empty where condition

//         // Check if timestamp is provided and valid
//         if (timestamp) {
//             whereCondition = {
//                 createdAt: { [sequelize.Op.gt]: new Date(timestamp) }
//             };
//         }

//         try {
//             const newChats = await Chats.findAll({
//                 where: whereCondition, // Apply the where condition
//                 attributes: ['userName', 'message', 'userId', 'createdAt']
//             });

//             res.json({ newChats:newChats,cid:req.user.id });
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({ error: 'An error occurred while fetching new chats.' });
//         }

//     }catch(err){
//         console.log(err)

//     }
    
// };

// exports.addChat = async (req, res, next) => {
//     const msg = req.body.msg;
//     try {
//         const result = await Chats.create({ message: msg, userName: req.user.name, userId: req.user.id });

//         res.status(200).json(result);
//     } catch (err) {
//         console.log(err);
//         res.status(202).json({ success: false, error: err });
//     }
// };