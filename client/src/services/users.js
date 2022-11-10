import axios from 'axios'

// axios library is used for communication between the front-end and back-end

// URL for communication regarding login
const baseUrl = '/api/users'

// Token for user administration. setToken is called during login
let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

// Fetches users from the server with HTTP GET
const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

// Updates a user with HTTP PUT
const update = async (userToBeUpdated) => {
  const config = {
    headers: {Authorization: token}
  }

  const response = await axios.put(`${baseUrl}/${userToBeUpdated.id}`, userToBeUpdated, config)
  return response.data
}

// Removes a user with HTTP DELETE
const remove = async (userToBeRemoved) => {
  const config = {
    headers: {Authorization: token}
  }

  const response = await axios.delete(`${baseUrl}/${userToBeRemoved.id}`, config)
  return response.data
}

export default {getAll, update, setToken, remove}