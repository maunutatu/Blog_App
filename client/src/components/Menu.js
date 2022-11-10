import LoggedIn from './LoggedIn'
import {useNavigate} from 'react-router-dom'
import Button from '@mui/material/Button'
import {setUser} from '../reducers/userReducer'
import {useDispatch} from 'react-redux'

// Component responsible for the menu view on top of the screen

const Menu = ({name}) => {

  // Used for switching between different pages
  const navigate = useNavigate()

  // Used for activating reducer actions
  const dispatch = useDispatch()

  // Event handler for log out button. Logs the current user out.
  const handleLogOut = async (event) => {
    event.preventDefault()
    dispatch(setUser(null))
    window.localStorage.removeItem('loggedInUser')
    navigate('/')
  }

  // Event handler for settings button. Opens up user settings
  const handleSettings = async (event) => {
    event.preventDefault()
    navigate('/settings')
  }

  // LoggedIn handles user-specific functionalities
  return (
    <div>
      <Button variant={'text'} onClick={() => navigate('/')}>Blogs</Button>
      <Button variant={'text'} onClick={() => navigate('/users')}>Users</Button>
      <LoggedIn name={name} handleLogOut={handleLogOut} handleSettings={handleSettings}/>
    </div>
  )
}

export default Menu