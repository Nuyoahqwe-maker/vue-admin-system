import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
// 按需引入：模板里用到哪个组件，才打包哪个组件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  // GitHub Pages 的项目站点部署在子路径下（/仓库名/），
  // 不设置 base 的话所有资源都会 404
  base: process.env.GITHUB_PAGES ? '/vue-admin-system/' : '/',
  plugins: [
    vue(),
    vueDevTools(),
    // Element Plus 按需引入
    // AutoImport 负责自动导入 ElMessage / ElMessageBox 这类函数式 API
    // Components 负责自动导入 <el-table> / <el-button> 这类组件
    AutoImport({ resolvers: [ElementPlusResolver()] }),
    Components({ resolvers: [ElementPlusResolver()] }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // 3. 新增：Less 全局变量注入
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `@import "@/assets/styles/variables.less";`,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // 注意判断顺序：'@element-plus/icons-vue' 的路径里也含 'vue'，
            // 如果把 vue 的判断放前面，图标库会被误归到 vue-vendor 里
            if (id.includes('element-plus')) {
              return 'element-plus'
            }
            // zrender 是 ECharts 的底层依赖，要一起放进来
            if (id.includes('echarts') || id.includes('zrender')) {
              return 'echarts'
            }
            if (id.includes('mockjs')) {
              return 'mockjs'
            }
            if (id.includes('vue') || id.includes('pinia')) {
              return 'vue-vendor'
            }
            // 其他的第三方库统一打包到 vendor
            return 'vendor'
          }
        },
      },
    },
    // 提高警告阈值，避免因为 ElementPlus 太大而报黄
    chunkSizeWarningLimit: 1000,
  },
})
