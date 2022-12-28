import axios from 'axios'

// axios library is used for communication between the front-end and back-end

// URL for communication regarding blogs
const baseUrl = '/api/blogs'

// Token for user administration. setToken is called during login
let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

// Fetches blogs from the server with HTTP GET
const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

// Sends a new blog post to the server with HTTP POST
const create = async (newBlog) => {
  const config = {
    headers: {Authorization: token}
  }

  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

// Updates a blog post with HTTP PUT
const update = async (updatedBlog) => {
  const config = {
    headers: {Authorization: token}
  }

  const response = await axios.put(`${baseUrl}/${updatedBlog.id}`, updatedBlog, config)
  return response.data
}

// Updates a blog posts likes with HTTP PUT
const like = async (likedBlog) => {
  const config = {
    headers: {Authorization: token}
  }

  const response = await axios.put(`${baseUrl}/${likedBlog.id}/like`, likedBlog, config)
  return response.data
}

// Removes a blog post with HTTP DELETE
const remove = async (blogToBeDeleted) => {
  const config = {
    headers: {Authorization: token}
  }

  const response = await axios.delete(`${baseUrl}/${blogToBeDeleted.id}`, config)
  return response.data
}

// Sends a new comment to a blog with HTTP POST
const comment = async (blogToBeCommented, comment) => {
  const config = {
    headers: {Authorization: token}
  }

  const response = await axios.post(`${baseUrl}/${blogToBeCommented.id}/comments`, {text: comment} , config)
  return response.data
}

// Removes a comment from a blog with HTTP DELETE
const removeComment = async (blogTheCommentIsOn, comment) => {
  const config = {
    headers: {Authorization: token}
  }

  const response = await axios.delete(`${baseUrl}/${blogTheCommentIsOn.id}/comments/${comment.id}`, config)
  return response.data
}

export default {getAll, setToken, create, update, remove, comment, removeComment, like}