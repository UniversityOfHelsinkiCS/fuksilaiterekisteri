const ITEM_NAME = 'fakeUser'

const possibleUsers = [
  {
    uid: 'admin',
    employeeNumber: 12,
    givenName: 'adminEtunimi',
    mail: 'grp-toska+fail@helsinki.fi',
    schacDateOfBirth: undefined,
    schacPersonalUniqueCode: undefined,
    sn: 'admin',
  },
  {
    uid: 'jakelija',
    employeeNumber: 1234,
    givenName: 'jakelijaEtunimi',
    mail: 'grp-toska+fail@helsinki.fi',
    schacDateOfBirth: undefined,
    schacPersonalUniqueCode: undefined,
    sn: 'jakelija',
  },
  {
    uid: 'fuksi',
    employeeNumber: undefined,
    givenName: 'fuksiEtunimi',
    mail: 'grp-toska+fukrekfuksi@helsinki.fi',
    schacDateOfBirth: 19770501,
    schacPersonalUniqueCode:
      'urn:schac:personalUniqueCode:int:studentID:helsinki.fi:fuksi',
    sn: 'fuksi',
  },
  {
    uid: 'fuksi_without_studentnumber',
    employeeNumber: undefined,
    givenName: 'fuksiEtunimi',
    mail: 'grp-toska+fukrekfuksi@helsinki.fi',
    schacDateOfBirth: 19770501,
    schacPersonalUniqueCode:
      'urn:schac:personalUniqueCode:int:studentID:helsinki.fi',
    sn: 'fuksi',
  },
  {
    uid: 'non_fuksi_student',
    employeeNumber: undefined,
    givenName: 'non-fuksiEtunimi',
    mail: 'grp-toska+fail@helsinki.fi',
    schacDateOfBirth: 19850806,
    schacPersonalUniqueCode:
      'urn:schac:personalUniqueCode:int:studentID:helsinki.fi:non-fuksi',
    sn: 'non-fuksi',
  },
  {
    uid: 'non_admin_staff',
    employeeNumber: 1234,
    givenName: 'non-admin-staffEtunimi',
    mail: 'grp-toska+fail@helsinki.fi',
    schacDateOfBirth: undefined,
    schacPersonalUniqueCode: undefined,
    sn: 'non-admin-staff',
  },
  {
    uid: 'irrelevant_staff',
    employeeNumber: 12345,
    givenName: 'irrelevant-staffEtunimi',
    mail: 'grp-toska+fail@helsinki.fi',
    schacDateOfBirth: undefined,
    schacPersonalUniqueCode: undefined,
    sn: 'irrelevant-staff',
  },
  {
    uid: 'reclaimer',
    employeeNumber: 123456,
    givenName: 'reclaimerEtunimi',
    mail: 'grp-toska+fail@helsinki.fi',
    schacDateOfBirth: undefined,
    schacPersonalUniqueCode: undefined,
    sn: 'reclaimer',
  },
]

const eligilityTestUsers = [
  {
    uid: 'eligible2',
    schacPersonalUniqueCode: 'urn:schac:personalUniqueCode:int:studentID:helsinki.fi:eligible2',
    sn: 'eligible2',
  },
  {
    uid: 'eligible3',
    schacPersonalUniqueCode: 'urn:schac:personalUniqueCode:int:studentID:helsinki.fi:eligible3',
    sn: 'eligible3',
  },
  {
    uid: 'ineligible1',
    schacPersonalUniqueCode: 'urn:schac:personalUniqueCode:int:studentID:helsinki.fi:ineligible1',
    sn: 'ineligible1',
  },
  {
    uid: 'ineligible2',
    schacPersonalUniqueCode: 'urn:schac:personalUniqueCode:int:studentID:helsinki.fi:ineligible2',
    sn: 'ineligible2',
  },
  {
    uid: 'ineligible3',
    schacPersonalUniqueCode: 'urn:schac:personalUniqueCode:int:studentID:helsinki.fi:ineligible3',
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
