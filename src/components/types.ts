import type { FormItemRule } from 'element-plus'

/** 下拉框 / 单选组的选项 */
export interface FieldOption {
  label: string
  value: string | number
}

/**
 * ConfigTable 的列配置
 * 一条配置 = 一个 el-table-column，不用再手写一堆 el-table-column 标签
 */
export interface TableColumn {
  /** 字段名，支持 'user.name' 这种嵌套路径 */
  prop?: string
  /** 列标题 */
  label: string
  width?: string | number
  minWidth?: string | number
  align?: 'left' | 'center' | 'right'
  fixed?: boolean | 'left' | 'right'
  /** 内容过长时显示 tooltip */
  showOverflowTooltip?: boolean
  /**
   * 指定插槽名。配了之后这一列交给父组件用同名插槽渲染，
   * 适合标签、操作按钮这类需要自定义的内容
   */
  slot?: string
  /** 简单的文本格式化函数，优先级低于 slot */
  formatter?: (row: any) => string
}

/**
 * ConfigForm 的字段配置
 * 一条配置 = 一个 el-form-item，校验规则也直接写在配置里
 */
export interface FieldConfig {
  /** 字段名，对应 model 里的 key */
  prop: string
  label: string
  /** 控件类型，默认普通输入框 */
  type?: 'input' | 'textarea' | 'select' | 'radio'
  placeholder?: string
  /** type 为 select / radio 时生效 */
  options?: FieldOption[]
  /** 校验规则，会按 prop 自动收集成 el-form 的 rules */
  rules?: FormItemRule[]
  /** textarea 行数 */
  rows?: number
  /** 栅格宽度（24 为一行），不填则占满整行 */
  span?: number
}
