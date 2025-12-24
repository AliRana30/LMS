"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
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
    console.log("Attempting to render template from:", templatePath);
    console.log("Current directory (__dirname):", __dirname);
    const html = await ejs_1.default.renderFile(templatePath, data);
    await transporter.sendMail({
        from: process.env.SMTP_MAIL,
        to: email,
        subject,
        html,
    });
};
exports.sendMail = sendMail;
