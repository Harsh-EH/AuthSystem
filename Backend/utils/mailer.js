// utils/mailer.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter failed:", error.message);
  } else {
    console.log("✅ Email transporter is ready");
  }
});

const sendMail = async (to, subject, text) => {
  const mailOptions = {
    from: `"Auth System" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);

    // Sometimes Gmail will send the mail but with a response indicating soft failure
    if (info.rejected.length > 0) {
      console.error(`❌ Mail rejected: ${info.rejected.join(", ")}`);
      throw new Error(`Email rejected for: ${info.rejected.join(", ")}`);
    }

    console.log(`📤 Email sent to ${to}: ${info.response}`);
    return info;
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
    throw error;
  }
};

module.exports = sendMail;
