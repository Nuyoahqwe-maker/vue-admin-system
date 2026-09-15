import Mock from 'mockjs'

// ==================== 本地存储辅助函数 ====================
const STORAGE_KEY = 'mock_user_list'

// 从 localStorage 读取数据
const getLocalData = () => {
  const data = localStorage.getItem(STORAGE_KEY)
  if (data) {
    return JSON.parse(data)
  }
  return null
}

// 将数据保存到 localStorage
const setLocalData = (data: any) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// ==================== 初始化数据 ====================
// 如果 localStorage 里没有数据，就用 Mock.js 生成一份并保存
let userList = getLocalData()
if (!userList) {
  userList = Mock.mock({
    'list|55': [
      {
        'id|+1': 1,
        username: '@cname',
        email: '@email',
        'role|1': ['管理员', '普通用户'],
        createTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
      },
    ],
  }).list
  setLocalData(userList) // 保存到本地
}

// ==================== Mock 接口定义 ====================

// 1. 获取用户列表（支持分页和搜索）
Mock.mock(/\/api\/user\/list/, 'get', (options: any) => {
  // 每次请求时，从 localStorage 重新读取，保证数据最新
  const currentData = getLocalData() || userList

  const url = new URL(options.url, 'http://localhost')
  const page = parseInt(url.searchParams.get('page') || '1')
  const size = parseInt(url.searchParams.get('size') || '10')
  const username = url.searchParams.get('username') || ''

  let filtered = currentData
  if (username) {
    filtered = currentData.filter((u: any) => u.username.includes(username))
  }

  const start = (page - 1) * size
  const end = start + size
  const pageList = filtered.slice(start, end)

  return {
    code: 200,
    message: 'success',
    data: {
      list: pageList,
      total: filtered.length,
    },
  }
})

// 2. 新增用户
Mock.mock('/api/user/add', 'post', (options: any) => {
  const body = JSON.parse(options.body)
  const currentData = getLocalData() || userList

  const newId = currentData.length > 0 ? Math.max(...currentData.map((u: any) => u.id)) + 1 : 1
  const newUser = {
    id: newId,
    ...body,
    createTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
  }
  currentData.unshift(newUser)
  setLocalData(currentData) // 保存到本地

  return { code: 200, message: '新增成功', data: null }
})

// 3. 编辑用户
Mock.mock('/api/user/update', 'put', (options: any) => {
  const body = JSON.parse(options.body)
  const currentData = getLocalData() || userList
  const index = currentData.findIndex((u: any) => u.id === body.id)

  if (index !== -1) {
    currentData[index] = { ...currentData[index], ...body }
    setLocalData(currentData) // 保存到本地
  }
  return { code: 200, message: '编辑成功', data: null }
})

// 4. 删除用户
Mock.mock(/\/api\/user\/delete\/\d+/, 'delete', (options: any) => {
  const id = parseInt(options.url.split('/').pop())
  const currentData = getLocalData() || userList
  const newData = currentData.filter((u: any) => u.id !== id)
  setLocalData(newData) // 保存到本地

  return { code: 200, message: '删除成功', data: null }
})
