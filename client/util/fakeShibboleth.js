const ITEM_NAME = 'fakeUser'

const possibleUsers = [
  {
    uid: 'admin',
    employeeNumber: 12,
    givenName: 'adminEtunimi',
    mail: 'grp-toska+fail@helsinki.fi',
    schacDateOfBirth: undefined,
    hyPersonStudentId: undefined,
    sn: 'admin',
  },
  {
    uid: 'jakelija',
    employeeNumber: 1234,
    givenName: 'jakelijaEtunimi',
    mail: 'grp-toska+fail@helsinki.fi',
    schacDateOfBirth: undefined,
    hyPersonStudentId: undefined,
    sn: 'jakelija',
  },
  {
    uid: 'fuksi',
    employeeNumber: undefined,
    givenName: 'fuksiEtunimi',
    mail: 'grp-toska+fukrekfuksi@helsinki.fi',
    schacDateOfBirth: 19770501,
    hyPersonStudentId: 'fuksi',
    sn: 'fuksi',
  },
  {
    uid: 'fuksi_without_studentnumber',
    employeeNumber: undefined,
    givenName: 'fuksiEtunimi',
    mail: 'grp-toska+fukrekfuksi@helsinki.fi',
    schacDateOfBirth: 19770501,
    hyPersonStudentId: undefined,
    sn: 'fuksi',
  },
  {
    uid: 'non_fuksi_student',
    employeeNumber: undefined,
    givenName: 'non-fuksiEtunimi',
    mail: 'grp-toska+fail@helsinki.fi',
    schacDateOfBirth: 19850806,
    hyPersonStudentId: 'non-fuksi',
    sn: 'non-fuksi',
  },
  {
    uid: 'fuksi_without_digiskills',
    employeeNumber: undefined,
    givenName: 'fuksiWithoutDigi',
    mail: 'grp-toska+fuksiWithoutDiki@helsinki.fi',
    schacDateOfBirth: 19850806,
    hyPersonStudentId: 'fuksi_without_digiskills',
    sn: 'fuksi_without_digiskills',
  },
  {
    uid: 'non_admin_staff',
    employeeNumber: 1234,
    givenName: 'non-admin-staffEtunimi',
    mail: 'grp-toska+fail@helsinki.fi',
    schacDateOfBirth: undefined,
    hyPersonStudentId: undefined,
    sn: 'non-admin-staff',
  },
  {
    uid: 'irrelevant_staff',
    employeeNumber: 12345,
    givenName: 'irrelevant-staffEtunimi',
    mail: 'grp-toska+fail@helsinki.fi',
    schacDateOfBirth: undefined,
    hyPersonStudentId: undefined,
    sn: 'irrelevant-staff',
  },
  {
    uid: 'reclaimer',
    employeeNumber: 123456,
    givenName: 'reclaimerEtunimi',
    mail: 'grp-toska+fail@helsinki.fi',
    schacDateOfBirth: undefined,
    hyPersonStudentId: undefined,
    sn: 'reclaimer',
  },
]

const eligilityTestUsers = [
  {
    uid: 'eligible2',
    hyPersonStudentId: 'eligible2',
    sn: 'eligible2',
  },
  {
    uid: 'eligible3',
    hyPersonStudentId: 'eligible3',
    sn: 'eligible3',
  },
  {
    uid: 'ineligible1',
    hyPersonStudentId: 'ineligible1',
    sn: 'ineligible1',
  },
  {
    uid: 'ineligible2',
    hyPersonStudentId: 'ineligible2',
    sn: 'ineligible2',
  },
  {
    uid: 'ineligible3',
    hyPersonStudentId: 'ineligible3',
    sn: 'ineligible3',
  },

]

const setHeaders = (uid) => {
  const user = possibleUsers.concat(eligilityTestUsers).find(u => u.uid === uid)
  if (!user) return

  localStorage.setItem(ITEM_NAME, JSON.stringify(user))
}

const getHeaders = () => {
  const user = JSON.parse(localStorage.getItem(ITEM_NAME) || '{}')
  return user
}

const clearHeaders = () => {
  localStorage.removeItem(ITEM_NAME)
}

module.exports = {
  possibleUsers,
  eligilityTestUsers,
  setHeaders,
  getHeaders,
  clearHeaders,
}
