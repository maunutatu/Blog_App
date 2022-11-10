import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import {useNavigate, Link} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {removeComment} from '../reducers/blogsReducer'

// Component responsible for showing information about a single blog
// Shown when on /blogs/:id

const Blog = ({blog, likeAPost, deleteAPost, commentAPost}) => {

  // User for switching between different pages
  const navigate = useNavigate()

  // Used for activating reducer actions
  const dispatch = useDispatch()

  // Fetching redux state
  const user = useSelector(state => state.user)

  // Returns null until blog data arrives from the back end
  if(!blog) {
    return null
  }

  // Event handler for liking a post
  const handleLike = (event) => {
    event.preventDefault()
    likeAPost(blog)
  }

  // Event handler for deleting a post
  const handleDelete = (event) => {
    event.preventDefault()
    deleteAPost(blog)
    navigate('/')
  }

  // Event handler for commenting a post
  const commentBlog = (event) => {
    event.preventDefault()
    commentAPost(blog, event.target.comment.value)
    event.target.comment.value = ''
  }

  // Renders correct text depending on if the user has already liked the post
  const likeText = () => {
    if(blog.likes && blog.likes.find(x => x.toString() === user.id)) {
      return 'liked!'
    } else {
      return 'like'
    }
  }

  // Ensures the functionality of hyperlinks by adding https:// if needed.
  const hyperlinkTransformer = (url) => {
    return url.slice(0,8) === 'https://' ? url : `https://${url}`
  }

  return (
    <div align={'center'}>
      <h1>{blog.title}</h1>
      {blog.author ? <h2>by {blog.author}</h2> : null}
      <a href={hyperlinkTransformer(blog.url)} target="_blank" rel="noopener noreferrer">{blog.url}</a>
      <br/>
      Likes: {blog.likes ? blog.likes.length : 0}
      <Button sx={{margin: 1, padding: 0}} variant={'outlined'} size={'small'}  onClick={handleLike} name={`like ${blog.title}`}>{likeText()}</Button>
      <br/>
      Shared by: <Link to={`/users/${blog.user.id}`}>{blog.user.name}</Link>
      <br/>
      {user.id === blog.user.id.toString() ? <Button sx={{margin: 1}} variant={'outlined'} size={'small'} onClick={handleDelete} name={`delete ${blog.title}`}>remove</Button> : null}
      <h3>Comments</h3>
      <form onSubmit={commentBlog}>
        <TextField size={'small'} type={'text'} name={'comment'}/>
        <Button sx={{margin: 1}} variant={'outlined'} size={'small'} type={'submit'}>add comment</Button>
      </form>
      <ul style={{listStyle: 'none'}}>
        {blog.comments && blog.comments.map(comment =>
          <li key={comment.text}>
            {comment.text}
            {comment.user.toString() === user.id ? <Button variant={'text'} size={'small'} color={'error'} onClick={() => dispatch(removeComment(blog, comment))}>remove</Button> : null}</li>)}
      </ul>
    </div>
  )
}

export default Blog