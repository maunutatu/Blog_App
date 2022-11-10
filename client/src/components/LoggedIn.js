import Button from '@mui/material/Button'

// Component responsible for user-specific functionalities in the Menu component

const LoggedIn = ({name, handleLogOut, handleSettings}) => (
  <>
    {name} logged in
    <Button sx={{margin: 1}} variant={'outlined'} size={'small'} onClick={handleLogOut}>logout</Button>
    <Button variant={'outlined'} size={'small'} onClick={handleSettings}>settings</Button>
  </>
)

export default LoggedIn