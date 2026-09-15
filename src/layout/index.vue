<template>
  <el-container class="layout-container">
    <!-- 1. 左侧菜单栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px'" class="aside">
      <div class="logo">{{ isCollapse ? '后台' : '后台管理系统' }}</div>

      <!-- 使用 el-menu 实现导航 -->
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        :collapse="isCollapse"
        :collapse-transition="false"
        router
      >
        <el-menu-item index="/home">
          <el-icon><HomeFilled /></el-icon>
          <template #title>首页</template>
        </el-menu-item>

        <el-menu-item index="/user">
          <el-icon><User /></el-icon>
          <template #title>用户管理</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 右侧主体 -->
    <el-container>
      <!-- 2. 顶部导航栏 -->
      <el-header class="header">
        <div class="header-left">
          <!-- 折叠按钮 -->
          <el-icon class="collapse-btn" @click="toggleCollapse">
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>

          <!-- 面包屑导航 -->
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentRouteName }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="header-right">
          <!-- 用户头像下拉菜单 -->
          <el-dropdown>
            <span class="el-dropdown-link">
              <el-avatar
                :size="30"
                src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
              />
              <span class="username">彭家慧</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 3. 中间内容区 -->
      <el-main class="main">
        <!-- 渲染子路由页面 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { HomeFilled, User, Fold, Expand } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

// 控制菜单折叠状态
const isCollapse = ref(false)
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

// 获取当前路由信息，用于高亮菜单和显示面包屑
const route = useRoute()
const activeMenu = computed(() => route.path)
const currentRouteName = computed(() => route.meta.title || route.name || '首页')

// 退出登录
const router = useRouter()
const userStore = useUserStore()

const handleLogout = () => {
  userStore.logout() // 清空 Pinia 和 localStorage 里的 token
  router.push('/login') // 跳转到登录页
}
</script>

<style scoped lang="less">
.layout-container {
  height: 100vh;
  overflow: hidden;
}

.aside {
  background-color: #304156;
  transition: width 0.3s;
  overflow-x: hidden; /* 折叠时隐藏文字 */

  .logo {
    height: 60px;
    line-height: 60px;
    text-align: center;
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    background-color: #2b3649;
    white-space: nowrap;
    overflow: hidden;
  }

  .el-menu-vertical {
    border-right: none;
  }
}

.header {
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;

  .header-left {
    display: flex;
    align-items: center;
    gap: 20px;

    .collapse-btn {
      font-size: 20px;
      cursor: pointer;
      color: #5a5e66;
      &:hover {
        color: #409eff;
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;

    .username {
      font-size: 14px;
      color: #333;
      margin-left: 8px;
    }
  }
}

.main {
  background-color: #f0f2f5;
  padding: 20px;
  overflow-y: auto;
}
</style>
