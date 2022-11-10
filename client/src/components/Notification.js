import {useSelector} from 'react-redux'
import Alert from '@mui/material/Alert'

// Component responsible for rendering notifications

const Notification = () => {

  // Fetches notification state from redux
  const notification = useSelector(state => state.notification)

  // Returns null if the notification state is default
  if (notification.message === '' || notification.type === '') {
    return null
  }

  // Use of material-ui Alert component
  return (
    <Alert severity={notification.type}>
      {notification.message}
    </Alert>
  )
}

export default Notification