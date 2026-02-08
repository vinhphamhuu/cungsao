'use client'

import ReactECharts from 'echarts-for-react'
import {useTheme} from 'next-themes'

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui'

interface SaoChartProps {
  color: string
  data: {name: string; value: number}[]
  title: string
}

export function SaoChart({data, title, color}: SaoChartProps) {
  const {theme} = useTheme()
  const isDark = theme === 'dark'

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: data.map((d) => d.name),
      axisTick: {
        alignWithLabel: true,
      },
      axisLabel: {
        rotate: 45,
        color: isDark ? '#a1a1aa' : '#52525b', // zinc-400 : zinc-600
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: isDark ? '#a1a1aa' : '#52525b',
      },
    },
    series: [
      {
        name: 'Số lượng',
        type: 'bar',
        barWidth: '60%',
        data: data.map((d) => d.value),
        itemStyle: {
          color: color,
          borderRadius: [4, 4, 0, 0],
        },
      },
    ],
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Thống kê số lượng theo các sao</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[350px] w-full">
          <ReactECharts option={option} style={{height: '100%', width: '100%'}} theme={isDark ? 'dark' : undefined} />
        </div>
      </CardContent>
    </Card>
  )
}
