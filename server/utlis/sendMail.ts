import nodemailer, { Transporter } from "nodemailer";
import path from "path";
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

  //  Template path - use absolute path for better reliability
  const templatePath = path.join(process.cwd(), "mails", template);

  console.log("Attempting to render template from:", templatePath);
  console.log("Current working directory:", process.cwd());

  const html = await ejs.renderFile(templatePath, data);

  await transporter.sendMail({
    from: process.env.SMTP_MAIL,
    to: email,
    subject,
    html,
  });
};
