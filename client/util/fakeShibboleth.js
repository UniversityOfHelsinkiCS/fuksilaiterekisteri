const ITEM_NAME = 'fakeUser'

export const possibleUsers = [
  {
    uid: 'admin',
    employeeNumber: undefined,
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

export const setHeaders = (uid) => {
  const user = possibleUsers.find(u => u.uid === uid)
  if (!user) return

  localStorage.setItem(ITEM_NAME, JSON.stringify(user))
}

export const getHeaders = () => {
  const user = JSON.parse(localStorage.getItem(ITEM_NAME) || '{}')
  return user
}

export const clearHeaders = () => {
  localStorage.removeItem(ITEM_NAME)
}
