const mongoose = require("mongoose")

const Project_Schema = new mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
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
        required:true
    }   
})

const Project = mongoose.model("Project",Project_Schema)

module.exports = Project