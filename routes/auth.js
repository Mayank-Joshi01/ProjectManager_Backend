const express =require("express")
const router = express.Router()


/// Route 1 : Register User 
router.post("/register",(req,res)=>{
    res.status(201).send("Register")
})

// Route 2 : Login User
router.post("/login",(req,res)=>{
    res.status(201).send("Login")
})

module.exports = router