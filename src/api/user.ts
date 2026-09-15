import request from '@/utils/request'

// 定义用户的数据类型
export interface User {
  id: number
  username: string
  email: string
  role: string
  createTime: string
}

// 定义接口返回的数据结构
export interface UserListResponse {
  list: User[]
  total: number
}

// 获取用户列表
export const getUserList = (params: { page: number; size: number; username?: string }) => {
  return request.get<any, UserListResponse>('/user/list', { params })
}

// 新增用户
export const addUser = (data: Omit<User, 'id' | 'createTime'>) => {
  return request.post('/user/add', data)
}

// 编辑用户
export const updateUser = (data: User) => {
  return request.put('/user/update', data)
}

// 删除用户
export const deleteUser = (id: number) => {
  return request.delete(`/user/delete/${id}`)
}
