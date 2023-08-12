const express = require('express');
const Group = require('../models/groups');
const User = require('../models/users');
const UserGroup=require('../models/userGroup');

exports.addGroupUser=async(req,res,next)=>{
    const userMail=req.body.userMail;
    const groupID=req.body.groupId;
    const user=await User.findAll({where:{email:userMail}});
    if(user.length){
        console.log(user[0].id)
        const userInGroup=await UserGroup.findAll({where:{
            userId:user[0].id,
            groupId:groupID
        }})
        if(userInGroup.length){
            console.log(userInGroup)
            console.log("UserGroup Y")

            res.status(202).json(userInGroup)
        }else{
            console.log("UserGroup No")
            const result=await UserGroup.create({
                userId:user[0].id,
                groupId:groupID
            });
            res.status(200).json(result)

        }

    }else{
        console.log("No User Found")
        res.status(203).json(user)
    }
}
exports.addGroup=async (req,res,next)=>{
    const groupName = req.body.groupName;
    console.log(groupName,req.user.name,req.user.id)
    try{
        
        
        const newGroup  = await Group.create({ groupName:groupName,createrName:req.user.name});
        await UserGroup.create({
            userId: req.user.id,
            groupId: newGroup.id,
            // You can add additional attributes here if needed
        });
        res.status(200).json(newGroup)

    }catch(err){
        console.log(err)
        res.status(202).json({success:false,error:err})
    }
    
}
exports.showgrps=async(req,res,next)=>{
    try {
        const userId = req.user.id;

        // Find the user
        const userGroups = await UserGroup.findAll({
            where: {
                userId: userId
            },
            include: [
                {
                    model: Group,
                    attributes: ['id', 'groupName']
                }
            ]
        });

        return res.status(200).json(userGroups);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred while fetching user groups' });
    }

}