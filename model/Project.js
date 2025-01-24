const mongoose = require("mongoose")

const Project_Schema = new mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    Project_Name:{
        type:String,
        required:true
    },
     Pending_Task:{
            type:Array,
            required:true
        },
        Completed_Task:{
            type:Array,
            required:true
        },
    link:{
        type:String,
        default:"",
    }   
})

const Project = mongoose.model("Project",Project_Schema)

module.exports = Project