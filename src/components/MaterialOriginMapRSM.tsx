import React, { useState, useMemo } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Info, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import useAppStore from '../store/useAppStore'
import type { Material } from '../types/tcm-core'

const geoUrl = '/maps/china-provinces.json'

interface ProvinceData {
  province: string
  materials: Material[]
  totalProduction: number
  center: [number, number]
}

const MaterialOriginMapRSM: React.FC = () => {
  const { materials } = useAppStore()
  const [zoom, setZoom] = useState(1)
  const [center, setCenter] = useState<[number, number]>([104.1954, 35.8617])
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null)
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null)

  // Process materials by province
  const provinceData = useMemo(() => {
    const dataMap = new Map<string, ProvinceData>()

    materials.forEach((material) => {
      material.origin.forEach((origin) => {
        const existing = dataMap.get(origin.province)
        if (existing) {
          existing.materials.push(material)
          existing.totalProduction += origin.annualProduction || 0
        } else {
          dataMap.set(origin.province, {
            province: origin.province,
            materials: [material],
            totalProduction: origin.annualProduction || 0,
            center: origin.geoCoordinates
              ? [origin.geoCoordinates.lng, origin.geoCoordinates.lat]
              : [104.1954, 35.8617],
          })
        }
      })
    })

    return Array.from(dataMap.values())
  }, [materials])

  const handleZoomIn = () => setZoom(Math.min(zoom * 1.5, 8))
  const handleZoomOut = () => setZoom(Math.max(zoom / 1.5, 0.5))
  const handleReset = () => {
    setZoom(1)
    setCenter([104.1954, 35.8617])
  }

  const getProvinceColor = (provinceData: ProvinceData) => {
    const count = provinceData.materials.length
    if (count > 10) return '#059669' // emerald-600
    if (count > 5) return '#10b981' // emerald-500
    if (count > 2) return '#34d399' // emerald-400
    if (count > 0) return '#6ee7b7' // emerald-300
    return '#d1fae5' // emerald-100
  }

  return (
    <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6">
        <h2 className="text-2xl font-bold text-white mb-2">药材道地产区分布</h2>
        <p className="text-green-100">展示中药材在中国各省份的主要产地分布</p>
      </div>

      {/* Map Controls */}
      <div className="absolute top-24 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          title="放大"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          title="缩小"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={handleReset}
          className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          title="重置"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Map Container */}
      <div className="relative h-[600px]">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            center: [104.1954, 35.8617],
            scale: 680,
          }}
        >
          <ZoomableGroup zoom={zoom} center={center}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const provinceName = geo.properties.name
                  const data = provinceData.find((d) => d.province === provinceName)
                  const isHovered = hoveredProvince === provinceName
                  const isSelected = selectedProvince === provinceName

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => setHoveredProvince(provinceName)}
                      onMouseLeave={() => setHoveredProvince(null)}
                      onClick={() => setSelectedProvince(provinceName)}
                      style={{
                        default: {
                          fill: data ? getProvinceColor(data) : '#f3f4f6',
                          stroke: '#e5e7eb',
                          strokeWidth: 0.5,
                          outline: 'none',
                        },
                        hover: {
                          fill: data ? getProvinceColor(data) : '#e5e7eb',
                          stroke: '#9ca3af',
                          strokeWidth: 1,
                          outline: 'none',
                          cursor: 'pointer',
                        },
                        pressed: {
                          fill: data ? getProvinceColor(data) : '#d1d5db',
                          stroke: '#6b7280',
                          strokeWidth: 1,
                          outline: 'none',
                        },
                      }}
                    />
                  )
                })
              }
            </Geographies>

            {/* Province Markers */}
            {provinceData.map((data) => (
              <Marker key={data.province} coordinates={data.center}>
                <circle
                  r={Math.sqrt(data.totalProduction) / 20}
                  fill="#dc2626"
                  fillOpacity={0.6}
                  stroke="#fff"
                  strokeWidth={1}
                />
                {data.materials.length > 5 && (
                  <text
                    textAnchor="middle"
                    y={4}
                    style={{
                      fontSize: '10px',
                      fill: '#fff',
                      fontWeight: 'bold',
                    }}
                  >
                    {data.materials.length}
                  </text>
                )}
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {/* Province Info Panel */}
      <AnimatePresence>
        {selectedProvince && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="absolute left-4 top-24 w-80 bg-white rounded-lg shadow-xl p-4 max-h-[500px] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">{selectedProvince}</h3>
              <button
                onClick={() => setSelectedProvince(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {provinceData
              .filter((d) => d.province === selectedProvince)
              .map((data) => (
                <div key={data.province}>
                  <div className="mb-3 space-y-1">
                    <p className="text-sm text-gray-600">
                      药材种类: <span className="font-bold">{data.materials.length}</span> 种
                    </p>
                    <p className="text-sm text-gray-600">
                      年产量: <span className="font-bold">{data.totalProduction}</span> 吨
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">主要药材:</h4>
                    <div className="flex flex-wrap gap-1">
                      {data.materials.slice(0, 10).map((material) => (
                        <span
                          key={material.id}
                          className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
                        >
                          {material.names.cn}
                        </span>
                      ))}
                      {data.materials.length > 10 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          +{data.materials.length - 10} 更多
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-md p-3">
        <h4 className="text-sm font-medium mb-2">图例</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-600 rounded"></div>
            <span className="text-xs">10+ 种药材</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-500 rounded"></div>
            <span className="text-xs">5-10 种药材</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-400 rounded"></div>
            <span className="text-xs">2-5 种药材</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-300 rounded"></div>
            <span className="text-xs">1-2 种药材</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MaterialOriginMapRSM