'use client'

import ReactECharts from 'echarts-for-react'
import {useTheme} from 'next-themes'

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui'

interface GenderPieChartProps {
  female: number
  male: number
}

export function GenderPieChart({male, female}: GenderPieChartProps) {
  const {theme} = useTheme()
  const isDark = theme === 'dark'

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
      backgroundColor: isDark ? '#18181b' : '#ffffff',
      borderColor: isDark ? '#27272a' : '#e4e4e7',
      textStyle: {
        color: isDark ? '#fafafa' : '#18181b',
      },
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: {
        color: isDark ? '#a1a1aa' : '#71717a',
      },
    },
    series: [
      {
        name: 'Giới tính',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: isDark ? '#18181b' : '#ffffff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
            color: isDark ? '#fafafa' : '#18181b',
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          {
            value: male,
            name: 'Nam',
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {offset: 0, color: '#3b82f6'},
                  {offset: 1, color: '#2563eb'},
                ],
              },
            },
          },
          {
            value: female,
            name: 'Nữ',
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {offset: 0, color: '#f43f5e'},
                  {offset: 1, color: '#e11d48'},
                ],
              },
            },
          },
        ],
      },
    ],
  }

  return (
    <Card className="h-full">
      <CardHeader className="py-4">
        <CardTitle className="text-base font-semibold">Cơ cấu Giới tính</CardTitle>
        <CardDescription className="text-[11px]">Tỉ lệ nam/nữ trong hệ thống</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ReactECharts option={option} style={{height: '100%', width: '100%'}} theme={isDark ? 'dark' : undefined} />
        </div>
      </CardContent>
    </Card>
  )
}
