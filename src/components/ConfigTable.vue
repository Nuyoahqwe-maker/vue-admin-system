<template>
  <el-table v-loading="loading" :data="data">
    <el-table-column
      v-for="col in columns"
      :key="col.prop || col.slot || col.label"
      :prop="col.prop"
      :label="col.label"
      :width="col.width"
      :min-width="col.minWidth"
      :align="col.align || 'left'"
      :fixed="col.fixed"
      :show-overflow-tooltip="col.showOverflowTooltip"
    >
      <template #default="scope">
        <!-- 1. 配了 slot：交给父组件渲染（标签、操作按钮等自定义内容） -->
        <slot v-if="col.slot" :name="col.slot" :row="scope.row" :index="scope.$index" />
        <!-- 2. 配了 formatter：走格式化函数 -->
        <span v-else-if="col.formatter">{{ col.formatter(scope.row) }}</span>
        <!-- 3. 都没配：按 prop 取值（支持 'a.b' 嵌套路径） -->
        <span v-else>{{ getCellValue(scope.row, col.prop) }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import type { TableColumn } from './types'

/**
 * 配置式表格组件
 *
 * 用法：把原来一堆 <el-table-column> 换成一份 columns 配置数组，
 * 需要自定义列内容时，在列配置里写 slot 名，父组件用同名插槽渲染。
 *
 * 其他 el-table 的原生属性（border / stripe / height 等）会通过
 * 属性透传直接作用到内部的 el-table 上，无需额外声明。
 */
withDefaults(
  defineProps<{
    /** 列配置 */
    columns: TableColumn[]
    /** 表格数据 */
    data?: any[]
    /** 加载状态 */
    loading?: boolean
  }>(),
  {
    data: () => [],
    loading: false,
  },
)

/**
 * 按 prop 取值，支持 'user.name' 这种嵌套路径
 * 任何一层取不到就返回空字符串，避免渲染出 undefined
 */
const getCellValue = (row: any, prop?: string) => {
  if (!prop) return ''
  return prop.split('.').reduce((obj, key) => obj?.[key], row) ?? ''
}
</script>
