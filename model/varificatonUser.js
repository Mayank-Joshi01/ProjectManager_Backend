const mongoose = require("mongoose")

const varificationSchma = new mongoose.Schema({
owner:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"User"
},
otp:{
    type:String,
    required:true
},
createdAt:{
    type:Date,
    default:Date.now,
    expires:3600
}
})

const Uservarification = mongoose.model("Uservarification",varificationSchma)

module.exports = Uservarification
