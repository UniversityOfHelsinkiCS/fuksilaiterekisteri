export default getRedirectPathForUser = (user) => {
  if (user.eligible) {
    return '/student'
  } if (user.admin) {
    return '/admin'
  } if (user.distributor) {
    return '/distributor'
  } if (user.staff) {
    return '/staff'
  }

  return '/unauthorized'
}
