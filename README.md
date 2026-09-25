# Vue 通用后台管理系统

基于 Vue3 + TypeScript + Vite + ElementPlus 构建的通用后台管理系统，包含用户管理 CRUD、Mock 数据持久化、ECharts 数据看板、登录鉴权等完整功能。

**🔗 在线预览**：https://nuyoahqwe-maker.github.io/vue-admin-system/

**登录账号**：admin / 123456

## 🛠️ 技术栈

- **核心框架**：Vue3 + TypeScript + Vite
- **UI 组件库**：ElementPlus
- **状态管理**：Pinia
- **路由管理**：Vue Router（全局路由守卫鉴权 + 嵌套路由 + 面包屑导航）
- **网络请求**：Axios（二次封装：请求/响应拦截、统一错误处理、鉴权注入）
- **通用组件**：配置式 Table / Form（JSON 配置驱动列定义与校验规则）
- **数据模拟**：Mock.js（拦截 API 请求，支撑前后端并行开发）
- **数据可视化**：ECharts
- **样式方案**：Less（全局变量注入）
- **代码规范**：ESLint + Prettier
- **部署**：GitHub Actions 自动构建并发布到 GitHub Pages

## ✨ 核心功能

### 1. 用户管理模块

- 完整的增删改查（CRUD）功能
- 支持按用户名搜索、分页展示
- 表单校验（必填、邮箱格式等）

### 2. 配置式通用组件

把重复的表格列定义和表单字段抽成配置，新增页面只需维护一份配置对象。

**`ConfigTable`** —— 传入 `columns` 配置即可渲染表格：

- 三种渲染优先级：`slot`（自定义内容）> `formatter`（格式化函数）> `prop`（直接取值），按需选择，不用的能力不产生成本
- 支持动态插槽名，列配置里写 `slot: 'role'`，父组件用 `<template #role>` 接住
- `prop` 支持 `'user.name'` 嵌套路径取值
- `border` / `stripe` 等原生属性通过属性透传直接生效

**`ConfigForm`** —— 传入 `fields` 配置即可渲染表单：

- 校验规则写在字段配置里，组件自动汇总成 `el-form` 的 `rules`，避免字段与规则分散在两处维护
- 内置 `input` / `textarea` / `select` / `radio` 四种控件
- 暴露 `validate` / `resetFields` / `clearValidate`，调用方式与原生 `el-form` 一致

### 3. 数据持久化

- 使用 Mock.js 拦截 Axios 请求，模拟高仿真后端数据
- 结合 localStorage 持久化数据，刷新页面数据不丢失
- 支撑前后端并行开发，降低对后端接口的依赖

### 4. 权限控制

- 登录页 + Pinia 管理 token
- 全局路由守卫：未登录强制跳转登录页
- 退出登录清空状态

### 5. 数据可视化看板

- 首页集成 ECharts，展示用户增长趋势折线图
- 用户角色分布饼图
- 顶部统计卡片（总用户数、今日活跃等）

### 6. 布局与交互

- 左侧可折叠菜单栏 + 顶部导航栏 + 内容区
- 动态路由与层级面包屑联动
- 用户头像下拉菜单

## 🚀 性能优化

- **Element Plus JS 按需引入**：通过 `unplugin-vue-components` + `unplugin-auto-import` 自动注册用到的组件，从全量 975 KB 降至 446 KB
- **ECharts 按需引入**：基于 `echarts/core` 只注册折线图、饼图及所需组件，从 1 MB 全量包降至 530 KB
- **图标按需 import**：不再全局注册全部图标（会打进约 430 KB），改为用到哪个引哪个
- **代码分割**：使用 `manualChunks` 将 Vue、Element Plus、ECharts 拆分为独立 chunk
- **路由懒加载**：所有页面组件按需加载

优化前后首屏资源对比：

| 资源 | 优化前 | 优化后 |
| --- | --- | --- |
| Element Plus JS | 975 KB | 446 KB |
| ECharts | 1000 KB | 530 KB |
| Vue / Pinia 等 | 514 KB | 81 KB |
| 图标库 | ~430 KB | 0（按需 import） |

**首屏资源总量从 3.1MB 降至约 1.6MB。**

> **关于 Element Plus 的 CSS**：这里用的是全量引入（约 390 KB），而不是按需。
> 因为按需解析器只能识别模板里静态写出的 `<el-xxx>`，遇到函数式调用的组件
> （如 `ElMessageBox` 确认弹窗）和 `<component :is>` 动态组件时可能漏掉样式。
> 用 230 KB 的体积换取样式的确定性，对这个规模的项目是划算的。

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
