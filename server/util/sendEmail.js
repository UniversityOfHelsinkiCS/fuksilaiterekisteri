const nodemailer = require('nodemailer')

const sendEmail = async (receivers, subject, text, replyTo, attachments) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.helsinki.fi',
    port: 587,
    secure: false,
  })

  return transporter.sendMail({
    from: 'Fuksilaite Robot <noreply@helsinki.fi>',
    to: receivers,
    subject,
    text,
    attachments,
    replyTo,
  })
}

module.exports = sendEmail
