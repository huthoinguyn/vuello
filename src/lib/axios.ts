import Axios from 'axios'

const axios = (Axios as any).create({
  baseURL: 'http://127.0.0.1:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

axios.interceptors.response.use(null, async (err: any) => {
  const error = <
    {
      status: number | null
      original: any
      validation: Record<string, string>
      message: string | null
    }
  >{
    status: err.response?.status,
    original: err,
    validation: {},
    message: null
  }

  switch (err.response?.status) {
    case 422:
      for (const field in err.response.data.errors) {
        error.validation[field] = err.response.data.errors[field][0]
      }
      break
    case 403:
      error.message = "You're not allowed to do that."
      break
    case 401:
      error.message = "You're not authenticated."
      break
    case 500:
      error.message = 'Something went really bad. Sorry.'
      break
    default:
      error.message = 'Something went wrong. Please try again later.'
  }

  if (err.response?.status === 401) {
    try {
      localStorage.removeItem('user')
      localStorage.removeItem('access_token')
    } catch (err) {
      console.error(err)
    }
  }

  return Promise.reject(error)
})
axios.interceptors.request.use(async (req: any) => {
  const access_token = localStorage.getItem('access_token')

  req.headers['Authorization'] = `Bearer ${access_token}`

  return req
})

export default axios
