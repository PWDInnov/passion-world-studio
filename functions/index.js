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

exports.cleanupExpiredApplicationCvs = functions.pubsub
  .schedule("every 24 hours")
  .timeZone("UTC")
  .onRun(async () => {
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
      } catch (error) {
        console.error(`Unable to clean up CV for application ${application.id}:`, error);
      }
    }));
    console.log(`Processed ${snapshot.size} expired application CVs.`);
    return null;
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
