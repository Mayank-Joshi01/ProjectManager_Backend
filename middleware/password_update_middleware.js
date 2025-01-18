const User = require('../model/User');
const UpdatePassword = require("../model/update_password.js");
const bcrypt = require('bcryptjs');
const {isValidObjectId} = require('mongoose');

const Reset_password_middleware = async (req,res,next)=>{
    try{
        const {token,id} = req.query;

        if(!token || !id){
            return res.status(400).json({message:"Invalid Input",status:false});
        }

        if(!isValidObjectId(id)){
            return res.status(400).json({message:"Invalid Input",status:false});
        }

        const user = await User.findById(id);

        if(!user){
            return res.status(400).json({message:"Invalid Input",status:false});
        }

        const Reset_Password = await UpdatePassword.findOne({owner:user._id});

        if(!Reset_Password){
            return res.status(400).json({message:"Reset Token Not Find",status:false});
        }

        const isMatch = await bcrypt.compare(token,Reset_Password.token);

        if(!isMatch){
            return res.status(400).json({message:"Invalid Token",status:false});
        }

        req.user = user;
        req.password = Reset_Password.password;

next();
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = Reset_password_middleware