import axios from 'axios'

const api = axios.create({
  baseURL: 'https://rickandmortyapi.com',
})

export default api