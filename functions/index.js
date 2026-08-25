const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const {onSchedule} = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const {defineString} = require('firebase-functions/params');

// Define parameters for email configuration
const recipientEmail = defineString('RECIPIENT_EMAIL');
const senderEmail = defineString('SENDER_EMAIL');
const senderPassword = defineString('SENDER_PASSWORD');
const senderName = defineString('SENDER_NAME');

admin.initializeApp();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: senderEmail.value(),
    pass: senderPassword.value(),
  },
});

exports.cleanupExpiredApplicationCvs = onSchedule("every 24 hours", async (event) => {
    const now = admin.firestore.Timestamp.now();
    const snapshot = await admin.firestore()
      .collection("applications")
      .where("cvExpiresAt", "<=", now)
      .get();
    const bucket = admin.storage().bucket();

    await Promise.all(snapshot.docs.map(async (application) => {
      const data = application.data();
      try {
        if (data.cvStoragePath) {
          await bucket.file(data.cvStoragePath).delete({ ignoreNotFound: true });
        }
        await application.ref.update({
          cvStatus: "expired",
          cvStoragePath: admin.firestore.FieldValue.delete(),
          cvExpiresAt: admin.firestore.FieldValue.delete(),
          cvDeletedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } catch (error) => {
        console.error(`Unable to clean up CV for application ${application.id}:`, error);
      }
    }));
    console.log(`Processed ${snapshot.size} expired application CVs.`);
    return null;
  });

exports.sendContactEmail = onDocumentCreated("messages/{messageId}", async (event) => {
    const snap = event.data;
    if (!snap) {
        console.log("No data associated with the event");
        return;
    }
    const message = snap.data();

    const emailTemplate = fs.readFileSync(path.resolve(__dirname, "email-template.html"), "utf8");

    const html = emailTemplate
      .replace("{{name}}", message.name)
      .replace("{{email}}", message.email)
      .replace("{{message}}", message.message);

    const mailOptions = {
      from: `"${senderName.value()}" <${senderEmail.value()}>`,
      to: recipientEmail.value(),
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
