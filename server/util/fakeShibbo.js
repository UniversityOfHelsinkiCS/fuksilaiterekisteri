const fakeUsers = {
  admin: {
    employeeNumber: null,
    givenName: 'admin',
    mail: null,
    schacDateOfBirth: null,
    schacPersonalUniqueCode: null,
    sn: 'admin',
  },
  jakelija: {
    employeeNumber: 1234,
    givenName: 'jakelija',
    mail: null,
    schacDateOfBirth: null,
    schacPersonalUniqueCode: null,
    sn: 'jakelija',
  },
  fuksi: {
    employeeNumber: null,
    givenName: 'fuksi',
    mail: null,
    schacDateOfBirth: null,
    schacPersonalUniqueCode: '::::::fuksi',
    sn: 'fuksi',
  },
  non_fuksi_student: {
    employeeNumber: null,
    givenName: 'non-fuksi',
    mail: null,
    schacDateOfBirth: null,
    schacPersonalUniqueCode: '::::::non-fuksi',
    sn: 'non-fuksi',
  },
  non_admin_staff: {
    employeeNumber: 1234,
    givenName: 'non-admin-staff',
    mail: null,
    schacDateOfBirth: null,
    schacPersonalUniqueCode: null,
    sn: 'non-admin-staff',
  },
}

const authentication = async (req, res, next) => {
  const {
    uid,
  } = req.headers

  if (uid) {
    req.headers = {
      ...req.headers,
      ...fakeUsers[uid],
    }
  }

  next()
}


module.exports = authentication
