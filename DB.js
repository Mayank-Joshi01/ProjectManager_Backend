// Connect to MongoDB

const mongoose = require('mongoose');

/// Geeting the URI from the .env file
const mongoURI = process.env.MONGODB_URI;

// Connecting to the database
const Connect = async () => {
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