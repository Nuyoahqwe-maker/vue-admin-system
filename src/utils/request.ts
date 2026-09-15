import axios from 'axios'
import { ElMessage } from 'element-plus'

// 1. 创建 Axios 实例
const service = axios.create({
  baseURL: '/api', // 所有请求都会带上 /api 前缀
  timeout: 5000, // 请求超时时间
})

// 2. 请求拦截器：在请求发送前做点什么（比如加 token）
service.interceptors.request.use(
  (config) => {
    // 假设我们之后会存 token 在 localStorage
    const token = localStorage.getItem('token')
    if (token) {
      // 给请求头加上 Authorization 字段
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 3. 响应拦截器：在收到响应后做点什么（比如处理错误码、剥离数据）
service.interceptors.response.use(
  (response) => {
    const res = response.data
    // 假设后端返回的数据格式是 { code: 200, data: ..., message: '...' }
    if (res.code !== 200) {
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res.data // 直接返回核心数据
    }
  },
  (error) => {
    ElMessage.error(error.message || '网络请求失败')
    return Promise.reject(error)
  },
)

export default service
