const express= require('express');


const dotenv=require('dotenv');
dotenv.config();

const cors = require('cors');
const bodyParser=require('body-parser');
const sequelize=require('./database/database');

const user = require('./models/users');
const chats = require('./models/chats');

const userRoute=require('./routes/userRoute')
const chatRoute=require('./routes/chatRoute');
const { TSConstructorType } = require('babel-types');

const app = express();


app.use(bodyParser.json({ extended: false }));
app.use(cors({
    origin:"*",
    credentials:true
}));

app.use(userRoute)
app.use(chatRoute)

user.hasMany(chats);
chats.belongsTo(user);

sequelize.sync().then(result=>{
    //console.log(result);
    app.listen(process.env.PORT || 3000);
}).catch(err=>console.log(err));