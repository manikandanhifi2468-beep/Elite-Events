import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";
import * as path from "path";

// Initialize admin with service account for full access
const serviceAccount = require(path.join(__dirname, "..", "serviceAccountKey.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Note: You need to set these environment variables in Firebase:
// firebase functions:secrets:set EMAIL_USER
// firebase functions:secrets:set EMAIL_PASS
// For Gmail, use an "App Password" if 2FA is enabled.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const onInquiryCreated = onDocumentCreated("inquiries/{inquiryId}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) return;

  const data = snapshot.data();
  const adminEmail = "manikandanhifi2468@gmail.com";

  // Email to Admin
  const adminMailOptions = {
    from: '"Elite Events" <noreply@elite-sparkle-craft.com>',
    to: adminEmail,
    subject: `New Inquiry from ${data.fullName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
        <h2 style="color: #D4AF37;">New Lead Received</h2>
        <p><strong>Name:</strong> ${data.fullName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Event Date:</strong> ${data.eventDate}</p>
        <p><strong>Message:</strong> ${data.message}</p>
        ${data.planDetails ? `
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <h3 style="color: #D4AF37;">AI Planner Details</h3>
          <p><strong>Package:</strong> ${data.planDetails.pkg}</p>
          <p><strong>Estimated Cost:</strong> ₹${data.planDetails.cost.toLocaleString()}</p>
          <p><strong>Guests:</strong> ${data.planDetails.guests}</p>
          <p><strong>Event Type:</strong> ${data.planDetails.eventType}</p>
          <p><strong>Food:</strong> ${data.planDetails.foodPreference}</p>
        ` : ''}
      </div>
    `,
  };

  // Confirmation to User
  const userMailOptions = {
    from: '"Elite Events" <noreply@elite-sparkle-craft.com>',
    to: data.email,
    subject: "We've received your inquiry! - Elite Events",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
        <h2 style="color: #D4AF37;">Hello ${data.fullName},</h2>
        <p>Thank you for reaching out to <strong>Elite Events & Catering</strong>.</p>
        <p>We have received your inquiry for your upcoming event on <strong>${data.eventDate}</strong>. Our planning team is reviewing your details and will get back to you within 24 hours to discuss how we can make your celebration extraordinary.</p>
        <p>In the meantime, feel free to browse our gallery or follow us on social media for inspiration.</p>
        <br />
        <p>Best Regards,<br /><strong>The Elite Events Team</strong></p>
      </div>
    `,
  };

  try {
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions)
    ]);
    console.log(`Emails sent for inquiry ${event.params.inquiryId}`);
  } catch (error) {
    console.error("Error sending emails:", error);
  }
});
