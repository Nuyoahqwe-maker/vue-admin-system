<template>
  <div class="home-page">
    <!-- 1. 顶部统计卡片 -->
    <el-row :gutter="20" class="stat-cards">
      <el-col :span="6" v-for="item in statList" :key="item.title">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" :style="{ backgroundColor: item.color }">
              <el-icon :size="24" color="#fff"><component :is="item.icon" /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-title">{{ item.title }}</div>
              <div class="stat-value">{{ item.value }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 2. ECharts 图表区 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="16">
        <el-card shadow="never" class="chart-card">
          <template #header>
            <span>近 7 天用户增长趋势</span>
          </template>
          <div ref="lineChartRef" style="height: 350px; width: 100%"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="never" class="chart-card">
          <template #header>
            <span>用户角色分布</span>
          </template>
          <div ref="pieChartRef" style="height: 350px; width: 100%"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, markRaw } from 'vue'
// ECharts 按需引入：只打包真正用到的图表类型和组件
// 全量引入 echarts 是 1MB，这样按需之后只有 200KB 左右
import * as echarts from 'echarts/core'
import { LineChart, PieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { User, UserFilled, DataLine, View } from '@element-plus/icons-vue'

// 注册用到的图表类型和组件（折线图、饼图 + 网格、提示框、图例 + Canvas 渲染器）
echarts.use([LineChart, PieChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer])

// --- 顶部统计卡片数据 ---
const statList = [
  { title: '总用户数', value: '1,286', icon: User, color: '#409EFF' },
  { title: '今日活跃', value: '328', icon: UserFilled, color: '#67C23A' },
  { title: '新增用户', value: '56', icon: DataLine, color: '#E6A23C' },
  { title: '总访问量', value: '8,942', icon: View, color: '#F56C6C' },
]

// --- 图表引用 ---
const lineChartRef = ref<HTMLElement>()
const pieChartRef = ref<HTMLElement>()
let lineChart: echarts.ECharts | null = null
let pieChart: echarts.ECharts | null = null

// --- 初始化折线图 ---
const initLineChart = () => {
  if (!lineChartRef.value) return
  lineChart = markRaw(echarts.init(lineChartRef.value))

  const option = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: '新增用户',
        type: 'line',
        smooth: true,
        areaStyle: { opacity: 0.3 },
        data: [120, 132, 101, 134, 90, 230, 210],
        itemStyle: { color: '#409EFF' },
      },
    ],
  }
  lineChart.setOption(option)
}

// --- 初始化饼图 ---
const initPieChart = () => {
  if (!pieChartRef.value) return
  pieChart = markRaw(echarts.init(pieChartRef.value))

  const option = {
    tooltip: { trigger: 'item' },
    legend: { bottom: '5%', left: 'center' },
    series: [
      {
        name: '角色分布',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
        label: { show: false, position: 'center' },
        emphasis: { label: { show: true, fontSize: 20, fontWeight: 'bold' } },
        labelLine: { show: false },
        data: [
          { value: 45, name: '管理员', itemStyle: { color: '#F56C6C' } },
          { value: 310, name: '普通用户', itemStyle: { color: '#67C23A' } },
        ],
      },
    ],
  }
  pieChart.setOption(option)
}

// --- 监听窗口大小变化，自适应图表 ---
const handleResize = () => {
  lineChart?.resize()
  pieChart?.resize()
}

onMounted(() => {
  initLineChart()
  initPieChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  lineChart?.dispose()
  pieChart?.dispose()
})
</script>

<style scoped lang="less">
.home-page {
  .stat-cards {
    margin-bottom: 20px;
  }

  .stat-card {
    .stat-content {
      display: flex;
      align-items: center;

      .stat-icon {
        width: 50px;
        height: 50px;
        border-radius: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 15px;
      }

      .stat-info {
        .stat-title {
          font-size: 14px;
          color: #909399;
          margin-bottom: 8px;
        }
        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #303133;
        }
      }
    }
  }

  .chart-card {
    margin-bottom: 20px;
  }
}
</style>
