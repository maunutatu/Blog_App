import {createSlice} from '@reduxjs/toolkit'
import userService from '../services/users'

// Reducer for handling the state of all users
// Reducer and action creators are created by Redux Toolkit createSlice function

const initialState = []

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(state, action) {
      return action.payload
    }
  }
})

// Action creators are accessed from the object returned by createSlice function
export const {setUsers} = usersSlice.actions

// Action creators implemented by Redux Thunk for asynchronous operations

// Fetching users from the server and updating state
export const initializeUsers = () => {
  return async dispatch => {
    const users = await userService.getAll()
    dispatch(setUsers(users))
  }
}

export default usersSlice.reducer