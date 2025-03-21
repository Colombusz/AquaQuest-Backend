import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    secure: false, // Set to false for Mailtrap
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
    },
    tls: {
        rejectUnauthorized: false // Ignore SSL issues (for testing only)
    }
});


export const sendMail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: '"Aqua Quest Support" <Aqua-Quest@gmail.com>',
            to,
            subject,
            text,
            html
        });
        console.log("Email sent: ", info);  // Log email info
    } catch (error) {
        console.error("Error sending email: ", error);
    }
};
