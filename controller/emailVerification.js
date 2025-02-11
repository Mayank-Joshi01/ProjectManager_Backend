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

// Function to generate OTP email
const generateOtpEmail = (recipientEmail, otp) => {
  return {
    from: '"No reply email" <mayankjoshi.in.123@gmail.com>',  // Sender address
    to: recipientEmail,  // Recipient's email
    subject: "OTP for Email Verification",  // Email subject
    html: `<html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <tr>
              <td style="text-align: center; padding-bottom: 20px;">
                <h2 style="color: #333333;">Email Verification OTP</h2>
                <p style="font-size: 16px; color: #555555;">Hello!</p>
                <p style="font-size: 16px; color: #555555;">Thank you for signing up. Please use the OTP below to verify your email address:</p>
                <h1 style="font-size: 36px; color: #4CAF50; font-weight: bold;">${otp}</h1>
                <p style="font-size: 16px; color: #555555;">This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
                <hr style="border: 0; border-top: 2px solid #f4f4f4; margin: 20px 0;">
                <p style="font-size: 14px; color: #888888;">If you didn't request this, please ignore this email.</p>
              </td>
            </tr>
          </table>
        </body>
      </html>
`,  // OTP in HTML format
  };
};

// Function to generate a plain email
const generatePlainEmail = (recipientEmail, subject, messageText) => {
  return {
    from: '"No reply email" <mayankjoshi.in.123@gmail.com>',  // Sender address
    to: recipientEmail,  // Recipient's email
    subject: subject,  // Email subject
    html: `  <html>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <tr>
              <td style="text-align: center; padding-bottom: 20px;">
                <h2 style="color: #333333;">${subject}</h2>
                <p style="font-size: 16px; color: #555555;">Dear User,</p>
                <p style="font-size: 16px; color: #555555;">We have a message for you:</p>
                <p style="font-size: 16px; color: #555555;">${messageText}</p>
                <hr style="border: 0; border-top: 2px solid #f4f4f4; margin: 20px 0;">
                <p style="font-size: 14px; color: #888888;">Thank you for being a valued member of our community!</p>
              </td>
            </tr>
          </table>
        </body>
      </html>`,  // Message text in HTML format
  };
};

// Function to generate Password Update Request email with improved HTML design
const generatePasswordUpdateEmail = (recipientEmail, resetLink) => {
  return {
    from: '"No reply email" <mayankjoshi.in.123@gmail.com>',  // Sender address
    to: recipientEmail,  // Recipient's email
    subject: "Password Update Request",  // Email subject
    html: `
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <tr>
              <td style="text-align: center; padding-bottom: 20px;">
                <h2 style="color: #333333;">Password Update Request</h2>
                <p style="font-size: 16px; color: #555555;">Hello!</p>
                <p style="font-size: 16px; color: #555555;">We received a request to update your password. If you initiated this request, please click the link below to reset your password:</p>
                
                <div style="margin: 20px 0;">
                  <a href="${resetLink}" style="background-color: #4CAF50; color: #ffffff; padding: 15px 30px; font-size: 16px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Your Password</a>
                </div>

                <p style="font-size: 16px; color: #555555;">If you did not request this change, please ignore this email. Your password will remain unchanged.</p>
                
                <hr style="border: 0; border-top: 2px solid #f4f4f4; margin: 20px 0;">
                <p style="font-size: 14px; color: #888888;">If you have any issues, feel free to contact us at <a href="mailto:support@yourcompany.com" style="color: #4CAF50;">support@yourcompany.com</a>.</p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,  // HTML body with reset link and style
  };
};


module.exports = {generateOTP , transporter,generateOtpEmail,generatePlainEmail,generatePasswordUpdateEmail};