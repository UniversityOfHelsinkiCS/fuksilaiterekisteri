
const mockData = {
  default: {
    studyrights: {
      data: [
        {
          faculty_code: 'H50',
          elements: [
            {
              code: 'KH50_005',
              start_date: '2010-07-31T21:00:00.000Z',
              end_date: '2015-07-30T21:00:00.000Z',
            },
            {
              code: 'KH50_005',
              start_date: '2020-07-31T21:00:00.000Z',
              end_date: '2025-07-30T21:00:00.000Z',
            },
          ],
          admission_date: '2017-06-30T21:00:00.000Z',
          end_date: '2024-07-30T21:00:00.000Z',
          start_date: '2017-07-31T21:00:00.000Z',
        },
      ],
    },
    semesterEnrollments: {
      md5: '12345',
      status: 200,
      elapsed: 0.002677027,
      data: [
        {
          full_time_student: 'true',
          semester_enrollment_type_code: 1,
          absence_reason_code: null,
          semester_enrollment_date: '2016-06-30T21:00:00.000Z',
          semester_code: 139,
        },
        {
          full_time_student: 'true',
          semester_enrollment_type_code: 1,
          absence_reason_code: null,
          semester_enrollment_date: '2016-06-30T21:00:00.000Z',
          semester_code: 138,
        },
      ],
    },
    firstYearCredits: 55,
  },
  fuksi: {
    studyrights: {
      data: [
        {
          faculty_code: 'H50',
          elements: [
            {
              code: 'KH50_005',
              start_date: '2020-07-31T21:00:00.000Z',
              end_date: '2025-07-30T21:00:00.000Z',
            },
          ],
          admission_date: '2017-06-30T21:00:00.000Z',
          end_date: '2024-07-30T21:00:00.000Z',
          start_date: '2017-07-31T21:00:00.000Z',
        },
      ],
    },
    semesterEnrollments: {
      md5: '12345',
      status: 200,
      elapsed: 0.002677027,
      data: [
        {
          full_time_student: 'true',
          semester_enrollment_type_code: 1,
          absence_reason_code: null,
          semester_enrollment_date: '2016-06-30T21:00:00.000Z',
          semester_code: 139,
        },
      ],
    },
  },
  fuksi_without_digiskills: {
    studyrights: {
      data: [
        {
          faculty_code: 'H50',
          elements: [
            {
              code: 'KH50_005',
              start_date: '2020-07-31T21:00:00.000Z',
              end_date: '2025-07-30T21:00:00.000Z',
            },
          ],
          admission_date: '2017-06-30T21:00:00.000Z',
          end_date: '2024-07-30T21:00:00.000Z',
          start_date: '2017-07-31T21:00:00.000Z',
        },
      ],
    },
    semesterEnrollments: {
      md5: '12345',
      status: 200,
      elapsed: 0.002677027,
      data: [
        {
          full_time_student: 'true',
          semester_enrollment_type_code: 1,
          absence_reason_code: null,
          semester_enrollment_date: '2016-06-30T21:00:00.000Z',
          semester_code: 139,
        },
      ],
    },
  },
  modelStudent: {
    semesterEnrollments: {
      md5: '12345',
      status: 200,
      elapsed: 0.002677027,
      data: [
        {
          full_time_student: 'true',
          semester_enrollment_type_code: 1,
          absence_reason_code: null,
          semester_enrollment_date: '2016-06-30T21:00:00.000Z',
          semester_code: 139,
        },
        {
          full_time_student: 'true',
          semester_enrollment_type_code: 1,
          absence_reason_code: null,
          semester_enrollment_date: '2016-06-30T21:00:00.000Z',
          semester_code: 138,
        },
      ],
    },
    firstYearCredits: 30,
  },
  absentDeviceHolder: {
    semesterEnrollments: {
      md5: '12345',
      status: 200,
      elapsed: 0.002677027,
      data: [
        {
          full_time_student: 'true',
          semester_enrollment_type_code: 1,
          absence_reason_code: null,
          semester_enrollment_date: '2016-06-30T21:00:00.000Z',
          semester_code: 137,
        },
      ],
    },
    firstYearCredits: 30,
  },
  lowCreditsDeviceHolder: {
    semesterEnrollments: {
      md5: '12345',
      status: 200,
      elapsed: 0.002677027,
      data: [
        {
          full_time_student: 'true',
          semester_enrollment_type_code: 1,
          absence_reason_code: null,
          semester_enrollment_date: '2016-06-30T21:00:00.000Z',
          semester_code: 139,
        },
      ],
    },
    firstYearCredits: 29,
  },
  exDeviceHolder: {
    semesterEnrollments: {
      md5: '12345',
      status: 200,
      elapsed: 0.002677027,
      data: [
        {
          full_time_student: 'true',
          semester_enrollment_type_code: 1,
          absence_reason_code: null,
          semester_enrollment_date: '2016-06-30T21:00:00.000Z',
          semester_code: 138,
        },
      ],
    },
    firstYearCredits: 29,
  },
  eligible2: {
    studyrights: {
      data: [
        {
          faculty_code: 'H50',
          elements: [
            {
              code: 'KH50_005',
              start_date: '2019-07-31T21:00:00.000Z',
              end_date: '2024-07-30T21:00:00.000Z',
            },
          ],
          admission_date: '2017-06-30T21:00:00.000Z',
          end_date: '2024-07-30T21:00:00.000Z',
          start_date: '2017-07-31T21:00:00.000Z',
        },
      ],
    },
    semesterEnrollments: {
      md5: '12345',
      status: 200,
      elapsed: 0.002677027,
      data: [
        {
          full_time_student: 'true',
          semester_enrollment_type_code: 2, // Valid postpone reason
          absence_reason_code: null,
          semester_enrollment_date: '2016-06-30T21:00:00.000Z',
          semester_code: 137,
        },
        {
          full_time_student: 'true',
          semester_enrollment_type_code: 2, // Valid postpone reason
          absence_reason_code: null,
          semester_enrollment_date: '2016-06-30T21:00:00.000Z',
          semester_code: 138,
        },
        {
          full_time_student: 'true',
          semester_enrollment_type_code: 1,
          absence_reason_code: null,
          semester_enrollment_date: '2016-06-30T21:00:00.000Z',
          semester_code: 139,
        },
      ],
    },
  },
  eligible3: {
    studyrights: {
      data: [
        {
          faculty_code: 'H50',
          elements: [
            {
              code: 'KH50_005',
              start_date: '2008-07-31T21:00:00.000Z',
              end_date: '2040-07-30T21:00:00.000Z',
            },
          ],
          admission_date: '2017-06-30T21:00:00.000Z',
          end_date: '2024-07-30T21:00:00.000Z',
          start_date: '2017-07-31T21:00:00.000Z',
        },
      ],
    },
    semesterEnrollments: {
      md5: '12345',
      status: 200,
      elapsed: 0.002677027,
      data: [
        {
          full_time_student: 'true',
          semester_enrollment_type_code: 2, // Valid postpone reason
          absence_reason_code: null,
          semester_enrollment_date: '2016-06-30T21:00:00.000Z',
          semester_code: 133,
        },
        // ...
        {
          full_time_student: 'true',
          semester_enrollment_type_code: 1,
          absence_reason_code: null,
          semester_enrollment_date: '2016-06-30T21:00:00.000Z',
          semester_code: 139,
        },
      ],
    },
  },
  ineligible1: {
    studyrights: {
      data: [
        {
          faculty_code: 'H50',
          elements: [
            {
              code: 'KH50_005',
              start_date: '2005-07-31T21:00:00.000Z',
              end_date: '2010-07-30T21:00:00.000Z',
            },
          ],
          admission_date: '2017-06-30T21:00:00.000Z',
          end_date: '2024-07-30T21:00:00.000Z',
          start_date: '2017-07-31T21:00:00.000Z',
        },
      ],
    },
    semesterEnrollments: {
      md5: '12345',
      status: 200,
      elapsed: 0.002677027,
      data: [
        {
          full_time_student: 'true',
          semester_enrollment_type_code: 1,
          absence_reason_code: null,
          semester_enrollment_date: '2016-06-30T21:00:00.000Z',
          semester_code: 139,
        },
      ],
    },
  },
  ineligible2: {
    studyrights: {
      data: [
        {
          faculty_code: 'H50',
          elements: [
            {
              code: 'KH50_005',
              start_date: '2020-07-31T21:00:00.000Z',
              end_date: '2025-07-30T21:00:00.000Z',
            },
          ],
          admission_date: '2017-06-30T21:00:00.000Z',
          end_date: '2024-07-30T21:00:00.000Z',
          start_date: '2017-07-31T21:00:00.000Z',
        },
      ],
    },
    semesterEnrollments: {
      md5: '12345',
      status: 200,
      elapsed: 0.002677027,
      data: [
        {
          full_time_student: 'true',
          semester_enrollment_type_code: 0,
          absence_reason_code: null,
          semester_enrollment_date: '2016-06-30T21:00:00.000Z',
          semester_code: 139,
        },
      ],
    },
  },
  ineligible3: {
    studyrights: {
      data: [
        {
          faculty_code: 'H50',
          elements: [
            {
              code: 'KH50_005',
              start_date: '2005-07-31T21:00:00.000Z',
              end_date: '2015-07-30T21:00:00.000Z',
            },
            {
              code: 'KH50_005',
              start_date: '2020-07-31T21:00:00.000Z',
              end_date: '2025-07-30T21:00:00.000Z',
            },
          ],
          admission_date: '2017-06-30T21:00:00.000Z',
          end_date: '2024-07-30T21:00:00.000Z',
          start_date: '2017-07-31T21:00:00.000Z',
        },
      ],
    },
    semesterEnrollments: {
      md5: '12345',
      status: 200,
      elapsed: 0.002677027,
      data: [
        {
          full_time_student: 'true',
          semester_enrollment_type_code: 1,
          absence_reason_code: null,
          semester_enrollment_date: '2016-06-30T21:00:00.000Z',
          semester_code: 139,
        },
      ],
    },
  },
}

const findData = (studentNumber, field) => (mockData[studentNumber] && mockData[studentNumber][field] ? mockData[studentNumber][field] : mockData.default[field])

const findSemesterEnrollments = studentNumber => findData(studentNumber, 'semesterEnrollments')
const findStudyrights = studentNumber => findData(studentNumber, 'studyrights')
const findFirstYearCredits = studentNumber => findData(studentNumber, 'firstYearCredits')

module.exports = {
  findSemesterEnrollments,
  findStudyrights,
  findFirstYearCredits,
}
