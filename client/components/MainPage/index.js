import React from 'react'
import { connect } from 'react-redux'

const MainPage = ({ user }) => {
  console.log('Main page, user:', user)
  return (
    <div>
      Hei, tällä sivulla on oikeastaan vain redirectit riippuen siitä mitkä oikeudet sinulla on.
    </div>
  )
}

const mapStateToProps = ({ user }) => ({
  user: user.data,
})

export default connect(mapStateToProps)(MainPage)
