const axios = require('axios')
const https = require('https')
const {
  STUDENT_API_URL, STUDENT_API_TOKEN, inProduction, DIGI_COURSES, useMock,
} = require('../../util/common')
const mock = require('./mock')

console.log('useMock', useMock)

class ApiInterface {
  constructor() {
    this.userApi = axios.create({
      httpsAgent: new https.Agent({
        // TODO: FIX
        rejectUnauthorized: false,
      }),
      baseURL: STUDENT_API_URL,
      params: {
        token: STUDENT_API_TOKEN,
      },
    })
  }

  async getStudyRights(studentNumber) {
    if (!inProduction && useMock) return Promise.resolve(mock.findStudyrights(studentNumber))

    const { data } = await this.userApi.get(`/students/${studentNumber}/studyrights`)

    return data
  }

  async getMinMaxSemesters() {
    if (!inProduction) {
      const res = await mock.findMinMaxSemesters()
      return res
    }
    const res = await this.userApi.get('/semesters/min_max_semesters')
    return res.data
  }

  async hasDigiSkills(studentNumber) {
    return (await Promise.all(DIGI_COURSES.map(code => this.userApi.get(`/students/${studentNumber}/has_passed_course/${code}`)))).map(res => res.data).includes(true)
  }

  async getStudytrackEnrollmentStatus(studentNumber, studytrackId) {
    const res = await this.userApi.get(`/students/${studentNumber}/enrolled/study_track/${studytrackId}`)
    return res.data
  }

  async getSemesterEnrollments(studentNumber) {
    if (!inProduction && useMock) return Promise.resolve(mock.findSemesterEnrollments(studentNumber))

    const res = await this.userApi.get(`/students/${studentNumber}/acual_semester_enrollments`)
    return res
  }

  async getYearsCredits(studentNumber, startingSemester, signUpYear) {
    if (!inProduction && useMock) return Promise.resolve(mock.findFirstYearCredits(studentNumber))

    const res = await this.userApi.get(`/students/${studentNumber}/fuksi_year_credits/${signUpYear}`)
    return res.data
  }
}

module.exports = ApiInterface
