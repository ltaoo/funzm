import nodemailer from "nodemailer";

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: "smtp.exmail.qq.com",
  port: 465,
  secure: true,
  auth: {
    user: "noreply@funzm.com", // generated ethereal user
    pass: "Li1218040201.", // generated ethereal password
  },
});

export async function sendEmail() {
  const info = await transporter.sendMail({
    // sender address
    from: '"noreply"<noreply@funzm.com>',
    to: "litaowork@aliyun.com",
    // Subject line
    subject: "Hello ✔",
    // plain text body
    text: "Hello world?",
    // html body
    html: "<b>Hello world?</b>",
  });
  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}
