const axios = require('axios')
const https = require('https')
const {
  STUDENT_API_URL, STUDENT_API_TOKEN, SIS, inProduction, DIGI_COURSES,
} = require('../../util/common')
const mock = require('./mock')

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
    if (!inProduction) return Promise.resolve(mock.findStudyrights(studentNumber))
    const { data } = await this.userApi.get(`/students/${studentNumber}/studyrights`)
    return data
  }

  async getMinMaxSemesters() {
    if (!inProduction) {
      const res = await mock.findMinMaxSemesters()
      return res
    }
    if (!SIS) {
      const res = await this.userApi.get(`/semesters/${new Date().getTime()}`)
      return res.data
    }
    const res = await this.userApi.get('/semesters/min_max_semesters')
    return res.data
  }

  async hasDigiSkills(studentNumber) {
    if (!SIS) {
      return (await Promise.all(DIGI_COURSES.map(code => (
        this.userApi.get(`/students/${studentNumber}/courses/${code}`)
      )))).map(res => res.data).includes(true)
    }
    return (await Promise.all(DIGI_COURSES.map(code => this.userApi.get(`/students/${studentNumber}/has_passed_course/${code}`)))).map(res => res.data).includes(true)
  }

  async getStudytrackEnrollmentStatus(studentNumber, studytrackId) {
    if (!SIS) {
      const res = await this.userApi.get(`/students/${studentNumber}/enrolled/${studytrackId}`)
      return res.data
    }
    const res = await this.userApi.get(`/students/${studentNumber}/enrolled/study_track/${studytrackId}`)
    return res.data
  }

  async getSemesterEnrollments(studentNumber) {
    if (!inProduction) return Promise.resolve(mock.findSemesterEnrollments(studentNumber))
    if (!SIS) {
      const res = await this.userApi.get(`/students/${studentNumber}/semesterEnrollments`)
      return res.data
    }
    const res = await this.userApi.get(`/students/${studentNumber}/semester_enrollments`)
    return res
  }

  async getYearsCredits(studentNumber, startingSemester, signUpYear) {
    if (!inProduction) return Promise.resolve(mock.findFirstYearCredits(studentNumber))
    if (!SIS) {
      const res = await this.userApi.get(`/students/${studentNumber}/fuksiYearCredits/${startingSemester}`)
      return res.data
    }
    const res = await this.userApi.get(`/students/${studentNumber}/fuksi_year_credits/${signUpYear}`)
    return res.data
  }
}

module.exports = ApiInterface
