const nodemailer = require('nodemailer')

const sendEmail = async ({
  recipients, subject, text, replyTo, attachments,
}) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.helsinki.fi',
    port: 587,
    secure: false,
  })

  return transporter.sendMail({
    from: 'Fuksilaite Robot <noreply@helsinki.fi>',
    bcc: recipients,
    subject,
    text,
    attachments,
    replyTo,
  })
}

module.exports = sendEmail
