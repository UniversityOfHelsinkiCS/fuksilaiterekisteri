const axios = require('axios')
const https = require('https')
const {
  STUDENT_API_URL, STUDENT_API_TOKEN,
} = require('../../util/common')

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

module.exports = {
  userApi,
  getMinMaxSemesters,
}
