import React, {
  useEffect, useState, useMemo, useRef,
} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { NotificationManager } from 'react-notifications'
import { getUsersAction, setUserAdminNote } from '../../util/redux/usersReducer'
import UserTable from './UserTable'
import UserModal from './UserModal'
import StatsTable from '../StatsTable'

export default () => {
  const [modalUser, setModalUser] = useState(null)
  const dispatch = useDispatch()
  const users = useSelector(state => state.users.data)

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

  return (
    <div style={{ width: '100%' }}>
      <UserModal user={selectedUser} handleClose={handleModalClose} handleSubmit={handleModalSubmit} open={modalUser !== null} />
      <StatsTable students={users.filter(u => u.studentNumber)} />
      <UserTable handleAdminNoteClick={handleAdminNoteClick} users={users} />
    </div>
  )
}
