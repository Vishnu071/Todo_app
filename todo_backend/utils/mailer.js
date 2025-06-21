const nodemailer = require("nodemailer");

// Configure the transporter with your email service and credentials
const transporter = nodemailer.createTransport({
  service: "gmail", // or another email service
  auth: {
    user: process.env.EMAIL_USER, // Your email address (set in .env)
    pass: process.env.EMAIL_PASS, // Your email password or app password (set in .env)
  },
});

// Function to send a task reminder email
function sendTaskReminder(to, subject, text) {
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
}

module.exports = { sendTaskReminder };
