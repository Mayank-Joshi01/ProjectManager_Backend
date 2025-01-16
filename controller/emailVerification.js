const nodemailer = require("nodemailer")

const generateOTP = ()=>{
    let otp = "";
    for(let i=0;i<6;i++){
        otp += Math.floor(Math.random()*10);
    }
    return otp;
}
const transporter =  nodemailer.createTransport({
    service: "gmail",
    secure:true,
    port: 465,
    auth: {
      user: "mayankjoshi.in.123@gmail.com",
      pass: process.env.NODEMAILER_PASS,
    },
  })

  const OTP_Mail = (email,OTP)=>{
      return {
        from: '"No reply email👻" <mayankjoshi.in.123@gmail.com>', // sender address
    //   from: "mayankjoshi.in.123@gmail.com", // sender address
      to: email, // list of receivers
      subject: "OTP for Email Verification", // Subject line
      html: `<b>Your OTP is ${OTP} </b>`, // html body
      }}
    
const Plain_Mail = (email,subject,text)=>{
    return {
        from: '"No reply email👻" <mayankjoshi.in.123@gmail.com>', // sender address
    //   from: "mayankjoshi.in.123@gmail.com", // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      html: `<b>${text}</b>`, // html body
      }}

module.exports = {generateOTP , transporter,OTP_Mail,Plain_Mail};