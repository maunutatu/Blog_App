import {Card, CardContent, Typography} from '@mui/material'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import CommentIcon from '@mui/icons-material/Comment'
import {useNavigate} from 'react-router-dom'

// Component responsible for rendering a single blog card in the Bloglist

const BlogCard = ({blog}) => {

  // Returns null until blog data arrives from the back end
  if(!blog) {
    return null
  }
  // User for switching between different pages
  const navigate = useNavigate()

  // Built using material-ui components
  return (
    <Card sx={{maxWidth: 200}} onClick={() => navigate(`/blogs/${blog.id}`)}>
      <CardContent>
        <Typography variant={'h7'}>
          {blog.title}
        </Typography>
        <br/>
        <br/>
        <Typography variant={'h9'} color={'text.secondary'}>
          {blog.author ? `by ${blog.author}` : null}
        </Typography>
        <br/>
        <br/>
        <Typography variant={'h9'} color={'text.secondary'}>
          <ThumbUpIcon/> {blog.likes ? blog.likes.length : 0} <CommentIcon sx={{marginLeft:2}}/> {blog.comments ? blog.comments.length : 0}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default BlogCard