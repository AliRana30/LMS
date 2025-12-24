import nodemailer, { Transporter } from "nodemailer";
import path from "path";
import fs from "fs";
import ejs from "ejs";

interface EmailOptions {
  email: string;
  subject: string;
  template: string;
  data: { [key: string]: any };
}

export const sendMail = async (options: EmailOptions): Promise<void> => {
  // Validate SMTP configuration
  if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_MAIL || !process.env.SMTP_PASSWORD) {
    console.error("SMTP configuration missing:", {
      host: !!process.env.SMTP_HOST,
      port: !!process.env.SMTP_PORT,
      mail: !!process.env.SMTP_MAIL,
      password: !!process.env.SMTP_PASSWORD
    });
    throw new Error("SMTP configuration is incomplete. Please check environment variables.");
  }

  const transporter: Transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT as unknown as number,
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const { email, subject, template, data } = options;

  //  Template path - use __dirname for production reliability
  //  __dirname points to the directory of the current file (utlis/ in dev, build/utlis/ in prod)
  //  We go up one level (..) and then into mails folder
  const templatePath = path.join(__dirname, "..", "mails", template);

  console.log("=== Email Debug Info ===");
  console.log("__dirname:", __dirname);
  console.log("Template path:", templatePath);
  console.log("Template exists:", fs.existsSync(templatePath));

  // List files in mails directory to help debug
  const mailsDir = path.join(__dirname, "..", "mails");
  console.log("Mails directory:", mailsDir);
  console.log("Mails dir exists:", fs.existsSync(mailsDir));

  if (fs.existsSync(mailsDir)) {
    console.log("Files in mails dir:", fs.readdirSync(mailsDir));
  }

  // Check if template exists
  if (!fs.existsSync(templatePath)) {
    console.error(`Template file not found: ${templatePath}`);
    throw new Error(`Email template not found: ${template}. Path: ${templatePath}`);
  }

  const html = await ejs.renderFile(templatePath, data);

  await transporter.sendMail({
    from: process.env.SMTP_MAIL,
    to: email,
    subject,
    html,
  });

  console.log("Email sent successfully to:", email);
};
