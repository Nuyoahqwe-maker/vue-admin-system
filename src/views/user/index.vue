<template>
  <div class="user-page">
    <el-card class="search-card" shadow="never">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card" shadow="never">
      <div class="table-header">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon> 新增用户
        </el-button>
      </div>

      <!-- 配置式表格：只传 columns 和 data，其余交给插槽自定义 -->
      <ConfigTable :columns="columns" :data="tableData" :loading="loading" border stripe>
        <!-- 角色列：自定义渲染成标签 -->
        <template #role="{ row }">
          <el-tag :type="row.role === '管理员' ? 'danger' : 'success'">
            {{ row.role }}
          </el-tag>
        </template>

        <!-- 操作列：自定义渲染成按钮 -->
        <template #action="{ row }">
          <el-button size="small" type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </ConfigTable>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 20]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px" @close="handleDialogClose">
      <!-- 配置式表单：字段和校验规则都写在 formFields 里 -->
      <ConfigForm ref="formRef" :model="formData" :fields="formFields" label-width="80px" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import ConfigTable from '@/components/ConfigTable.vue'
import ConfigForm from '@/components/ConfigForm.vue'
import type { TableColumn, FieldConfig } from '@/components/types'
import { getUserList, addUser, updateUser, deleteUser, type User } from '@/api/user'

// --- 表格列配置：一条配置就是原来的一列 ---
const columns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80, align: 'center' },
  { prop: 'username', label: '用户名', minWidth: 120 },
  { prop: 'email', label: '邮箱', minWidth: 180 },
  // 角色列需要渲染成标签，用 slot 交给模板自定义
  { prop: 'role', label: '角色', width: 120, align: 'center', slot: 'role' },
  { prop: 'createTime', label: '创建时间', width: 180, align: 'center' },
  // 操作列没有对应字段，只需要 slot
  { label: '操作', width: 180, align: 'center', fixed: 'right', slot: 'action' },
]

// --- 表单字段配置：字段 + 校验规则写在一起 ---
const formFields: FieldConfig[] = [
  {
    prop: 'username',
    label: '用户名',
    placeholder: '请输入用户名',
    rules: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  },
  {
    prop: 'email',
    label: '邮箱',
    placeholder: '请输入邮箱',
    rules: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
    ],
  },
  {
    prop: 'role',
    label: '角色',
    type: 'select',
    options: [
      { label: '管理员', value: '管理员' },
      { label: '普通用户', value: '普通用户' },
    ],
    rules: [{ required: true, message: '请选择角色', trigger: 'change' }],
  },
]

// --- 数据定义 ---
const loading = ref(false)
const tableData = ref<User[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

const searchForm = reactive({ username: '' })

// --- 弹窗相关 ---
const dialogVisible = ref(false)
const dialogTitle = ref('新增用户')
const formRef = ref<InstanceType<typeof ConfigForm>>()
const isEdit = ref(false)
const editId = ref<number | null>(null)

const formData = reactive({
  username: '',
  email: '',
  role: '普通用户',
})

// --- 获取数据 ---
const fetchData = async () => {
  loading.value = true
  try {
    const res = await getUserList({
      page: currentPage.value,
      size: pageSize.value,
      username: searchForm.username,
    })
    tableData.value = res.list
    total.value = res.total
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

// --- 操作逻辑 ---
const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

const resetSearch = () => {
  searchForm.username = ''
  currentPage.value = 1
  fetchData()
}

const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增用户'
  formData.username = ''
  formData.email = ''
  formData.role = '普通用户'
  dialogVisible.value = true
}

const handleEdit = (row: User) => {
  isEdit.value = true
  dialogTitle.value = '编辑用户'
  editId.value = row.id
  formData.username = row.username
  formData.email = row.email
  formData.role = row.role
  dialogVisible.value = true
}

const handleSubmit = async () => {
  const form = formRef.value
  if (!form) return

  // el-form 的 validate 校验失败时会 reject，这里统一转成 false
  const valid = await form.validate().catch(() => false)
  if (!valid) return

  try {
    if (isEdit.value && editId.value) {
      await updateUser({
        id: editId.value,
        username: formData.username,
        email: formData.email,
        role: formData.role,
        createTime: '', // 编辑时不需要时间，但类型要求有
      })
      ElMessage.success('编辑成功')
    } else {
      await addUser({
        username: formData.username,
        email: formData.email,
        role: formData.role,
      })
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    fetchData()
  } catch (error) {
    console.error(error)
  }
}

// 关闭弹窗时清掉上一次的校验红字
const handleDialogClose = () => {
  formRef.value?.clearValidate()
}

const handleDelete = (row: User) => {
  ElMessageBox.confirm(`确定要删除用户 "${row.username}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await deleteUser(row.id)
        ElMessage.success('删除成功')
        if (tableData.value.length === 1 && currentPage.value > 1) {
          currentPage.value--
        }
        fetchData()
      } catch (error) {
        console.error(error)
      }
    })
    .catch(() => {})
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchData()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="less">
.user-page {
  .search-card {
    margin-bottom: 20px;
  }
  .table-card {
    .table-header {
      margin-bottom: 20px;
    }
    .pagination-container {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
