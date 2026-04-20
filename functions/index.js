
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

admin.initializeApp();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: functions.config().email.user,
    pass: functions.config().email.pass,
  },
});

exports.sendContactEmail = functions.firestore
  .document("messages/{messageId}")
  .onCreate(async (snap, context) => {
    const message = snap.data();

    const emailTemplate = fs.readFileSync(path.resolve(__dirname, "email-template.html"), "utf8");

    const html = emailTemplate
      .replace("{{name}}", message.name)
      .replace("{{email}}", message.email)
      .replace("{{message}}", message.message);

    const mailOptions = {
      from: `"${functions.config().email.name}" <${functions.config().email.user}>`,
      to: functions.config().email.recipient,
      subject: "New Contact Form Submission",
      html: html,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  });
