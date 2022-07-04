var nodemailer = require("nodemailer");
require("dotenv").config();

async function email_verification(email) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "folio.authentication@gmail.com",
      pass: "rolarappa&@#$342",
      clientId: "261939524724-ijibumbtsk9tslvf8hbq5edudfp7la3k.apps.googleusercontent.com",
      clientSecret: "1sQUXC2pP0KZ8XAz-_RConVW",
      refreshToken: "1//04CNKiJoCsmM2CgYIARAAGAQSNwF-L9IrFQi-x64GvdD7xSYC4ywu3ijXncZU6UZG6g_qLD2EhB4T2fcmBKhTu6EV6_szhTr3AfA",
    },
  });
  var email_auth_otp = Math.floor(1000 + Math.random() * 9000);
  console.log(email_auth_otp);
  var mailOptions = {
    from: "navdeepdhkr@gmail.com",
    to: email,
    subject: "Sending Email using Node.js",
    text: email_auth_otp.toString(),
    html: `<p>FOLIO Email verification OTP <h1>${email_auth_otp}</h1></p>`,
  };
  console.log("completed up to here");
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  return email_auth_otp;
}
module.exports = email_verification;
