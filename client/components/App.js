import React from 'react'
import FakeShibboBar from 'Components/FakeShibboBar'
import NavBar from 'Components/NavBar'
import Footer from 'Components/Footer'
import Router from 'Components/Router'

export default () => (
  <div>
    <FakeShibboBar>
      <NavBar />
      <Router />
      <Footer />
    </FakeShibboBar>
  </div>
)
