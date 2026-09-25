<template>
  <el-form ref="formRef" :model="model" :rules="mergedRules" :label-width="labelWidth">
    <el-row :gutter="20">
      <el-col v-for="field in fields" :key="field.prop" :span="field.span || 24">
        <el-form-item :label="field.label" :prop="field.prop">
          <!-- 文本域 -->
          <el-input
            v-if="field.type === 'textarea'"
            v-model="model[field.prop]"
            type="textarea"
            :rows="field.rows || 3"
            :placeholder="field.placeholder || `请输入${field.label}`"
          />

          <!-- 下拉框 -->
          <el-select
            v-else-if="field.type === 'select'"
            v-model="model[field.prop]"
            :placeholder="field.placeholder || `请选择${field.label}`"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="opt in field.options || []"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>

          <!-- 单选组 -->
          <el-radio-group v-else-if="field.type === 'radio'" v-model="model[field.prop]">
            <el-radio v-for="opt in field.options || []" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </el-radio>
          </el-radio-group>

          <!-- 默认：普通输入框 -->
          <el-input
            v-else
            v-model="model[field.prop]"
            :placeholder="field.placeholder || `请输入${field.label}`"
            clearable
          />
        </el-form-item>
      </el-col>

      <!-- 需要额外放按钮之类的，用默认插槽 -->
      <slot />
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { FieldConfig } from './types'

/**
 * 配置式表单组件
 *
 * 用法：把原来一堆 <el-form-item> 换成一份 fields 配置数组，
 * 校验规则写在字段配置的 rules 里，组件会自动汇总成 el-form 的 rules。
 *
 * 通过 ref 调用校验 / 重置：
 *   const formRef = ref<InstanceType<typeof ConfigForm>>()
 *   await formRef.value?.validate()
 *   formRef.value?.resetFields()
 */
const props = withDefaults(
  defineProps<{
    /** 表单数据对象，组件内部直接修改它（保持引用不变） */
    model: Record<string, any>
    /** 字段配置 */
    fields: FieldConfig[]
    labelWidth?: string
  }>(),
  {
    labelWidth: '90px',
  },
)

const formRef = ref<FormInstance>()

/**
 * 把 fields 里的 rules 收集成 el-form 需要的 FormRules 结构
 * 好处：校验规则跟着字段配置走，改字段时不用再去另一个地方同步改规则
 */
const mergedRules = computed<FormRules>(() => {
  const rules: FormRules = {}
  props.fields.forEach((field) => {
    if (field.rules?.length) {
      rules[field.prop] = field.rules
    }
  })
  return rules
})

// 暴露给父组件，调用方式和原生 el-form 一致
defineExpose({
  // 表单还没挂载时兜底返回 false，保证调用方拿到的永远是 Promise
  validate: () => formRef.value?.validate() ?? Promise.resolve(false),
  resetFields: () => formRef.value?.resetFields(),
  clearValidate: () => formRef.value?.clearValidate(),
})
</script>
