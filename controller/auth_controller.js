const User = require( "../model/User.js");
const jwt = require( "jsonwebtoken");
const axios = require("axios");
const { validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const  oAuth2Client  = require("../utils/Google_Config.js");

/// Google Auth

const Googleauth = async (req, res) => {
    var user;
    try {
        // Getting user data from frontend
        const Data = req.body;
        console.log(Data);

        // Creating a new OAuth2Client
        oAuth2Client.setCredentials({
        access_token: Data.access_token,
        token_type: Data.token_type,
        scope: Data.scope,
        expiry_date: Date.now() + Data.expires_in * 1000, // Calculate expiration time
    });

    // Getting the user data from google
    const {data} = await axios.get(`https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=${Data.access_token}`, {   
        headers: {
            Authorization: `Bearer ${Data.access_token}`
        }
    });

    // Destructuring the data from google
    const {email,name,image}=data;

    // Checking if the user already exist or not
        user = await User.findOne({email:email});

    if (user){
        let token = jwt.sign({email:email,id:user._id},process.env.JWT_SECRET);

        return res.status(201).json({status:true,data:user,token:token,img:image})
    }
    else{

        // Creating a new user
        user = await User.create({
            name:name,
            email:email,
            password:"googleLogin"
        })

        // Generating token 
         token = jwt.sign({email:email,id:user._id},process.env.JWT_SECRET);

         // Sending data to frontend
         return res.status(201).json({status:true,data:user,token:token,img:image})

    }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
        
    }
    
};


/// Login

const Login = async (req, res) => {

    /// Checking for the invalid inputs form user
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(),status:false});
    }

    try {
        // Getting user data from fronted
        const { email, password } = req.body;

        //// Finding if the user exists or not
        const user = await User.findOne({email:email})

        /// Returning false if the user does not exist
        if(!user){
            return res.status(404).json({ status: false ,message:"Invalid credentials" });
        }

        /// Comparing the password
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        
        /// Returning false if the password is incorrect
        if (!isPasswordCorrect) {
            return res.status(400).json({ status: false, message: "Invalid credentials" });
        }

        /// Generating the token
        const token = jwt.sign({ email: user.email, id: user._id },process.env.JWT_SECRET);

        return res.status(201).json({status:true,token:token,data:user})


    } catch (error) {
        console.log(error);
       return  res.status(500).json({ message: "Internal Server Error" });
    }
};


/// Signup

const Signup = async (req, res) => {

    console.log(req.body);
    /// Checking for the invalid inputs form user
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(400).json({ errors: errors.array() , status :false});
    }

    try {
        // Getting user data from frontend
       const {name,email,password} = req.body;

       // Checking if the user already exist or not
       let user = await User.findOne({email:email});

       if(user){
        return res.status(400).json({message:"Invalid Credentials",status:false});
       }

       /// Hashing the password from user using salt 
       const salt = await bcrypt.genSalt(10);
       const hash_password = await bcrypt.hash(password,salt)
       
       // Saving the user data into database 
       user = await User.create({
        name:name,
        email:email,
        password:hash_password
       })

       // Generating token
       const token = jwt.sign({email:email,id:user._id},process.env.JWT_SECRET);

       // Sending data to frontend
       return res.status(201).json({status:true,token:token,data:user})

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { Googleauth, Login, Signup };