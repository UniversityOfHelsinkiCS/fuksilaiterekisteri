const nodemailer = require('nodemailer')

const sendEmail = async (receivers, subject, text, attachments) => {
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
  })
}

module.exports = sendEmail
