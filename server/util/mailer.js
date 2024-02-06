require('module-alias/register')

const { sendMail } = require('../services/emailService')
const {
  User,
} = require('@models')

const f = async () => {
  const users = (await User.findAll()).filter(u => [4, 181].includes(u.id))

  console.log(JSON.stringify(users))

  try {
    await sendMail(users, 'grp-toska@helsinki.fi', 'palaute laite asap')
  } catch (e) {
    console.log(e)
  }

  process.exit(1)
}

f()
