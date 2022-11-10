import {createSlice} from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import blogsService from '../services/blogs'
import {initializeUsers} from './usersReducer'

// Reducer for handling the state of blog posts
// Reducer and action creators are created by Redux Toolkit createSlice function

const initialState = []

const blogsSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    newBlog(state, action) {
      return [...state, action.payload]
    }
  }
})

// Action creators are accessed from the object returned by createSlice function
export const {setBlogs} = blogsSlice.actions

// Action creators implemented by Redux Thunk for asynchronous operations


// Fetching blogs from the server and updating state
export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

// Sending the new blog to the server, fetching server data and refreshing blogs.
export const createBlog = (newBlog) => {
  return async dispatch => {
    await blogService.create(newBlog)
    const updatedBlogs = await blogService.getAll()
    dispatch(setBlogs(updatedBlogs))
  }
}

// Sending information about the like to the server, fetching server data and refreshing blogs.
export const likeBlog = (likedBlog) => {
  return async dispatch => {
    await blogService.like(likedBlog)
    const updatedBlogs = await blogService.getAll()
    dispatch(setBlogs(updatedBlogs))
  }
}

// Sending information about the deletion to the server, fetching server data and refreshing blogs.
export const deleteBlog = (blogToBeDeleted) => {
  return async dispatch => {
    await blogService.remove(blogToBeDeleted)
    const updatedBlogs = await blogService.getAll()
    dispatch(setBlogs(updatedBlogs))
    dispatch(initializeUsers())
  }
}

// Sending information about the comment to the server, fetching server data and refreshing blogs.
export const commentBlog = (blogToBeCommented, comment) => {
  return async dispatch => {
    await blogService.comment(blogToBeCommented, comment)
    const updatedBlogs = await blogService.getAll()
    dispatch(setBlogs(updatedBlogs))
  }
}

// Sending information about the removal of a comment to the server, fetching server data and refreshing blogs.
export const removeComment = (blogTheCommentIsOn, comment) => {
  return async dispatch => {
    await blogsService.removeComment(blogTheCommentIsOn, comment)
    const updatedBlogs = await blogService.getAll()
    dispatch(setBlogs(updatedBlogs))
  }
}

export default blogsSlice.reducer