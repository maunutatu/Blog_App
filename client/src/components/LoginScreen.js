import {useState} from 'react'
import LoginForm from './LoginForm'
import SignUpForm from './SignUpForm'
import {loginUser, signUpUser} from '../reducers/userReducer'
import {useDispatch} from 'react-redux'

// Component responsible for displaying either the LoginForm or SignUpForm

const LoginScreen = ({username, password, setUsername, setPassword}) => {

  // State hook for name input
  const [name, setName] = useState('')

  // Used for activating reducer actions
  const dispatch = useDispatch()

  // Boolean state for switching between LoginForm and SignUpForm
  const [signUp, setSignUp] = useState(false)

  const toggleSignUp = (event) => {
    event.preventDefault()
    setSignUp(!signUp)
  }

  // Event handler for logging in
  const handleLogin = async (event) => {
    event.preventDefault()
    dispatch(loginUser({username, password}))
    setUsername('')
    setPassword('')
  }

  // Event handler for signing up
  const handleSignUp = async (event) => {
    event.preventDefault()
    dispatch(signUpUser({username, password, name}))
    setUsername('')
    setPassword('')
    setName('')
  }

  // Renders LoginForm or SignUpForm depending on the state of signUp
  return (
    <div>
      {signUp === false ? <LoginForm username={username} password={password} setUsername={setUsername} setPassword={setPassword} handleLogin={handleLogin} toggleSignUp={toggleSignUp}/> : <SignUpForm username={username} password={password} setUsername={setUsername} setPassword={setPassword} handleSignUp={handleSignUp} toggleSignUp={toggleSignUp} name={name} setName={setName}/>}
    </div>
  )
}

export default LoginScreen