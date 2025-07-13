import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, Beaker, Info, BarChart, Users } from 'lucide-react'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core'
import { RadarChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  RadarComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { Formula, HerbRole } from '../../types/tcm-core'
import { useNewAppStore } from '../../store'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'

// 注册ECharts组件
echarts.use([
  RadarChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  RadarComponent,
  CanvasRenderer,
])

interface FormulaDetailProps {
  formula: Formula
}

// 君臣佐使的颜色映射
const roleColors: Record<HerbRole, string> = {
  君: 'bg-red-100 text-red-800 border-red-300',
  臣: 'bg-blue-100 text-blue-800 border-blue-300',
  佐: 'bg-green-100 text-green-800 border-green-300',
  使: 'bg-yellow-100 text-yellow-800 border-yellow-300',
}

export const FormulaDetail: React.FC<FormulaDetailProps> = ({ formula }) => {
  const { setCurrentView, slices, materials } = useNewAppStore()

  // 获取方剂的完整组成信息
  const componentsWithDetails = useMemo(() => {
    return formula.components.map((comp) => {
      const slice = slices.find((s) => s.id === comp.sliceId)
      const material = slice ? materials.find((m) => m.id === slice.materialId) : null
      return {
        ...comp,
        slice,
        material,
      }
    })
  }, [formula.components, slices, materials])

  // 计算指纹图数据
  const fingerprintData = useMemo(() => {
    // 统计各类药材的功效分布
    const functionCategories = [
      '解表',
      '清热',
      '泻下',
      '祛风湿',
      '化湿',
      '温里',
      '理气',
      '消食',
      '止血',
      '活血化瘀',
      '化痰止咳',
      '安神',
      '平肝',
      '开窍',
      '补虚',
      '收涩',
    ]

    const functionCounts = functionCategories.map((category) => {
      let count = 0
      componentsWithDetails.forEach((comp) => {
        if (comp.material?.functions.some((func) => func.includes(category))) {
          count += 1
        }
      })
      return count
    })

    const maxCount = Math.max(...functionCounts, 1)

    return {
      tooltip: {
        trigger: 'axis',
      },
      radar: {
        indicator: functionCategories.map((name) => ({
          name,
          max: maxCount,
        })),
        shape: 'polygon',
        splitNumber: 4,
        axisName: {
          color: '#666',
          fontSize: 12,
        },
        splitLine: {
          lineStyle: {
            color: '#ddd',
          },
        },
        splitArea: {
          areaStyle: {
            color: ['#fff', '#f7f7f7'],
          },
        },
      },
      series: [
        {
          name: '功效分布',
          type: 'radar',
          data: [
            {
              value: functionCounts,
              name: formula.name,
              areaStyle: {
                color: 'rgba(34, 197, 94, 0.2)',
              },
              lineStyle: {
                color: 'rgb(34, 197, 94)',
                width: 2,
              },
              itemStyle: {
                color: 'rgb(34, 197, 94)',
              },
            },
          ],
        },
      ],
    }
  }, [componentsWithDetails, formula.name])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 返回按钮 */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-6 left-6 z-20 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
        onClick={() => setCurrentView('gallery')}
      >
        <ArrowLeft className="w-6 h-6 text-gray-700" />
      </motion.button>

      {/* 主内容区 */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 头部信息 */}
          <Card className="mb-8">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <BookOpen className="w-8 h-8 text-green-600" />
                <div>
                  <h1 className="text-4xl font-bold text-gray-800">{formula.name}</h1>
                  <p className="text-xl text-gray-600">{formula.pinyin}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div>
                  <span className="font-medium text-gray-700">出处：</span>
                  <span className="ml-2 text-gray-600">{formula.source}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">类别：</span>
                  <Badge className="ml-2" variant="default">
                    {formula.category}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium text-gray-700">别名：</span>
                  <span className="ml-2 text-gray-600">无</span>
                </div>
              </div>
            </div>
          </Card>

          {/* 详细信息标签页 */}
          <Tabs defaultValue="composition" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="composition">方剂组成</TabsTrigger>
              <TabsTrigger value="functions">功效主治</TabsTrigger>
              <TabsTrigger value="fingerprint">功效指纹图</TabsTrigger>
              <TabsTrigger value="usage">用法用量</TabsTrigger>
              <TabsTrigger value="analysis">方解</TabsTrigger>
            </TabsList>

            {/* 方剂组成表 */}
            <TabsContent value="composition" className="mt-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <Beaker className="w-5 h-5 mr-2" />
                  方剂组成
                </h3>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">角色</TableHead>
                        <TableHead>药材名称</TableHead>
                        <TableHead>饮片规格</TableHead>
                        <TableHead className="text-right">剂量</TableHead>
                        <TableHead>炮制方法</TableHead>
                        <TableHead>功效</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {componentsWithDetails.map((comp, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Badge className={`${roleColors[comp.role]} border`} variant="outline">
                              {comp.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {comp.material?.names.cn || '-'}
                            <span className="text-sm text-gray-500 block">
                              {comp.material?.names.pinyin}
                            </span>
                          </TableCell>
                          <TableCell>
                            {comp.slice?.name || comp.material?.names.cn || '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            {comp.weight.value}
                            {comp.weight.unit}
                          </TableCell>
                          <TableCell>{comp.slice?.processing.method || '-'}</TableCell>
                          <TableCell className="max-w-xs">
                            <div className="text-sm text-gray-600 truncate">
                              {comp.material?.functions.slice(0, 2).join('、')}
                              {comp.material && comp.material.functions.length > 2 && '...'}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* 君臣佐使说明 */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Badge className={`${roleColors['君']} border`} variant="outline">
                      君
                    </Badge>
                    <span className="text-sm text-gray-600">针对主病主证起主要治疗作用</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${roleColors['臣']} border`} variant="outline">
                      臣
                    </Badge>
                    <span className="text-sm text-gray-600">辅助君药加强治疗主病主证</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${roleColors['佐']} border`} variant="outline">
                      佐
                    </Badge>
                    <span className="text-sm text-gray-600">治疗兼证或制约君臣药毒性</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${roleColors['使']} border`} variant="outline">
                      使
                    </Badge>
                    <span className="text-sm text-gray-600">引药归经或调和诸药</span>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* 功效主治 */}
            <TabsContent value="functions" className="mt-6">
              <Card className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">功效</h3>
                    <ul className="space-y-2">
                      {formula.functions.map((func, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          <span className="text-gray-700">{func}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">主治</h3>
                    <ul className="space-y-2">
                      {formula.indications.map((indication, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          <span className="text-gray-700">{indication}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {formula.syndromes && formula.syndromes.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4">证候</h3>
                      <div className="flex flex-wrap gap-2">
                        {formula.syndromes.map((syndrome, index) => (
                          <Badge key={index} variant="secondary">
                            {syndrome}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {formula.modernApplications?.contraindications &&
                    formula.modernApplications.contraindications.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold mb-4 text-red-600">禁忌症</h3>
                        <ul className="space-y-2">
                          {formula.modernApplications.contraindications.map((contra, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-red-500 mr-2">•</span>
                              <span className="text-gray-700">{contra}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
              </Card>
            </TabsContent>

            {/* 功效指纹图 */}
            <TabsContent value="fingerprint" className="mt-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <BarChart className="w-5 h-5 mr-2" />
                  功效指纹图谱
                </h3>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600">
                    <Info className="w-4 h-4 inline mr-1" />
                    该图谱展示了方剂中各类功效药材的分布情况，帮助理解方剂的整体治疗特征
                  </p>
                </div>

                <div className="h-[500px]">
                  <ReactEChartsCore
                    echarts={echarts}
                    option={fingerprintData}
                    style={{ height: '100%', width: '100%' }}
                    opts={{ renderer: 'canvas' }}
                  />
                </div>
              </Card>
            </TabsContent>

            {/* 用法用量 */}
            <TabsContent value="usage" className="mt-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-6">用法用量</h3>

                <div className="grid gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">制备方法</h4>
                    <p className="text-gray-600 bg-gray-50 rounded-lg p-4">
                      {formula.usage.preparationMethod}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">剂型</h4>
                      <Badge variant="outline" className="text-base">
                        {formula.usage.dosageForm}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">服用方法</h4>
                      <p className="text-gray-600">{formula.usage.administration}</p>
                    </div>
                  </div>

                  {formula.usage.course && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">疗程</h4>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-gray-700">{formula.usage.course}</p>
                      </div>
                    </div>
                  )}

                  {formula.modernApplications?.diseases &&
                    formula.modernApplications.diseases.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">现代应用</h4>
                        <ul className="space-y-2">
                          {formula.modernApplications.diseases.map((disease, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-purple-500 mr-2">•</span>
                              <span className="text-gray-700">{disease}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
              </Card>
            </TabsContent>

            {/* 方解 */}
            <TabsContent value="analysis" className="mt-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  方剂解析
                </h3>

                {formula.explanation ? (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">组方原理</h4>
                      <p className="text-gray-600 leading-relaxed">
                        {formula.explanation.principle}
                      </p>
                    </div>

                    {formula.explanation.keyPoints && formula.explanation.keyPoints.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-3">要点</h4>
                        <ul className="space-y-2">
                          {formula.explanation.keyPoints.map((point, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-indigo-500 mr-2">•</span>
                              <span className="text-gray-700">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {formula.explanation.modifications &&
                      formula.explanation.modifications.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-3">加减变化</h4>
                          <div className="space-y-3">
                            {formula.explanation.modifications.map((mod, index) => (
                              <div key={index} className="border-l-2 border-gray-300 pl-4">
                                <p className="font-medium text-gray-700">{mod.condition}</p>
                                {mod.additions && mod.additions.length > 0 && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    加：
                                    {mod.additions
                                      .map((add) => `${add.sliceId} ${add.weight}g`)
                                      .join('、')}
                                  </p>
                                )}
                                {mod.removals && mod.removals.length > 0 && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    减：{mod.removals.map((rem) => rem.sliceId).join('、')}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">暂无方解信息</p>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
