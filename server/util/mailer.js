require('module-alias/register')

const { sendMail } = require('../services/emailService')

const f = async () => {
  try {
    await sendMail(['matti.luukkainen@helsinki.fi'], 'wtf...')
  } catch (e) {
    console.log(e)
  }

  process.exit(1)
}

f()
