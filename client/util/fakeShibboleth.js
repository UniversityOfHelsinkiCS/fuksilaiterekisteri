const ITEM_NAME = 'fakeUser'

export const possibleUsers = [
  {
    uid: 'admin',
    employeeNumber: null,
    givenName: 'admin',
    mail: null,
    schacDateOfBirth: null,
    schacPersonalUniqueCode: null,
    sn: 'admin'
  },
  {
    uid: 'jakelija',
    employeeNumber: 1234,
    givenName: 'jakelija',
    mail: null,
    schacDateOfBirth: null,
    schacPersonalUniqueCode: null,
    sn: 'jakelija'
  },
  {
    uid: 'fuksi',
    employeeNumber: null,
    givenName: 'fuksi',
    mail: null,
    schacDateOfBirth: null,
    schacPersonalUniqueCode: '::::::fuksi',
    sn: 'fuksi'
  },
  {
    uid: 'non_fuksi_student',
    employeeNumber: null,
    givenName: 'non-fuksi',
    mail: null,
    schacDateOfBirth: null,
    schacPersonalUniqueCode: '::::::non-fuksi',
    sn: 'non-fuksi',
  },
  {
    uid: 'non_admin_staff',
    employeeNumber: 1234,
    givenName: 'non-admin-staff',
    mail: null,
    schacDateOfBirth: null,
    schacPersonalUniqueCode: null,
    sn: 'non-admin-staff'
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
