export const possibleUsers = [
  {
    uid: 'admin',
    edupersonaffiliation: 'idk',
  },
  {
    uid: 'jakelija',
    edupersonaffiliation: 'idk',
  },
  {
    uid: 'fuksi',
    edupersonaffiliation: 'idk',
  },
  {
    uid: 'non_fuksi_student',
    edupersonaffiliation: 'idk',
  },
  {
    uid: 'non_admin_staff',
    edupersonaffiliation: 'idk',
  },
]

export const setHeaders = (uid) => {
  const user = possibleUsers.find(u => u.uid === uid)
  if (!user) return

  localStorage.setItem('fakeUser', JSON.stringify(user))
}

export const getHeaders = () => {
  const user = JSON.parse(localStorage.getItem('fakeUser') || '{}')
  return user
}
