const ITEM_NAME = 'fakeUser'

export const possibleUsers = [
  {
    uid: 'admin',
    employeeNumber: undefined,
    givenName: 'admin',
    mail: undefined,
    schacDateOfBirth: undefined,
    schacPersonalUniqueCode: undefined,
    sn: 'admin',
  },
  {
    uid: 'jakelija',
    employeeNumber: 1234,
    givenName: 'jakelija',
    mail: undefined,
    schacDateOfBirth: undefined,
    schacPersonalUniqueCode: undefined,
    sn: 'jakelija',
  },
  {
    uid: 'fuksi',
    employeeNumber: undefined,
    givenName: 'fuksi',
    mail: undefined,
    schacDateOfBirth: undefined,
    schacPersonalUniqueCode: '::::::fuksi',
    sn: 'fuksi',
  },
  {
    uid: 'non_fuksi_student',
    employeeNumber: undefined,
    givenName: 'non-fuksi',
    mail: undefined,
    schacDateOfBirth: undefined,
    schacPersonalUniqueCode: '::::::non-fuksi',
    sn: 'non-fuksi',
  },
  {
    uid: 'non_admin_staff',
    employeeNumber: 1234,
    givenName: 'non-admin-staff',
    mail: undefined,
    schacDateOfBirth: undefined,
    schacPersonalUniqueCode: undefined,
    sn: 'non-admin-staff',
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
