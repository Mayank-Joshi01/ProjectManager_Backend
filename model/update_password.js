const mongoose = require("mongoose")

const passwordUpdateSchema = new mongoose.Schema({
owner:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"User"
},
token:{
    type:String,
    required:true
},
createdAt:{
    type:Date,
    default:Date.now,
    expires:3600
},
password:{
    type:String,
    required:true
},
})

const UpdatePassword = mongoose.model("UpdatePassword",passwordUpdateSchema)

module.exports = UpdatePassword
