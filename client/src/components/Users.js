import {Link} from 'react-router-dom'
import {Table, TableHead, TableRow, TableCell, TableBody, Typography} from '@mui/material'

// Component responsible for rendering information about users that have made a blog post. Use of material-ui components regarding Table for organizing information and Typography for styling.

const Users = ({users}) => (
  <div align={'center'}>
    <Table sx={{width: '60%'}}>
      <TableHead>
        <TableRow>
          <TableCell></TableCell>
          <TableCell>Blogs shared</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.filter(user => user.blogs.length !== 0).map(user =>
          <TableRow key={user.id}>
            <TableCell><Link href={'#'} to={`/users/${user.id}`}>{user.name}</Link></TableCell>
            <TableCell>{user.blogs.length}</TableCell>
          </TableRow>)}
      </TableBody>
    </Table>
    <br/>
    <Typography variant={'body2'} color={'text.secondary'}>
      Don&apos;t see your account? Share a blog!
    </Typography>
  </div>
)

export default Users