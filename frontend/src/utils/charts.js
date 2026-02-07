import * as echarts from 'echarts'
import { formatCurrency } from './number'

// Register a unified theme for all charts
const theme = {
  color: ['#da7756', '#5a8a6e', '#c9a227', '#8e6b5a', '#6b9a8a', '#c45c5c', '#9a9590'],
  textStyle: {
    fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, "Noto Sans", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
    fontSize: 12,
    color: '#2d2a26',
  },
  // Unified layout to avoid overlapping titles/legends with plotting area
  grid: { top: 24, right: 24, bottom: 56, left: 48, containLabel: true },
  tooltip: {
    backgroundColor: 'rgba(45,42,38,0.9)',
    borderWidth: 0,
    textStyle: { color: '#fff', fontSize: 12 },
    extraCssText: 'box-shadow:0 4px 12px rgba(0,0,0,0.15); border-radius:8px; padding:10px 12px;',
  },
  legend: {
    bottom: 8,
    left: 'center',
    textStyle: { color: '#6b6560' },
  },
  categoryAxis: {
    axisLine: { lineStyle: { color: '#e5e0dc' } },
    axisTick: { alignWithLabel: true, lineStyle: { color: '#e5e0dc' } },
    axisLabel: { color: '#6b6560', rotate: 0, interval: 'auto', margin: 8, hideOverlap: true },
    splitLine: { show: false },
  },
  valueAxis: {
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#6b6560' },
    splitLine: { lineStyle: { color: '#e5e0dc', type: 'dashed' } },
  },
}

if (!echarts.themes || !echarts.themes.salarium) {
  echarts.registerTheme('salarium', theme)
}

export function initChart(el) {
  if (!el) return null
  return echarts.init(el, 'salarium')
}

export function baseGrid() {
  return { top: 24, right: 24, bottom: 56, left: 48, containLabel: true }
}

export function currencyFormatter(val) {
  return formatCurrency(val, { decimals: 2 })
}

export function axisCurrencyFormatter(value) {
  return formatCurrency(value, { decimals: 2 })
}

export function monthsToLabels(points) {
  return points.map(p => `${p.month}月`)
}

export function responsiveResize(instance) {
  if (!instance) return () => {}
  const handler = () => instance.resize()
  window.addEventListener('resize', handler)
  // Observe container size changes as well
  let ro
  try {
    const el = instance.getDom && instance.getDom()
    if (typeof ResizeObserver !== 'undefined' && el) {
      ro = new ResizeObserver(() => instance.resize())
      ro.observe(el)
    }
  } catch { /* no-op */ }
  return () => {
    window.removeEventListener('resize', handler)
    if (ro) ro.disconnect()
  }
}

export const palette = {
  primary: '#da7756',
  success: '#5a8a6e',
  warning: '#c9a227',
  danger: '#c45c5c',
  info: '#9a9590',
  blue: '#6b9a8a',
  green: '#5a8a6e',
  orange: '#da7756',
  purple: '#8e6b5a',
  teal: '#6b9a8a',
}

export function gradient(color1, color2) {
  return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    { offset: 0, color: color1 },
    { offset: 1, color: color2 },
  ])
}
