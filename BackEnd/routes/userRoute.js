const express = require('express');
const router= express.Router();
const UserController=require('../controllers/userController');

router.post('/',UserController.addUser);


module.exports=router;