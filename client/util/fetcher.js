import axios from 'axios'

const baseURL = "http://localhost:3001/api"
// process.env.NODE_ENV === 'development'
//   ? 'http://localhost:3001/api'
//   : `https://${process.env.SITE_NAME}/api`

const publicFetch = axios.create({
  baseURL
})

export { publicFetch, baseURL }
