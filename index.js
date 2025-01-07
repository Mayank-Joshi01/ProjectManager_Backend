const express = require('express');
const Connect = require('./DB');
const app = express();
const auth_route = require("./routes/auth")
const dotenv = require('dotenv');

/// PORT
const PORT = 5000

// To configure values coming form .env file
dotenv.config();


/// Connect to MongoDB
Connect();

/// Middlewer to deal with JSON data
app.use(express.json());

/// Handeling routes 
app.use("/api/auth",auth_route)

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});