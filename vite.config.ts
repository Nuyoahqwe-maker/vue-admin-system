import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
// 1. 引入 CDN 插件（需要先安装：npm install vite-plugin-cdn-import -D）
import importToCDN from 'vite-plugin-cdn-import'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    // 2. 配置 CDN 按需加载
    importToCDN({
      modules: [
        {
          name: 'element-plus',
          var: 'ElementPlus',
          path: 'https://unpkg.com/element-plus@2.9.1/dist/index.full.min.js',
          css: 'https://unpkg.com/element-plus@2.9.1/dist/index.css',
        },
        {
          name: 'echarts',
          var: 'echarts',
          path: 'https://unpkg.com/echarts@5.5.1/dist/echarts.min.js',
        },
      ],
    }),
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
            // 把 Vue 相关的库打包到一个文件
            if (id.includes('vue') || id.includes('pinia')) {
              return 'vue-vendor'
            }
            // 把 ElementPlus 打包到一个文件
            if (id.includes('element-plus')) {
              return 'element-plus'
            }
            // 把 ECharts 打包到一个文件
            if (id.includes('echarts')) {
              return 'echarts'
            }
            // 把 Mock.js 打包到一个文件
            if (id.includes('mockjs')) {
              return 'mockjs'
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
