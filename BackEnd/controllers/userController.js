const express = require('express');
const User = require('../models/users');
const sequelize=require('../database/database');
const bcrypt=require('bcrypt');

async function emailValidate(email,phone){
    let emailflag=false;
    let phoneflag=false;
    let userobj=false;
    await User.findAll({where: {email:email}}).then(user=>{
        if(user.length>0){
            if(user[0].phone==phone){
                phoneflag=true
            }else{
                emailflag=user[0].email
                phoneflag = user[0].phone
                userobj=user
            }
        }

    })
    return [emailflag,phoneflag,userobj]

}
exports.addUser=async (req,res,next)=>{
    try{
        const nam = req.body.name;
        const email = req.body.email;
        const phone = req.body.phone;
        const password = req.body.password;
        console.log(nam,email,phone,password)
        
        const [emailflag,phoneflag]=await emailValidate(email,phone)
        console.log(emailflag,phoneflag)
        if(emailflag){
            res.status(202).json({message:"Email Already Exists"})
        }else if(phoneflag){
            res.status(203).json({message:"Phone Already Exists"})

        }
         else{
            const saltrounds=10;
            bcrypt.hash(password,saltrounds,async(err,hash)=>{
                console.log(err)
                await User.create({
                    name:nam,
                    email:email,
                    phone:phone,
                    password:hash
            
                })
                 res.status(205).json({message:'User Created Successfully'})
            })
        }

    }catch(err){
        console.log(err)
        res.status(202).json({message:err})
    }
    
    
}