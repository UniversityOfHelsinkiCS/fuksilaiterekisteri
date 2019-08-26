const sendEmail = require('@util/sendEmail')
const logger = require('@util/logger')

const text = `Onneksi olkoon, olet täyttänyt kaikki fuksilaitteen lainaehdot! Tule hakemaan laitteesi Physicumin aulasta perjantaina 6.9. klo 10.00 alkaen.
Mukaan tarvitset opiskelijanumerosi sekä tavan todistaa henkilöllisyytesi(ajokortti, passi, tai henkilökortti).

Congratulations, you have completed all the tasks required to borrow the fresher device. Come get yours from Physicum lobby on Friday, the 6th of September, from 10.00 onwards.
Be sure to bring a photo ID and your student number with you.

Ystävällisin terveisin, - Kind regards
Matemaattis-luonnontieteellinen tiedekunta / Faculty of Science`

const subject = 'Tule noutamaan fuksilaitteesi perjantaina 6.9! - Come get your fresher device on Friday the 6th of September!'

const completionChecker = async (user) => {
  if (process.env.EMAIL_ENABLED !== 'true') {
    logger.error('Email disabled, set EMAIL_ENABLED=true to enable.')
    return
  }
  if (user.eligible && user.digiSkillsCompleted && user.courseRegistrationCompleted) {
    const info = await sendEmail([user.hyEmail, user.personalEmail], subject, text)
    if (info) {
      info.accepted.forEach(accepted => logger.info(`Email sent to ${accepted}.`))
    }
  }
}

module.exports = completionChecker
