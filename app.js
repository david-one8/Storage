const dotenv = require('dotenv')
dotenv.config();
const express = require('express');
const userRoute = require('./routes/user.routes');
const homeRoute = require('./routes/home.routes');
const connectDB = require('./config/db')
connectDB();
const cookieParser = require('cookie-parser');
const app = express();


app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route - redirect to login page
app.get('/', (req, res) => {
    res.redirect('/user/login');
});

app.use('/user', userRoute)
app.use('/home', homeRoute) // Changed from '/' to '/home' to avoid conflict with root route


app.listen(3000,()=>{
  console.log('Server is running on port 3000');
})