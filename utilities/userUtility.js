const nodemailer = require('nodemailer')
const dotenv = require('dotenv');

dotenv.config();

const userUtility = {
  
    generateDigitOTP() {
    // this return a number between 100,000 and 900,000
    return Math.floor(Math.random() * 900000 + 100000);
  },

  async sendEmail(email, otp) {
    console.log("Preparing to send email to:", email);
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Password Reset",
        text: `Your password reset otp is |  ${otp}  |.  `,
      };

      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully to:", email);
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  },
};

module.exports = userUtility;