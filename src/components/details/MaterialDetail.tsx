import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Thermometer, Leaf, Clock, Package, AlertCircle } from 'lucide-react'
import type { Material } from '../../types/tcm-core'
import { getQiTheme } from '../../types/tcm-core'
import { useNewAppStore } from '../../store'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Timeline, TimelineItem } from '../ui/timeline'

interface MaterialDetailProps {
  material: Material
}

export const MaterialDetail: React.FC<MaterialDetailProps> = ({ material }) => {
  const { setCurrentView, slices } = useNewAppStore()
  const theme = getQiTheme(material.qi)

  // 获取该药材相关的饮片
  const relatedSlices = slices.filter((slice) => slice.materialId === material.id)

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
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 头部信息 */}
          <Card className="mb-8 overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8">
              {/* 图片区域 */}
              <div className="relative h-96 bg-gray-100">
                <img
                  src={`/images/${material.images.primary}`}
                  alt={material.names.cn}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/placeholder.jpg'
                  }}
                />
                <div
                  className={`absolute top-4 right-4 px-4 py-2 rounded-full ${theme.bg} ${theme.text} font-medium`}
                >
                  <Thermometer className="w-4 h-4 inline mr-2" />
                  {material.qi}
                </div>
              </div>

              {/* 基本信息 */}
              <div className="p-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">{material.names.cn}</h1>
                <p className="text-xl text-gray-600 mb-1">{material.names.pinyin}</p>
                {material.names.english && (
                  <p className="text-lg text-gray-500 mb-4">{material.names.english}</p>
                )}

                <div className="space-y-4 mt-6">
                  {/* 归经 */}
                  <div>
                    <span className="font-medium text-gray-700">归经：</span>
                    <div className="inline-flex flex-wrap gap-2 ml-2">
                      {material.meridians.map((meridian) => (
                        <Badge key={meridian} variant="secondary">
                          {meridian}经
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* 五味 */}
                  <div>
                    <span className="font-medium text-gray-700">五味：</span>
                    <div className="inline-flex flex-wrap gap-2 ml-2">
                      {material.flavor.map((f) => (
                        <Badge key={f} variant="outline">
                          {f}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* 用量 */}
                  <div>
                    <span className="font-medium text-gray-700">用量：</span>
                    <span className="ml-2 text-gray-600">
                      {material.dosage.min}-{material.dosage.max}g（常用{material.dosage.common}g）
                    </span>
                  </div>

                  {/* 类别 */}
                  <div>
                    <span className="font-medium text-gray-700">类别：</span>
                    <Badge className="ml-2" variant="default">
                      <Leaf className="w-3 h-3 mr-1" />
                      {material.category}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* 详细信息标签页 */}
          <Tabs defaultValue="functions" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="functions">功效主治</TabsTrigger>
              <TabsTrigger value="slices">饮片炮制</TabsTrigger>
              <TabsTrigger value="origin">道地产区</TabsTrigger>
              <TabsTrigger value="chemistry">化学成分</TabsTrigger>
              <TabsTrigger value="quality">质量标准</TabsTrigger>
            </TabsList>

            {/* 功效主治 */}
            <TabsContent value="functions" className="mt-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">功效</h3>
                <ul className="space-y-2 mb-6">
                  {material.functions.map((func, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span className="text-gray-700">{func}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="text-xl font-semibold mb-4">主治</h3>
                <ul className="space-y-2">
                  {material.indications.map((indication, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span className="text-gray-700">{indication}</span>
                    </li>
                  ))}
                </ul>

                {material.contraindications && material.contraindications.length > 0 && (
                  <>
                    <h3 className="text-xl font-semibold mb-4 mt-6 text-red-600">
                      <AlertCircle className="inline w-5 h-5 mr-2" />
                      禁忌
                    </h3>
                    <ul className="space-y-2">
                      {material.contraindications.map((contra, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-red-500 mr-2">•</span>
                          <span className="text-gray-700">{contra}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </Card>
            </TabsContent>

            {/* 饮片炮制时间线 */}
            <TabsContent value="slices" className="mt-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-6">
                  <Package className="inline w-5 h-5 mr-2" />
                  饮片炮制流程
                </h3>

                {relatedSlices.length > 0 ? (
                  <div className="space-y-6">
                    {relatedSlices.map((slice, index) => (
                      <motion.div
                        key={slice.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative pl-8 pb-8 border-l-2 border-gray-200 last:border-0"
                      >
                        {/* 时间线节点 */}
                        <div className="absolute left-0 top-0 w-4 h-4 bg-blue-500 rounded-full -translate-x-1/2 border-2 border-white" />

                        {/* 饮片信息卡片 */}
                        <Card className="p-4 shadow-sm hover:shadow-md transition-shadow">
                          <h4 className="font-semibold text-lg mb-2">{slice.processing.method}</h4>
                          <p className="text-gray-600 mb-3">饮片</p>

                          {/* 炮制方法 */}
                          <div className="mb-3">
                            <span className="font-medium text-gray-700">炮制方法：</span>
                            <span className="ml-2 text-gray-600">{slice.processing.method}</span>
                          </div>

                          {/* 炮制说明 */}
                          {slice.processing.note && (
                            <div className="mt-3">
                              <span className="font-medium text-gray-700">炮制说明：</span>
                              <p className="mt-1 text-sm text-gray-600">{slice.processing.note}</p>
                            </div>
                          )}

                          {/* 炮制时长 */}
                          {slice.processing.duration && (
                            <div className="mt-3 flex items-center text-sm text-gray-500">
                              <Clock className="w-4 h-4 mr-1" />
                              炮制时长：{slice.processing.duration.value}
                              {slice.processing.duration.unit}
                            </div>
                          )}

                          {/* 性味变化 */}
                          {slice.propertyChanges && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                              <span className="text-sm font-medium text-blue-700">性味变化：</span>
                              {slice.propertyChanges.enhanced && (
                                <p className="text-sm text-blue-600 mt-1">
                                  增强：{slice.propertyChanges.enhanced.join('、')}
                                </p>
                              )}
                              {slice.propertyChanges.reduced && (
                                <p className="text-sm text-blue-600">
                                  减弱：{slice.propertyChanges.reduced.join('、')}
                                </p>
                              )}
                            </div>
                          )}
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">暂无饮片炮制信息</p>
                )}
              </Card>
            </TabsContent>

            {/* 道地产区 */}
            <TabsContent value="origin" className="mt-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  <MapPin className="inline w-5 h-5 mr-2" />
                  道地产区
                </h3>
                <div className="grid gap-4">
                  {material.origin.map((region, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-lg">{region.region}</h4>
                          <p className="text-gray-600">{region.province}</p>
                        </div>
                        <Badge
                          variant={
                            region.quality === 'excellent'
                              ? 'default'
                              : region.quality === 'good'
                                ? 'secondary'
                                : 'outline'
                          }
                        >
                          {region.quality === 'excellent'
                            ? '优质'
                            : region.quality === 'good'
                              ? '良好'
                              : '一般'}
                        </Badge>
                      </div>
                      {region.annualProduction && (
                        <p className="text-sm text-gray-500">
                          年产量：{region.annualProduction} 吨
                        </p>
                      )}
                      {region.bestHarvestMonths && (
                        <p className="text-sm text-gray-500">
                          最佳采收月份：{region.bestHarvestMonths.join('、')} 月
                        </p>
                      )}
                      {region.notes && <p className="text-sm text-gray-600 mt-2">{region.notes}</p>}
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* 化学成分 */}
            <TabsContent value="chemistry" className="mt-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">化学成分</h3>
                {material.chemicalComponents && material.chemicalComponents.length > 0 ? (
                  <div className="space-y-3">
                    {material.chemicalComponents.map((comp, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{comp.name}</h4>
                            <p className="text-sm text-gray-600">{comp.category}</p>
                          </div>
                          <Badge variant={comp.importance === 'primary' ? 'default' : 'secondary'}>
                            {comp.importance === 'primary' ? '主要' : '次要'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          含量：{comp.content.min}% - {comp.content.max}%
                        </p>
                        {comp.bioactivity && (
                          <p className="text-sm text-gray-600 mt-1">生物活性：{comp.bioactivity}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">暂无化学成分数据</p>
                )}
              </Card>
            </TabsContent>

            {/* 质量标准 */}
            <TabsContent value="quality" className="mt-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">质量标准</h3>
                {material.qualityStandards && material.qualityStandards.length > 0 ? (
                  <div className="space-y-3">
                    {material.qualityStandards.map((standard, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h4 className="font-medium">{standard.parameter}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          标准值：{standard.specification}
                        </p>
                        <p className="text-sm text-gray-500">检测方法：{standard.method}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">暂无质量标准数据</p>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
