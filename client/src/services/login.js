import axios from 'axios'

// axios library is used for communication between the front-end and back-end

// URL for communication regarding login
const baseUrl = '/api/login'

// Sends login information to the server with HTTP POST
const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default login