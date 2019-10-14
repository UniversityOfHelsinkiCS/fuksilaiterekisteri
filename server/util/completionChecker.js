const sendEmail = require('@util/sendEmail')
const logger = require('@util/logger')

/* eslint-disable no-irregular-whitespace */
const text = `Onneksi olkoon, olet täyttänyt kaikki fuksilaitteen lainaehdot! Voit hakea koneesi Tiedekirjaston huoneesta G103d tiistaina (15.10.) klo 16.00-17.00 tai torstaina (17.10.) 9.30-10.30. Mukaan tarvitset opiskelijanumerosi sekä tavan todistaa henkilöllisyytesi(ajokortti, passi, tai henkilökortti).

Congratulations, you have completed all the tasks required to borrow the fresher device. Devices are distributed in Science Library's room G103d on Tuesday (15th October) at 16:00-17:00 and on Thursday (17th October) at 9:30-10:30. Be sure to bring a photo ID and your student number with you.

HUOM! Laite pitää noutaa tai sille pitää sopia noutoaika viimeistään perjantaina 18.10.2019. Tämän jälkeen varaukset raukeavat eikä fuksiläppäriä ole enää mahdollista saada.
NB! The device must be picked up, or the pickup must be agreed on by Friday 18th October the latest! After Friday, all reservations expire, and is no longer possible to receive a fresher device.

Jos et pääse hakemaan laitetta yo. aikoina, sovi henkilökohtainen hakuaika suoraan jakelijan kanssa sähköpostitse:
If you aren't able to pick up the device during the above mentioned times, please contact the distributor directly to agree on the pickup:
Pekka.Niklander@helsinki.fi

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
