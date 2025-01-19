const express = require("express")
const {Update_Password_token,Reset_password,Update_User_Info} = require("../controller/update_user_info")
const Reset_password_middleware = require("../middleware/password_update_middleware")
const user_middleware = require("../middleware/user_middleware")
const router = express.Router()
const multer = require("multer")
const upload = multer()

router.post("/updatepassword",Update_Password_token)
router.post("/reset_password",Reset_password_middleware,Reset_password)
router.post("/update_user_info",upload.single("file"),user_middleware,Update_User_Info)

module.exports = router