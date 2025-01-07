const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI;
const Connect = async ()=>{
    try {
        await mongoose.connect(mongoURI)
        console.log("Sucessfully connected to database")
    } catch (error) {
        console.error("database connection failed");
        console.log(error);
        process.exit(0);
    }
}
 module.exports = Connect