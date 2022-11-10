import Bloglist from './Bloglist'

// Component responsible for rendering information about a single user

const User = ({user}) => {
  if(!user) {
    return null
  }

  return (
    <div align={'center'}>
      <h2>{user.name}</h2>
      <h3>Added blogs</h3>
      <ul style={{listStyle: 'none'}}>
        {<Bloglist blogs={user.blogs}/>}
        {user.blogs.length === 0 ? <p>Nothing to show here... :/</p> : null}
      </ul>
    </div>
  )
}

export default User