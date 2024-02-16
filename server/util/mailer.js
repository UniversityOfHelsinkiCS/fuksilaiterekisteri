require('module-alias/register')

// require the models
const { Email } = require('@models')

const { sendMail } = require('../services/emailService')
const {
  User,
} = require('@models')

const f = async () => {
  const users = (await User.findAll()).filter(u => [4, 181, 305].includes(u.id))

  const [reclaimMail] = await Email.findAutoReclaimerTemplates()

  console.log(reclaimMail)

  try {
    const { subject, body } = reclaimMail

    await sendMail(users, 'grp-toska@helsinki.fi', subject, body)
  } catch (e) {
    console.log(e)
  }

  process.exit(1)
}
f()
