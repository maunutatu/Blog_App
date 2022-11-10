import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

// Component responsible for rendering the sign up form

const SignUpForm = ({username, password, name, handleSignUp, setName, setUsername, setPassword, toggleSignUp}) => (
  <form onSubmit={handleSignUp} className={'login'}>
    <h3>Create an account</h3>
    <div>
      <TextField type={'text'} value={name} label={'Name'} size={'small'} margin={'normal'} onChange={({target}) => setName(target.value)}/>
    </div>
    <div>
      <TextField type={'text'} value={username} label={'Username'} size={'small'} margin={'normal'} onChange={({target}) => setUsername(target.value)}/>
    </div>
    <div>
      <TextField type={'password'} value={password} label={'Password'} size={'small'} margin={'normal'} onChange={({target}) => setPassword(target.value)}/>
    </div>
    <br/>
    <Button variant={'contained'} type={'submit'}>create</Button>
    <br/>
    <br/>
    <Button onClick={toggleSignUp}>Already have an account? Login</Button>
  </form>
)

export default SignUpForm