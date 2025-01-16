const express =require("express")
const {Signup,Login,Googleauth} = require("../controller/auth_controller")
const { check} = require('express-validator');
const router = express.Router()


/// Route 1 : Google Auth
router.route("/googlelogin").post(Googleauth)

/// Route 2 : Login
router.post("/login",[
    check("email","Enter a valid email").isEmail(),
    check("password","Minimum Length is 8").isLength({min : 8})
],Login)

/// Route 3 : Signup
router.post("/signup",[
    check("name","Name is required").not().isEmpty(),
    check("email","Enter a valid email").isEmail(),
    check("password","Minimum Length is 8").isLength({min : 8})
],Signup);



module.exports = router