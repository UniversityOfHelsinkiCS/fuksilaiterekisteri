import React, {
  useEffect, useState, useMemo, useRef,
} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { NotificationManager } from 'react-notifications'
import { getUsersAction, setUserAdminNote } from '../../util/redux/usersReducer'
import UserTable from './UserTable'
import UserModal from './UserModal'
import StatsTable from '../StatsTable'
import AdminFilter from './AdminFilter'

export default () => {
  const [modalUser, setModalUser] = useState(null)
  const dispatch = useDispatch()
  const users = useSelector(state => state.users.data)
  const settings = useSelector(state => state.serviceStatus.data)

  const { error, settingAdminNote } = useSelector(state => state.users)
  const prevSettingAdminNote = useRef(settingAdminNote)

  useEffect(() => {
    if (!settingAdminNote && prevSettingAdminNote.current) {
      if (!error) {
        NotificationManager.success('Saved admin note successfully!')
        setModalUser(null)
      } else NotificationManager.error('Saving admin note failed!')
    }
    prevSettingAdminNote.current = settingAdminNote
  }, [settingAdminNote])

  useEffect(() => {
    dispatch(getUsersAction())
  }, [])

  const handleAdminNoteClick = userId => setModalUser(userId)
  const handleModalClose = () => setModalUser(null)
  const handleModalSubmit = param => dispatch(setUserAdminNote(param))
  const selectedUser = useMemo(() => users.find(({ id }) => id === modalUser), [modalUser])
  const [filter, setFilter] = useState('all')

  const doFiltering = () => {
    let filtered
    switch (filter) {
      case 'all':
        filtered = users
        break
      case 'deviceHolders':
        filtered = users.filter(u => !!u.deviceGivenAt) // TODO: Check if device is returned.
        break
      case 'currentYearEligible':
        filtered = users.filter(u => u.signupYear === settings.currentYear && u.eligible)
        break
      case 'allStaff':
        filtered = users.filter(u => u.admin || u.staff || u.distributor || u.reclaimer)
        break
      default:
        filtered = users
        break
    }
    return filtered
  }

  const filteredUsers = useMemo(doFiltering, [filter, users])

  return (
    <div className="tab-content">
      <UserModal user={selectedUser} handleClose={handleModalClose} handleSubmit={handleModalSubmit} open={modalUser !== null} />
      <StatsTable students={users.filter(u => u.studentNumber)} />
      <AdminFilter totalCount={users.length} filteredCount={filteredUsers.length} filter={filter} setFilter={setFilter} />
      <UserTable handleAdminNoteClick={handleAdminNoteClick} users={filteredUsers} />
    </div>
  )
}
