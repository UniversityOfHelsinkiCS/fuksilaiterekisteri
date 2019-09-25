const sendEmail = require('@util/sendEmail')
const logger = require('@util/logger')

/* eslint-disable no-irregular-whitespace */
const text = `Onneksi olkoon, olet täyttänyt kaikki fuksilaitteen lainaehdot!
Fuksilaitteiden massajakelut ovat loppuneet. Sovi luovutusaika Pekka Niklanderin (Pekka.Niklander@helsinki.fi) kanssa.
Mukaan tarvitset opiskelijanumerosi sekä tavan todistaa henkilöllisyytesi(ajokortti, passi, tai henkilökortti).

Congratulations, you have completed all the tasks required to borrow the fresher device.
Please contact Pekka Niklander (Pekka.Niklander@helsinki.fi) to get your device.
Be sure to bring a photo ID and your student number with you.

Ystävällisin terveisin, - Kind regards
Matemaattis-luonnontieteellinen tiedekunta / Faculty of Science`
/* eslint-enable no-irregular-whitespace */

const subject = 'Fuksilaitteen luovutus - Fresher device distribution'

const completionChecker = async (user) => {
  if (user.wantsDevice && user.eligible && user.digiSkillsCompleted && user.courseRegistrationCompleted) {
    if (process.env.EMAIL_ENABLED !== 'true') {
      logger.error('Email disabled, set EMAIL_ENABLED=true to enable.')
      return
    }
    const info = await sendEmail([user.hyEmail, user.personalEmail], subject, text)
    if (info) {
      info.accepted.forEach(accepted => logger.info(`Email sent to ${accepted}.`))
    }
  }
}

module.exports = completionChecker
