const express = require('express');
const userAuthenticate=require('../middleware/auth');
const groupController=require('../controllers/groupController');

const router= express.Router();

router.post('/addgroup',userAuthenticate.authenticate,groupController.addGroup);
router.get('/getgroups',userAuthenticate.authenticate,groupController.showgrps);
router.post('/addGroupUser',groupController.addGroupUser)

module.exports = router;