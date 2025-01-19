const User = require( "../model/User.js");
const UpdatePassword = require("../model/update_password.js");
const jwt = require( "jsonwebtoken");
const axios = require("axios");
const { transporter,Plain_Mail,OTP_Mail} = require("../controller/emailVerification.js");
const bcrypt = require("bcryptjs");
const {isValidObjectId} = require("mongoose");
const crypto = require("crypto");


/// Function to create random bytes
const createRandomoBytes = ()=>{
    return new Promise((resolve,reject)=>{
        crypto.randomBytes(30,(err,buf)=>{
            if(err){
                reject(err);
            }
            resolve(buf.toString("hex"));
        })
    })
}

/// Route : 1 
//// function to Send token to update password
const Update_Password_token = async (req,res)=>{
    try{
        const {email,password} = req.body;

        if(!email){
            return res.status(400).json({message:"Invalid Input",status:false});
        }

        const user  = await User.findOne({email:email});

        if(!user){
            return res.status(400).json({message:"Invalid Email",status:false});
        }

        if(password.length<8){
            return res.status(400).json({message:"Password length should be greater than 8",status:false});
        }
        
        
    /// Checking if old password is same as new password
    const old_password = user.password;
    const is_password_same = await bcrypt.compare(password,old_password);
    if(is_password_same){
     return res.status(400).json({message:"Old Password and New Password Cannot be same",err:1,status:false});
    }

        /// generating token
        let token = await createRandomoBytes();
        let hassedpassword = await bcrypt.hash(password,10);
        console.log(token)
        let hassedtoken = await bcrypt.hash(token,10);

        /// Checking if token is already sent
        const tonken_already_sent = await UpdatePassword.findOne({owner:user._id})
        console.log(tonken_already_sent)
        if(tonken_already_sent){
            return res.status(400).json({message:"Only  can update password atleast 1 hr later of last update",err:2,status:false});
        }

       // Saving the OTP in the database
       const varification = await UpdatePassword.create({
           owner:user._id,
           token:hassedtoken,
           password:hassedpassword
       })

       /// Sending the OTP to the user thruough email
      transporter.sendMail(OTP_Mail(email,`http://http://localhost:5173/reset_password?token=${token}&id=${user._id}`));


      return res.status(200).json({message:"OTP sent to your email",status:true});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

/// Route : 2
const Reset_password = async (req,res)=>{
    try{
const password = req.password;
console.log(password)
const user = req.user;

if(!password || !user){
    return res.status(400).json({message:"Some Internal Server Error",status:false});
}

if(!isValidObjectId(user.id)){
    return res.status(400).json({message:"Some Internal Server Error",status:false});
}

/// Updating the password
const Update_Completed = await User.findByIdAndUpdate(user._id,{password:password});

if(!Update_Completed){
    return res.status(400).json({message:"Some Internal Server Error",status:false});}

transporter.sendMail(Plain_Mail(user.email,"Password Updated Successfully"));

return res.status(200).json({message:"Password Updated Successfully",status:true});

    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }

}

/// Route : 3
//// To update uer Information like image , name , about

const Update_User_Info = async (req,res)=>{
    try{
        var Update_Completed;
        const {name,about} = req.body;
        const user = req.user;
        
         if(!user){
             return res.status(400).json({message:"User Dosent Exist",status:false});
        }

        if(!isValidObjectId(user.id)){
            return res.status(400).json({message:"Invalid Object ID",status:false});
        }

        if(!name || !about){
            return res.status(400).json({message:"Invalid Input",status:false});
        }

        if(!req.file){
              Update_Completed = await User.findByIdAndUpdate(user.id,{name:name,about:about});
              if(!Update_Completed){
                return res.status(400).json({message:"Some Internal Server Error",status:false});}
    
                const User_data = await User.findById(user.id);
              return res.status(200).json({message:"Your Info Updated Sucessfully",status:true,user:User_data});
        } 
        else{
            Update_Completed = await User.findByIdAndUpdate(user.id,{name:name,about:about,image:req.file.buffer});
            if(!Update_Completed){
                return res.status(400).json({message:"Some Internal Server Error",status:false});}
    
                const User_data = await User.findById(user.id);
            return res.status(200).json({message:"Image Updated Successfully",status:true,user:User_data});
        }

      

       
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error",status:false });
    }
}

module.exports = {Update_Password_token,Reset_password,Update_User_Info}
