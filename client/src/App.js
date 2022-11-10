import './index.css'
import {useState, useEffect, useRef} from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import CreateBlog from './components/CreateBlog'
import {useDispatch} from 'react-redux'
import {setNotification} from './reducers/notificationReducer'
import {useSelector} from 'react-redux'
import {initializeBlogs, createBlog, deleteBlog, commentBlog, likeBlog} from './reducers/blogsReducer'
import {setUser, updateUser} from './reducers/userReducer'
import {Routes, Route, useMatch, useNavigate} from 'react-router-dom'
import Users from './components/Users'
import User from './components/User'
import {initializeUsers} from './reducers/usersReducer'
import Bloglist from './components/Bloglist'
import Menu from './components/Menu'
import {createTheme, ThemeProvider} from '@mui/material'
import LoginScreen from './components/LoginScreen'
import Settings from './components/Settings'
import usersService from './services/users'

const App = () => {

  // Fetching redux states
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const users = useSelector(state => state.users)

  // State hooks for logging in
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // Used for activating reducer actions
  const dispatch = useDispatch()

  // Used for switching between different pages
  const navigate = useNavigate()

  // Color palette for material-ui components
  const theme = createTheme({
    palette: {
      primary: {
        main: '#212121'
      }
    }
  })

  // Initializes blogs when rendered the first time
  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  // Initializes users when rendered the first time
  useEffect(() => {
    dispatch(initializeUsers())
  }, [])

  // Checks the browser data if user is already logged in
  useEffect(() => {
    const loggedInUserAsJson = window.localStorage.getItem('loggedInUser')

    if (loggedInUserAsJson) {
      const user = JSON.parse(loggedInUserAsJson)
      dispatch(setUser(user))
    }
  }, [])

  // Reference for CreateBlog component
  const createBlogRef = useRef()

  // Function for creating a blog
  const createABlog = async (newBlog) => {
    try {
      createBlogRef.current.toggleVisibility()
      dispatch(createBlog(newBlog))
      let message
      if (newBlog.author.length > 0) {
        message = `a new blog ${newBlog.title} by ${newBlog.author} added`
      } else {
        message = `a new blog ${newBlog.title} added`
      }
      dispatch(setNotification({message: message, type: 'success'}))
      setTimeout(function () {
        dispatch(setNotification({message: '', type: ''}))
      }, 5000)
    } catch (exception) {
      dispatch(setNotification({message: exception.toString(), type: ''}))
      setTimeout(function () {
        dispatch(setNotification({message: '', type: ''}))
      }, 5000)
    }
  }

  // Function for liking a blog post
  const likePost = async (likedBlog) => {
    try {
      dispatch(likeBlog(likedBlog))
    } catch (exception) {
      dispatch(setNotification({message: exception.toString(), type: ''}))
      setTimeout(function () {
        dispatch(setNotification({message: '', type: ''}))
      }, 5000)
    }
  }

  // Function for deleting a post
  const deletePost = async (blogToBeDeleted) => {
    try {
      dispatch(deleteBlog(blogToBeDeleted))
    } catch (exception) {
      dispatch(setNotification({message: exception.toString(), type: ''}))
      setTimeout(function () {
        dispatch(setNotification({message: '', type: ''}))
      }, 5000)
    }
  }

  // Function for commenting a post
  const commentPost = async (blogToBeCommented, comment) => {
    try {
      dispatch(commentBlog(blogToBeCommented, comment))
    } catch (exception) {
      dispatch(setNotification({message: exception.toString(), type: ''}))
      setTimeout(function () {
        dispatch(setNotification({message: '', type: ''}))
      }, 5000)
    }
  }

  // Event handler for submitting user settings
  const handleSettingsSubmit = async (event) => {
    event.preventDefault()

    const userInfo = {
      username: event.target.username.value,
      name: event.target.name.value
    }

    event.target.password.value.length !== 0 ? await usersService.update({...userInfo, password: event.target.password.value}) : await usersService.update(userInfo)

    dispatch(updateUser({...{...user, username: event.target.username.value}, name: event.target.name.value}))
    dispatch(initializeUsers())

    navigate('/')
  }

  // Event handler for deleting an user account
  const handleAccountRemoval = async (event) => {
    event.preventDefault()
    if(window.confirm('Are you sure? All account data will be lost')) {
      await usersService.remove(user)
      dispatch(setUser(null))
      window.localStorage.removeItem('loggedInUser')
      dispatch(initializeBlogs())
      dispatch(initializeUsers())
      navigate('/')
    }
  }

  // Fetches correct user data for viewing information about a single user
  const match1 = useMatch('users/:id')

  const userinfo = match1
    ? users.find(user => user.id === match1.params.id)
    : null

  // Fetches correct blog data for viewing information about a single blog
  const match2 = useMatch('blogs/:id')

  const bloginfo = match2
    ? blogs.find(blog => blog.id === match2.params.id)
    : null

  // ThemeProvider carries the theme for material-ui components

  // Routes are used for navigating to different pages on the SPA
  return (
    <ThemeProvider theme={theme}>
      <div className={'container'}>
        {user !== null ? <Menu name={user.name}/> : null}
        <h2>Blog App</h2>
        <h4>A platform for sharing blogs</h4>
        <Notification/>
        {user === null ?
          <LoginScreen username={username} password={password} setPassword={setPassword} setUsername={setUsername}/> : null}
        <Routes>
          <Route path={'/'} element={
            <div align={'center'}>
              {user !== null ? <CreateBlog createBlog={createABlog} ref={createBlogRef}/> : null}
              {user !== null ? <Bloglist blogs={blogs}/> : null}
            </div>}/>
          <Route path={'/users'} element={<Users users={users}/>}/>
          <Route path={'/users/:id'} element={<User user={userinfo}/>}/>
          <Route path={'/blogs/:id'} element={<Blog blog={bloginfo} likeAPost={likePost} deleteAPost={deletePost} commentAPost={commentPost}/>}/>
          <Route path={'/settings'} element={<Settings user={user} handleSubmit={handleSettingsSubmit} handleRemove={handleAccountRemoval}/>}/>
        </Routes>
      </div>
    </ThemeProvider>
  )
}

export default App
