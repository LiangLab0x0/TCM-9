import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Info, Package } from 'lucide-react'
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps'
import { useNewAppStore } from '../store'
import type { Material, AuthenticRegion } from '../types/tcm-core'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'

// 中国地图 GeoJSON URL
const geoUrl =
  'https://raw.githubusercontent.com/GoryMoon/StreamEnhancements/master/maps/china.json'

// 质量等级颜色映射
const qualityColors = {
  excellent: '#10b981', // green-500
  good: '#3b82f6', // blue-500
  moderate: '#f59e0b', // amber-500
}

interface RegionInfo {
  region: AuthenticRegion
  materials: Material[]
}

export const MaterialOriginMap: React.FC = () => {
  const { materials, setCurrentView, setSelectedMaterial } = useNewAppStore()
  const [selectedRegion, setSelectedRegion] = useState<RegionInfo | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([104.1954, 35.8617]) // 中国中心点
  const [mapZoom, setMapZoom] = useState(1)

  // 聚合所有产地数据
  const regionData = useMemo(() => {
    const regionMap = new Map<string, RegionInfo>()

    materials.forEach((material) => {
      material.origin.forEach((origin) => {
        if (origin.geoCoordinates) {
          const key = `${origin.geoCoordinates.lat}-${origin.geoCoordinates.lng}`

          if (!regionMap.has(key)) {
            regionMap.set(key, {
              region: origin,
              materials: [],
            })
          }

          regionMap.get(key)!.materials.push(material)
        }
      })
    })

    return Array.from(regionMap.values())
  }, [materials])

  // 计算产地统计信息
  const stats = useMemo(() => {
    const provinceCount = new Set(regionData.map((r) => r.region.province)).size
    const totalProduction = regionData.reduce((sum, r) => sum + (r.region.annualProduction || 0), 0)
    const excellentCount = regionData.filter((r) => r.region.quality === 'excellent').length

    return { provinceCount, totalProduction, excellentCount }
  }, [regionData])

  const handleMarkerClick = (regionInfo: RegionInfo) => {
    setSelectedRegion(regionInfo)
    if (regionInfo.region.geoCoordinates) {
      setMapCenter([regionInfo.region.geoCoordinates.lng, regionInfo.region.geoCoordinates.lat])
      setMapZoom(2)
    }
  }

  const handleMaterialClick = (material: Material) => {
    setSelectedMaterial(material)
    setCurrentView('detail')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* 返回按钮 */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-6 left-6 z-20 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
        onClick={() => setCurrentView('gallery')}
      >
        <ArrowLeft className="w-6 h-6 text-gray-700" />
      </motion.button>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 标题和统计 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">中药材道地产区分布图</h1>
            <div className="flex justify-center gap-8 text-lg">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700">
                  <span className="font-semibold">{stats.provinceCount}</span> 个省份
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">
                  年产量{' '}
                  <span className="font-semibold">{stats.totalProduction.toLocaleString()}</span> 吨
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-green-500">
                  优质产区 {stats.excellentCount} 个
                </Badge>
              </div>
            </div>
          </div>

          {/* 地图区域 */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* 地图 */}
            <div className="lg:col-span-2">
              <Card className="p-4 h-[600px] relative overflow-hidden">
                <ComposableMap
                  projection="geoMercator"
                  projectionConfig={{
                    center: mapCenter,
                    scale: 800,
                  }}
                >
                  <ZoomableGroup zoom={mapZoom} center={mapCenter}>
                    <Geographies geography={geoUrl}>
                      {({ geographies }) =>
                        geographies.map((geo) => (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill="#e5e7eb"
                            stroke="#d1d5db"
                            strokeWidth={0.5}
                            style={{
                              default: { outline: 'none' },
                              hover: { fill: '#d1d5db', outline: 'none' },
                              pressed: { outline: 'none' },
                            }}
                          />
                        ))
                      }
                    </Geographies>

                    {/* 产地标记 */}
                    {regionData.map((regionInfo, index) => {
                      const { region } = regionInfo
                      if (!region.geoCoordinates) return null

                      return (
                        <Marker
                          key={index}
                          coordinates={[region.geoCoordinates.lng, region.geoCoordinates.lat]}
                          onClick={() => handleMarkerClick(regionInfo)}
                        >
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <g className="cursor-pointer">
                                  {/* 外圈 */}
                                  <circle
                                    r={12}
                                    fill={qualityColors[region.quality]}
                                    fillOpacity={0.2}
                                    stroke={qualityColors[region.quality]}
                                    strokeWidth={2}
                                    className="animate-pulse"
                                  />
                                  {/* 内圈 */}
                                  <circle r={6} fill={qualityColors[region.quality]} />
                                  {/* 药材数量 */}
                                  <text
                                    textAnchor="middle"
                                    y={-15}
                                    style={{
                                      fontSize: '12px',
                                      fill: '#374151',
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    {regionInfo.materials.length}
                                  </text>
                                </g>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="text-sm">
                                  <p className="font-semibold">{region.region}</p>
                                  <p>{region.province}</p>
                                  <p>药材种类: {regionInfo.materials.length}种</p>
                                  {region.annualProduction && (
                                    <p>年产量: {region.annualProduction}吨</p>
                                  )}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Marker>
                      )
                    })}
                  </ZoomableGroup>
                </ComposableMap>

                {/* 图例 */}
                <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-md">
                  <p className="text-sm font-semibold mb-2">质量等级</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-green-500" />
                      <span className="text-xs">优质</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-500" />
                      <span className="text-xs">良好</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-amber-500" />
                      <span className="text-xs">一般</span>
                    </div>
                  </div>
                </div>

                {/* 控制按钮 */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setMapZoom(Math.min(mapZoom * 1.5, 4))
                    }}
                  >
                    +
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setMapZoom(Math.max(mapZoom / 1.5, 0.5))
                    }}
                  >
                    -
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setMapCenter([104.1954, 35.8617])
                      setMapZoom(1)
                    }}
                  >
                    复位
                  </Button>
                </div>
              </Card>
            </div>

            {/* 侧边栏信息 */}
            <div className="space-y-4">
              {/* 选中产地信息 */}
              {selectedRegion ? (
                <Card className="p-4">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    {selectedRegion.region.region}
                  </h3>

                  <div className="space-y-3 mb-4">
                    <div>
                      <span className="text-sm text-gray-600">省份：</span>
                      <span className="ml-2 font-medium">{selectedRegion.region.province}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">质量等级：</span>
                      <Badge
                        className="ml-2"
                        style={{ backgroundColor: qualityColors[selectedRegion.region.quality] }}
                      >
                        {selectedRegion.region.quality === 'excellent'
                          ? '优质'
                          : selectedRegion.region.quality === 'good'
                            ? '良好'
                            : '一般'}
                      </Badge>
                    </div>
                    {selectedRegion.region.annualProduction && (
                      <div>
                        <span className="text-sm text-gray-600">年产量：</span>
                        <span className="ml-2 font-medium">
                          {selectedRegion.region.annualProduction.toLocaleString()} 吨
                        </span>
                      </div>
                    )}
                    {selectedRegion.region.bestHarvestMonths && (
                      <div>
                        <span className="text-sm text-gray-600">最佳采收月份：</span>
                        <span className="ml-2 font-medium">
                          {selectedRegion.region.bestHarvestMonths.join('、')} 月
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">
                      该产地药材（{selectedRegion.materials.length}种）
                    </h4>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {selectedRegion.materials.map((material) => (
                        <motion.div
                          key={material.id}
                          whileHover={{ x: 5 }}
                          className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleMaterialClick(material)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{material.names.cn}</p>
                              <p className="text-sm text-gray-600">{material.names.pinyin}</p>
                            </div>
                            <Badge variant="outline">{material.qi}</Badge>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="p-4">
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>点击地图上的标记</p>
                    <p className="text-sm">查看产地详细信息</p>
                  </div>
                </Card>
              )}

              {/* 使用说明 */}
              <Card className="p-4">
                <h4 className="font-medium mb-2 flex items-center">
                  <Info className="w-4 h-4 mr-2" />
                  使用说明
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 圆圈大小表示药材种类数量</li>
                  <li>• 颜色表示产地质量等级</li>
                  <li>• 点击标记查看详细信息</li>
                  <li>• 点击药材名称查看详情</li>
                  <li>• 使用右上角按钮缩放地图</li>
                </ul>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
