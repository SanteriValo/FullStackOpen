import axios from 'axios'
const baseUrl = '/api/blogs'

const setToken = (newToken) => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (newBlog) => {
  const response = await axios.post(baseUrl, newBlog)
  return response.data
}

const update = async (id, updatedBlog) => {
  const response = await axios.put(`${baseUrl}/${id}`, updatedBlog)
  return response.data
}

export default { getAll, create, update, setToken }