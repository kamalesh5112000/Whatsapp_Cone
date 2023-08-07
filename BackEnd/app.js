const express= require('express');


const dotenv=require('dotenv');
dotenv.config();

const cors = require('cors');
const bodyParser=require('body-parser');
const sequelize=require('./database/database');

const user = require('./models/users');

const userRoute=require('./routes/userRoute')


const app = express();


app.use(bodyParser.json({ extended: false }));
app.use(cors({
    origin:"*",
    credentials:true
}));

app.use(userRoute)

sequelize.sync().then(result=>{
    //console.log(result);
    app.listen(process.env.PORT || 3000);
}).catch(err=>console.log(err));