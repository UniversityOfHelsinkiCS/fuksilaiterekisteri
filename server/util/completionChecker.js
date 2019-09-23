const sendEmail = require('@util/sendEmail')
const logger = require('@util/logger')

/* eslint-disable no-irregular-whitespace */
const text = `Onneksi olkoon, olet täyttänyt kaikki fuksilaitteen lainaehdot! Voit hakea koneesi Physicumin aulasta keskiviikkona (25.9) klo 9.30-11.30. Mukaan tarvitset opiskelijanumerosi sekä tavan todistaa henkilöllisyytesi(ajokortti, passi, tai henkilökortti).

Congratulations, you have completed all the tasks required to borrow the fresher device. Devices are distributed in Physicum's lobby on Wednesday (25th September) at 9:30-11:30. Be sure to bring a photo ID and your student number with you.

Erikoistapauksissa voit olla yhteydessä suoraan jakelijaan:
In case of special circumstances, please contact the distributor directly:
Pekka.Niklander@helsinki.fi

Ystävällisin terveisin, - Kind regards
Matemaattis-luonnontieteellinen tiedekunta / Faculty of Science`
/* eslint-enable no-irregular-whitespace */

const subject = 'Fuksilaitejakelu viikolla 39 - Fresher device distribution on week 39'

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
