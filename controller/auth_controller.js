const User = require( "../model/User.js");
const Uservarification = require( "../model/varificatonUser.js");
const jwt = require( "jsonwebtoken");
const axios = require("axios");
const { validationResult } = require('express-validator');
const {generateOTP , transporter,generatePlainEmail,generateOtpEmail} = require("../controller/emailVerification.js");
const bcrypt = require("bcryptjs");
const  oAuth2Client  = require("../utils/Google_Config.js");
const {isValidObjectId} = require("mongoose");

/// Google Auth

const Googleauth = async (req, res) => {
    var user;
    try {
        // Getting user data from frontend
        const Data = req.body;

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
    const {email,name,picture}=data;

    // Checking if the user already exist or not
        user = await User.findOne({email:email});

    if (user){
        let token = jwt.sign({email:email,id:user._id},process.env.JWT_SECRET);

        return res.status(201).json({status:true,data:user,token:token,img:picture})
    }
    else{
        // Creating a new user
        user = await User.create({
            name:name,
            email:email,
            password:"googleLogin",
            isVerified:true
        })

        // Generating token 
         token = jwt.sign({email:email,id:user._id},process.env.JWT_SECRET);

         // Sending data to frontend         
         return res.status(201).json({status:true,data:user,token:token,img:picture})

    }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error",status:false });
        
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
       return  res.status(500).json({ message: "Internal Server Error" ,status:false});
    }
};


/// Signup

const Signup = async (req, res) => {
    var OTP,hassedOTP;

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

       // Checking if the user exist and is already verified
       if(user && user.isVerified){
        return res.status(400).json({message:"Invalid Credentials",status:false});
       }


       // Checking if the user exist and is not verified
       if(user && !user.isVerified){

        /// checking if the OTP is already sent
        const otp_sent_already = await Uservarification.countDocuments();

        /// Deleting the old OTP
        if(otp_sent_already>0){ const old_otp_deleted = await Uservarification.findOneAndDelete({owner:user._id}); }

        /// generating OTP
        OTP = generateOTP();
        hassedOTP = await bcrypt.hash(OTP.toString(),10);

       // Saving the OTP in the database
       const varification = await Uservarification.create({
           owner:user._id,
           otp:hassedOTP
       })

       /// Sending the OTP to the user thruough email
      transporter.sendMail(generateOtpEmail(email,OTP));

       // Sending data to frontend
       return res.status(201).json({status:true,data:user})
        }

       /// Hashing the password from user using salt 
       const salt = await bcrypt.genSalt(10);
       const hash_password = await bcrypt.hash(password,salt)
       
       // Creating a new user 
       user = await new User({
        name:name,
        email:email,
        password:hash_password
       })

       /// generating OTP
       OTP = generateOTP();
       hassedOTP = await bcrypt.hash(OTP.toString(),10);

       // Saving the OTP in the database
       const varification = await Uservarification.create({
           owner:user._id,
           otp:hassedOTP
       })

       /// Sending the OTP to the user thruough email
      transporter.sendMail(generateOtpEmail(email,OTP));

       // Saving the user in the database
       user = await user.save();


       // Sending data to frontend
       return res.status(201).json({status:true,data:user})

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error",status:false });
    }
};

/// To Resend OTP
const ResendOTP = async (req, res) => {
    try{ var OTP;
        const {email} = req.body;

        if(!email){
            return res.status(400).json({message:"Invalid Input",status:false});
        }

        const user  = await User.findOne({email:email});

        if(!user){
            return res.status(400).json({message:"Invalid Email",status:false});
        }

        const old_otp_deleted = await Uservarification.findOneAndDelete({owner:user._id});

        if(!old_otp_deleted){
            return res.status(400).json({message:"Sooory Internal Server Error",status:false});
        }

        else{
        /// generating OTP
         OTP = generateOTP();
        console.log(OTP)
        let hassedOTP = await bcrypt.hash(OTP.toString(),10);

       // Saving the OTP in the database
       const varification = await Uservarification.create({
           owner:user._id,
           otp:hassedOTP
       })
    }

       /// Sending the OTP to the user thruough email
      transporter.sendMail(generateOtpEmail(email,OTP));

      return res.status(200).json({message:"OTP sent to your email",status:true});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error",status:false });
    }}


/// To verify Email
const verifyEmail = async (req, res) => {
    try{
        const {id,otp} = req.body;

        // Checking for invalid inputs
        if(!id || !otp.trim()){
            return res.status(400).json({message:"Invalid OTP ppp",status:false});
        }

        // Checking for valid id
        if(!isValidObjectId(id)){
            return res.status(400).json({message:"Invalid User",status:false});
        }

        // Finding the user
        const user = await User.findById(id);

        if(!user){
            return res.status(400).json({message:"Invalid User",status:false});
        }

        /// Checking if the user is already verified
        if(user.isVerified){
            return res.status(400).json({message:"User already verified",status:false});
        }

        const varification = await Uservarification.findOne({owner:id});

        if(!varification){
            return res.status(400).json({message:"Sooory User Not Found",status:false});
        }

        /// Comparing the OTP
        const isOTPValid = await bcrypt.compare(otp,varification.otp);
        if(!isOTPValid){
            return res.status(400).json({message:"Invalid OTP",status:false});
        }

        user.isVerified = true;

        /// sending Welcome Email
        transporter.sendMail(generatePlainEmail(user.email,"Welcome Email","Welcome to our website"));

        await Uservarification.findByIdAndDelete(varification._id);

        await user.save();

        // Generating token
       const token = jwt.sign({email:user.email,id:user._id},process.env.JWT_SECRET);

       // Sending data to frontend
       return res.status(201).json({status:true,token:token,data:user})

    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
}
}

/// Authenticate User
const Authenticate = async(req,res)=>{
const user_id  = req.user.id;

if(!user_id){
    return res.status(401).json({message:"Unauthorized",status:false});
}
const user = await User.findById(user_id);

if(!user){
    return res.status(401).json({message:"Unauthorized",status:false});

}
if(user.isVerified){
    return res.status(200).json({status:true,data:user});

}
}

module.exports = { Googleauth, Login, Signup, verifyEmail , ResendOTP,Authenticate};