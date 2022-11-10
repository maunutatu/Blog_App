import {createSlice} from '@reduxjs/toolkit'

// Reducer for handling the state of notifications
// Reducer and action creators are created by Redux Toolkit createSlice function

const initialState = {message: '', type: ''}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      return action.payload
    }
  }
})

// Action creators are accessed from the object returned by createSlice function
export const {setNotification} = notificationSlice.actions

export default notificationSlice.reducer