const mongoose = require("mongoose")

const userSchma = new mongoose.Schema({
name:{
    type:String,
    required:true,
    trim:true
},
email:{
    type:String,
    required:true,
    trim:true
},
password:{
    type:String,
    required:true
},
image:{
    type:Buffer,
    default:null
}
})

const User = mongoose.model("User",userSchma)

module.exports = User
