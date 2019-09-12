const sendEmail = require('@util/sendEmail')
const logger = require('@util/logger')

/* eslint-disable no-irregular-whitespace */
const text = `Onneksi olkoon, olet täyttänyt kaikki fuksilaitteen lainaehdot! Koneita voi hakea viikolla 37 (9.9.-13.9.) allaolevan aikataulun mukaisesti. Mukaan tarvitset opiskelijanumerosi sekä tavan todistaa henkilöllisyytesi(ajokortti, passi, tai henkilökortti).

Congratulations, you have completed all the tasks required to borrow the fresher device. Devices are distributed on the week 37 (9th to 13th of September) following the schedule below. Be sure to bring a photo ID and your student number with you.

Huone/Room G103d, Kumpula Tiedekirjasto/Science Library
TI/TUE 10.9.2019, 9.45 — 10.15
KE/WED 11.9.2019, 16.00 — 16.30
TO/THU 12.9.2019, 9.45 — 10.15 ja 16.00 — 16.30

Erikoistapauksissa voit olla yhteydessä suoraan jakelijaan:
In case of special circumstances, please contact the distributor directly:
Pekka.Niklander@helsinki.fi

Ystävällisin terveisin, - Kind regards
Matemaattis-luonnontieteellinen tiedekunta / Faculty of Science`
/* eslint-enable no-irregular-whitespace */

const subject = 'Fuksilaitejakelu viikolla 37 - Fresher device distribution on week 37'

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
