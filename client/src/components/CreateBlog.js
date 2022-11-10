import {useState, forwardRef, useImperativeHandle} from 'react'
import PropTypes from 'prop-types'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

// Component responsible for creating a new blog post

const CreateBlog = forwardRef((props, ref) => {

  // State hooks for the form
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  // Boolean state for opening and closing the form
  const [visible, setVisible] = useState(false)
  const hideWhenVisible = {display: visible ? 'none' : ''}
  const showWhenVisible = {display: visible ? '' : 'none'}

  // Function for toggling visibility
  const toggleVisibility = () => {
    setVisible(!visible)
  }

  // Shared to higher components through a ref hook
  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  // Event handler for create button
  const handleCreate = (event) => {
    event.preventDefault()

    props.createBlog({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  // Form opens when "new blog" button is clicked and closes when canceled or when a new blog is created
  return (
    <div className={'createBlog'}>
      <div style={hideWhenVisible}>
        <Button sx={{margin: 1}} variant={'outlined'} onClick={toggleVisibility}>New Blog</Button>
      </div>

      <div style={showWhenVisible}>
        <form onSubmit={handleCreate}>
          <h2>Create a New Post</h2>
          <div>
            <TextField type={'text'} size={'small'} margin={'normal'} value={title} label={'Title'} onChange={({target}) => setTitle(target.value)}/>
          </div>
          <div>
            <TextField type={'text'} size={'small'} margin={'normal'} value={author} label={'Author'} onChange={({target}) => setAuthor(target.value)}/>
          </div>
          <div>
            <TextField type={'text'} size={'small'} margin={'normal'} value={url} label={'Url'} onChange={({target}) => setUrl(target.value)}/>
          </div>
          <Button sx={{margin: 1}} size={'small'} variant={'outlined'} type={'submit'}>create</Button>
        </form>
        <Button sx={{margin: 1}} size={'small'} variant={'outlined'} onClick={toggleVisibility}>cancel</Button>
      </div>
    </div>
  )
})

// Ensures that necessary props are delivered
CreateBlog.propTypes = {
  createBlog: PropTypes.func.isRequired
}

CreateBlog.displayName = 'CreateBlog'

export default CreateBlog