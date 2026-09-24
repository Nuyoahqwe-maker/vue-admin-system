# Vue 通用后台管理系统

基于 Vue3 + TypeScript + Vite + ElementPlus 构建的通用后台管理系统，包含用户管理 CRUD、Mock 数据持久化、ECharts 数据看板、登录鉴权等完整功能。

**🔗 在线预览**：<!-- 部署完成后把访问地址填到这里 -->

## 🛠️ 技术栈

- **核心框架**：Vue3 + TypeScript + Vite
- **UI 组件库**：ElementPlus
- **状态管理**：Pinia
- **路由管理**：Vue Router（动态路由 + 面包屑联动）
- **网络请求**：Axios（二次封装：请求/响应拦截、统一错误处理、鉴权注入）
- **数据模拟**：Mock.js（拦截 API 请求，支撑前后端并行开发）
- **数据可视化**：ECharts
- **样式方案**：Less（全局变量注入）
- **代码规范**：ESLint + Prettier
- **性能优化**：Element Plus / ECharts 按需引入 + 代码分割

## ✨ 核心功能

### 1. 用户管理模块

- 完整的增删改查（CRUD）功能
- 支持按用户名搜索、分页展示
- 表单校验（必填、邮箱格式等）

### 2. 数据持久化

- 使用 Mock.js 拦截 Axios 请求，模拟高仿真后端数据
- 结合 localStorage 持久化数据，刷新页面数据不丢失
- 支撑前后端并行开发，降低对后端接口的依赖

### 3. 权限控制

- 登录页 + Pinia 管理 token
- 全局路由守卫：未登录强制跳转登录页
- 退出登录清空状态

### 4. 数据可视化看板

- 首页集成 ECharts，展示用户增长趋势折线图
- 用户角色分布饼图
- 顶部统计卡片（总用户数、今日活跃等）

### 5. 布局与交互

- 左侧可折叠菜单栏 + 顶部导航栏 + 内容区
- 动态路由与层级面包屑联动
- 用户头像下拉菜单

## 🚀 性能优化

- **Element Plus 按需引入**：通过 `unplugin-vue-components` + `unplugin-auto-import`，模板里用到哪个组件才打包哪个，替代原本的全量引入
- **ECharts 按需引入**：基于 `echarts/core` 只注册折线图、饼图及所需组件，替代 1MB 的全量包
- **代码分割**：使用 `manualChunks` 将 Vue、Element Plus、ECharts 等拆分为独立 chunk
- **路由懒加载**：所有页面组件按需加载

优化前后主要资源体积对比：

| 资源 | 优化前 | 优化后 |
| --- | --- | --- |
| Element Plus JS | 975 KB | 441 KB |
| Element Plus CSS | 359 KB | 159 KB |
| ECharts | 1000 KB | 530 KB |
| 图标库 | ~430 KB | 0（按需 import） |

**首屏资源总量从 3.1MB 降至 1.4MB。**

## 📦 项目运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 打包生产环境
npm run build
```

默认登录账号：

用户名：admin

密码：123456

📝 说明
本项目为个人练习项目，用于展示 Vue3 全家桶 + TypeScript 的工程化实践，涵盖前端开发中的常见场景。
