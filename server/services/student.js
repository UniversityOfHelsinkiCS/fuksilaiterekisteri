const axios = require('axios')
const https = require('https')
const { STUDENT_API_URL, STUDENT_API_TOKEN } = require('../util/common')

const userApi = axios.create({
  httpsAgent: new https.Agent({
    // TODO: FIX
    rejectUnauthorized: false,
  }),
  baseURL: STUDENT_API_URL,
  headers: {
    common: {
      Authorization: STUDENT_API_TOKEN,
    },
  },
})

const getMinMaxSemesters = async () => {
  const res = await userApi.get(`/semesters/${new Date().getTime()}`)
  return res.data
}

const getStudyRightsFor = async (studentNumber) => {
  const res = await userApi.get(`/students/${studentNumber}/studyrights`)
  return res.data
}

const getDigiSkillsFor = async (studentNumber) => {
  const res = await userApi.get(`/students/${studentNumber}/courses/DIGI-100A`)
  return res.data
}

const getStudytrackEnrollmentStatusFor = async (studentNumber, studytrackId) => {
  const res = await userApi.get(`/students/${studentNumber}/enrolled/${studytrackId}`)
  return res.data
}

const isEligible = async (studentNumber) => {
  const studyrights = await getStudyRightsFor(studentNumber)
  const mlu = studyrights.data.find(({ faculty_code }) => faculty_code === 'H50')
  const { min, max } = await getMinMaxSemesters()
  const minTime = new Date(min).getTime()
  const maxTime = new Date(max).getTime()
  let hasNewStudyright = false
  let hasPreviousStudyright = false
  mlu.elements.forEach(({ start_date }) => {
    const startTime = new Date(start_date).getTime()
    if (startTime > minTime && startTime < maxTime) {
      hasPreviousStudyright = true
    }
    if (startTime >= maxTime) {
      hasNewStudyright = true
    }
  })
  return {
    studyrights,
    eligible: (!hasPreviousStudyright && hasNewStudyright),
  }
}

const getStudentStatus = async (studentNumber, studyrights) => {
  try {
    const digiSkills = await getDigiSkillsFor(studentNumber)

    const enrollmentPromises = studyrights.data.find(({ faculty_code }) => faculty_code === 'H50').elements.map(({ code }) => (
      new Promise(async (resolve) => {
        const enrolled = await getStudytrackEnrollmentStatusFor(studentNumber, code)
        resolve(enrolled)
      })
    ))

    const hasEnrollments = (await Promise.all(enrollmentPromises)).filter(e => e).length > 0

    return {
      digiSkills,
      hasEnrollments,
    }
  } catch (e) {
    console.log(`Failed updating student ${studentNumber}`, e)
    return e
  }
}

module.exports = {
  getStudentStatus,
  isEligible,
}
