"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const ejs_1 = __importDefault(require("ejs"));
const sendMail = async (options) => {
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
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
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
    const templatePath = path_1.default.join(__dirname, "..", "mails", template);
    console.log("=== Email Debug Info ===");
    console.log("__dirname:", __dirname);
    console.log("Template path:", templatePath);
    console.log("Template exists:", fs_1.default.existsSync(templatePath));
    // List files in mails directory to help debug
    const mailsDir = path_1.default.join(__dirname, "..", "mails");
    console.log("Mails directory:", mailsDir);
    console.log("Mails dir exists:", fs_1.default.existsSync(mailsDir));
    if (fs_1.default.existsSync(mailsDir)) {
        console.log("Files in mails dir:", fs_1.default.readdirSync(mailsDir));
    }
    // Check if template exists
    if (!fs_1.default.existsSync(templatePath)) {
        console.error(`Template file not found: ${templatePath}`);
        throw new Error(`Email template not found: ${template}. Path: ${templatePath}`);
    }
    const html = await ejs_1.default.renderFile(templatePath, data);
    await transporter.sendMail({
        from: process.env.SMTP_MAIL,
        to: email,
        subject,
        html,
    });
    console.log("Email sent successfully to:", email);
};
exports.sendMail = sendMail;
