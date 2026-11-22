<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
  options: echarts.EChartsOption
  height?: string
  width?: string
}>()

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null
let resizeObserver: ResizeObserver | null = null

const initChart = () => {
  if (!chartRef.value) return
  if (chartInstance) {
    chartInstance.dispose()
  }

  chartInstance = echarts.init(chartRef.value, undefined, {
    renderer: 'canvas'
  })

  chartInstance.setOption(props.options)
}

watch(
  () => props.options,
  (newOpts) => {
    if (chartInstance && newOpts) {
      chartInstance.setOption(newOpts, true)
    }
  },
  { deep: true }
)

onMounted(() => {
  initChart()

  if (chartRef.value && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      chartInstance?.resize()
    })
    resizeObserver.observe(chartRef.value)
  }
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  chartInstance?.dispose()
  chartInstance = null
})
</script>

<template>
  <div
    ref="chartRef"
    :style="{
      height: props.height || '320px',
      width: props.width || '100%'
    }"
    class="relative"
  />
</template>

