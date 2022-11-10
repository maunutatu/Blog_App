import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

// Component responsible for rendering the login form

const LoginForm = ({username, password, handleLogin, setUsername, setPassword, toggleSignUp}) => (
  <form onSubmit={handleLogin} className={'login'}>
    <div>
      <TextField type={'text'} value={username} label={'Username'} size={'small'} margin={'normal'} onChange={({target}) => setUsername(target.value)}/>
    </div>
    <div>
      <TextField type={'password'} value={password} label={'Password'} size={'small'} margin={'normal'} onChange={({target}) => setPassword(target.value)}/>
    </div>
    <br/>
    <Button variant={'contained'} type={'submit'}>login</Button>
    <br/>
    <br/>
    <Button onClick={toggleSignUp}>Don&apos;t have an account? Sign Up</Button>
  </form>
)

export default LoginForm