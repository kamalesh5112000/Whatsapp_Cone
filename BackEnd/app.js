const express= require('express');

const dotenv=require('dotenv');
dotenv.config();

const cors = require('cors');
const bodyParser=require('body-parser');


const app = express();


app.use(bodyParser.json({ extended: false }));
app.use(cors());


sequelize.sync().then(result=>{
    //console.log(result);
    app.listen(process.env.PORT || 3000);
}).catch(err=>console.log(err));