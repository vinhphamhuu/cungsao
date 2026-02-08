'use client'

import ReactECharts from 'echarts-for-react'
import {useTheme} from 'next-themes'

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui'

interface AgeGenderChartProps {
  data: {female: number; male: number; name: string}[]
  title: string
}

export function AgeGenderChart({data, title}: AgeGenderChartProps) {
  const {theme} = useTheme()
  const isDark = theme === 'dark'

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: isDark ? '#3f3f46' : '#71717a',
        },
      },
      backgroundColor: isDark ? '#18181b' : '#ffffff',
      borderColor: isDark ? '#27272a' : '#e4e4e7',
      textStyle: {
        color: isDark ? '#fafafa' : '#18181b',
      },
    },
    toolbox: {
      feature: {
        saveAsImage: {title: 'Lưu ảnh'},
      },
      right: 10,
      top: 0,
      iconStyle: {
        borderColor: isDark ? '#a1a1aa' : '#71717a',
      },
    },
    legend: {
      top: 10,
      right: '15%',
      data: ['Nam', 'Nữ'],
      textStyle: {
        color: isDark ? '#a1a1aa' : '#71717a',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '20%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: data.map((d) => d.name),
      axisLine: {
        lineStyle: {
          color: isDark ? '#3f3f46' : '#e4e4e7', // zinc-700 : zinc-200
        },
      },
      axisLabel: {
        color: isDark ? '#a1a1aa' : '#71717a', // zinc-400 : zinc-500
      },
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          color: isDark ? '#27272a' : '#f4f4f5', // zinc-800 : zinc-100
          type: 'dashed',
        },
      },
      axisLabel: {
        color: isDark ? '#a1a1aa' : '#71717a',
      },
    },
    series: [
      {
        name: 'Nam',
        type: 'bar',
        data: data.map((d) => d.male),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {offset: 0, color: '#3b82f6'}, // blue-500
              {offset: 1, color: '#60a5fa'}, // blue-400
            ],
          },
          borderRadius: [4, 4, 0, 0],
        },
      },
      {
        name: 'Nữ',
        type: 'bar',
        data: data.map((d) => d.female),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {offset: 0, color: '#f43f5e'}, // rose-500
              {offset: 1, color: '#fb7185'}, // rose-400
            ],
          },
          borderRadius: [4, 4, 0, 0],
        },
      },
    ],
  }

  return (
    <Card>
      <CardHeader className="py-4">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <CardDescription className="text-[11px]">Thống kê độ tuổi phân biệt theo giới tính</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[300px] w-full">
          <ReactECharts option={option} style={{height: '100%', width: '100%'}} theme={isDark ? 'dark' : undefined} />
        </div>
      </CardContent>
    </Card>
  )
}
