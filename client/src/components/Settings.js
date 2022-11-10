import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

// Component responsible for rendering user settings

const Settings = ({user, handleSubmit, handleRemove}) => {

  // Returns null until user data arrives from the back-end
  if(!user) {
    return null
  }

  return (
    <div>
      <h3>User settings</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField type={'text'} name={'name'} defaultValue={`${user.name}`} label={'Name'} size={'small'} margin={'normal'}/>
        </div>
        <div>
          <TextField type={'text'} name={'username'} defaultValue={`${user.username}`} label={'Username'} size={'small'} margin={'normal'}/>
        </div>
        <div>
          <TextField type={'password'} name={'password'} label={'Password'} size={'small'} margin={'normal'}/>
        </div>
        <br/>
        <Button variant={'contained'} type={'submit'}>change</Button>
      </form>
      <br/>
      <br/>
      <Button variant={'contained'} onClick={handleRemove}>remove account and posts</Button>
    </div>
  )
}

export default Settings