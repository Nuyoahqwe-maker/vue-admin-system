import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 全局样式
import '@/assets/styles/global.less'

// Mock 数据（仅在开发环境下生效）
import './mock/user'

// 注意：这里不再需要 import ElementPlus、它的 CSS，也不需要 app.use(ElementPlus)
// 因为 vite.config.ts 里配了 unplugin-vue-components 的 ElementPlusResolver，
// 模板里写到 <el-table> / <el-button> 时，组件和对应样式会被自动按需引入。
//
// 图标同理：不再全局注册所有图标（那样会把整个图标库都打进包里），
// 而是每个用到图标的文件自己 import，用到几个打包几个。

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
