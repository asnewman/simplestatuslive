import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: "mail.privateemail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
  pool: true,
})

async function email(msg: { from: string; to: string; subject: string; html: string }) {
  return transporter.sendMail(msg)
}

export default email
