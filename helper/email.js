const { sendResponse } = require(".");
const nodemailer = require("nodemailer");
const { STATUS_CODE } = require("./enum");

module.exports = {
  sendMail: async ({ to, subject, text, html,res }) => {

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail(
      {
        from: "Raj Bhanderi <baby53@ethereal.email>",
        to,
        subject,
        text,
        html,
      },
      (err) => {
        return sendResponse(res, STATUS_CODE?.BAD_REQUEST, false, err?.message);
      }
    );
  },
};
