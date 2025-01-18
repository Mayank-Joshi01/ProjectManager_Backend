const express = require("express")
const {Update_Password_token,Reset_password} = require("../controller/update_user_info")
const Reset_password_middleware = require("../middleware/password_update_middleware")
const router = express.Router()

router.post("/updatepassword",Update_Password_token)
router.post("/reset_password",Reset_password_middleware,Reset_password)

module.exports = router