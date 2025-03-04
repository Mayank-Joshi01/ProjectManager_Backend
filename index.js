const dotenv = require('dotenv');

// To configure values coming form .env file
dotenv.config();


const express = require('express');
const cors = require('cors');
const Connect = require('./DB');
const app = express();
const auth_route = require("./routes/auth")
const user_route = require("./routes/user")
const project_route = require("./routes/project")


/// PORT
const PORT = process.env.PORT || 3000;

/// Connect to MongoDB
Connect();

/// Middlewer to deal with CORS
app.use(cors({
    origin: ['http://localhost:5174',"https://projects-manager-app.vercel.app"], // Allow requests only from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization','token'], // Specify allowed headers
    credentials: true, // Allow cookies if needed
  }));

/// Middlewer to deal with JSON data
app.use(express.json());
app.use(express.urlencoded({limit: '100mb', extended: true}));

/// Handeling routes 
app.use("/api/auth",auth_route)
app.use("/api/user",user_route)
app.use("/api/project",project_route)

app.get("/", (req, res) => {
    res.send("Hello World");
}
);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});