import BlogCard from './BlogCard'
import Grid from '@mui/material/Unstable_Grid2'

// Component responsible for showing shared blogs on the main page

const Bloglist = ({blogs}) => {

  // Sorts post by likes in a descending fashion
  function sortByLikes(x, y) {
    if (x.likes && y.likes) {
      return y.likes.length - x.likes.length
    } else {
      return 1
    }
  }

  // Uses material-ui Grid component
  // BlogCard component is responsible for rendering each information card
  return (
    <div>
      <Grid container spacing={2} justifyContent={'center'} alignItems={'center'} >
        {blogs.map(blogs => blogs).sort(sortByLikes).map(blog =>
          <Grid key={blog.id}>
            <BlogCard  blog={blog}/>
          </Grid>
        )}
      </Grid>
    </div>
  )
}

export default Bloglist