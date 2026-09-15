import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 1. 引入 ElementPlus 组件库
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 引入 ElementPlus 图标库
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 引入全局样式（如果你刚才建了的话）
import '@/assets/styles/global.less'

const app = createApp(App)

// 2. 注册所有图标为全局组件（这段代码必须要有！）
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)

// 3. 挂载 ElementPlus（这行必须要有！）
app.use(ElementPlus)

// 引入 Mock 数据（仅在开发环境下生效）
import './mock/user'

app.mount('#app')
