import { React, useContext } from 'react'
import AppContext from '../../service/appContext'
import './sidebar.css'
import '../../assets/bootstrap-icons.css'

function Sidebar () {
  const myContext = useContext(AppContext)

  function selectItem (page) {
    return myContext.pageSelected === page
  }

  function goToLogin () {
    myContext.setPageSelected('login')
  }
  function goToConfig () {
    myContext.setPageSelected('config')
  }

  function goToCalendar () {
    myContext.setPageSelected('home')
  }

  return (
    <div id='mySidebar' className='sidebar'>
      {/* <p class="profile">
        <img src={"profile.jpg"} alt="profile"></img>
      </p> */}
      <i
        onClick={goToCalendar}
        className={`bi bi-calendar3  ${
          selectItem('home') ? 'activeItem' : ''
        } `}
        aria-hidden='true'
        role='button'
      />
      <i
        onClick={goToConfig}
        className={`bi bi-gear-fill  ${
          selectItem('config') ? 'activeItem' : ''
        } `}
        aria-hidden='true'
        role='button'
      />
      <i
        onClick={goToLogin}
        className='bi bi-box-arrow-left exit'
        aria-hidden='true'
        role='button'
      />
    </div>
  )
}

export default Sidebar
