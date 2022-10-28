import nodemailer from "nodemailer";
import { join } from "path";
import { readFile } from "fs/promises";
if (process.env.NODE_ENV !== "production")
    (await import("dotenv")).config();
const templatesDir = join(process.cwd(), "static", "email-templates");
const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smpt.gmail.com",
    auth: {
        user: process.env.GOOGLE_APP_EMAIL,
        pass: process.env.GOOGLE_APP_PASSWORD,
    },
});
function getEmailTemplate(fileName) {
    return readFile(join(templatesDir, fileName), "utf-8");
}
function sendEmail({ to, subject, html, rawText }) {
    return transport.sendMail({
        from: process.env.GOOGLE_APP_EMAIL,
        to,
        subject,
        html,
        text: rawText
    });
}
export async function notifyPlayer(player) {
    const template = await getEmailTemplate("auth.html");
    const html = template.replace(/%([^%]+)%/g, (_, prop) => player[prop]);
    return sendEmail({
        to: player.email,
        subject: "N3",
        html
    });
}
