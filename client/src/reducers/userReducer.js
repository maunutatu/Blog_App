import {createSlice} from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import userService from '../services/users'
import loginService from '../services/login'
import signUpService from '../services/signup'
import {setNotification} from './notificationReducer'
import {initializeUsers} from './usersReducer'

// Reducer for handling the state of a single user
// Reducer and action creators are created by Redux Toolkit createSlice function

const initialState = null

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      if(action.payload) {
        blogService.setToken(action.payload.token)
        userService.setToken(action.payload.token)
      } else {
        blogService.setToken('')
        userService.setToken('')
      }
      return action.payload
    },
    updateUser(state, action) {
      return action.payload
    }
  }
})

// Action creators are accessed from the object returned by createSlice function
export const {setUser, updateUser} = userSlice.actions

// Action creators implemented by Redux Thunk for asynchronous operations


// Sending login data to the server. If they are approved, user is logged in. If not, there is an exception.
export const loginUser = (userCredentials) => {
  return async dispatch => {
    try {
      const user = await loginService(userCredentials)
      dispatch(setUser(user))
      window.localStorage.setItem('loggedInUser', JSON.stringify(user))
      dispatch(setNotification({message: `Welcome ${user.name}!`, type: 'success'}))
      setTimeout(() => {
        dispatch(setNotification({message: '', type: ''}))
      }, 5000)
    } catch (exception) {
      dispatch(setNotification({message: 'wrong username or password', type: 'error'}))
      console.log(exception)
      setTimeout(() => {
        dispatch(setNotification({message: '', type: ''}))
      }, 5000)
    }
  }
}


// Sending sign up data to the server. If they are approved, user is signed up and logged in. If not, there is an exception.
export const signUpUser = (userCredentials) => {
  return async dispatch => {
    try {
      await signUpService(userCredentials)
      const user = await loginService(userCredentials)
      dispatch(setUser(user))
      window.localStorage.setItem('loggedInUser', JSON.stringify(user))
      dispatch(initializeUsers())
      dispatch(setNotification({message: `Welcome ${user.name}!`, type: 'success'}))
      setTimeout(() => {
        dispatch(setNotification({message: '', type: ''}))
      }, 5000)
    } catch (exception) {
      dispatch(setNotification({message: exception.response.data.error, type: 'error'}))
      console.log(exception)
      setTimeout(() => {
        dispatch(setNotification({message: '', type: ''}))
      }, 5000)
    }
  }
}

export default userSlice.reducer