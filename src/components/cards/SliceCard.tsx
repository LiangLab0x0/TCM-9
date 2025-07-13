import React from 'react'
import { motion } from 'framer-motion'
import { Flame, Clock, Droplets, Package } from 'lucide-react'
import type { Slice } from '../../types/tcm-core'
import { useNewAppStore } from '../../store'

interface SliceCardProps {
  slice: Slice
}

export const SliceCard: React.FC<SliceCardProps> = ({ slice }) => {
  const { getMaterialById, setSelectedSlice, setCurrentView } = useNewAppStore()
  const material = getMaterialById(slice.materialId)

  const handleClick = () => {
    setSelectedSlice(slice)
    setCurrentView('detail')
  }

  const getProcessingIcon = () => {
    switch (slice.processing.category) {
      case '炮炙':
        return <Flame className="w-4 h-4" />
      case '净制':
        return <Droplets className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getProcessingColor = () => {
    switch (slice.processing.category) {
      case '炮炙':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case '净制':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case '切制':
        return 'bg-green-100 text-green-700 border-green-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <motion.div
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
      whileHover={{ y: -5 }}
      onClick={handleClick}
    >
      {/* 图片区域 */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
        {slice.thumbnail ? (
          <img
            src={slice.thumbnail}
            alt={slice.name || '饮片'}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-amber-300" />
          </div>
        )}

        {/* 加工方法标签 */}
        <div
          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${getProcessingColor()}`}
        >
          {getProcessingIcon()}
          <span className="ml-1">{slice.processing.method}</span>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-4">
        {/* 原药材信息 */}
        {material && (
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800">{material.names.cn}</h3>
            <p className="text-sm text-gray-500">{material.names.pinyin}</p>
          </div>
        )}

        {/* 炮制参数 */}
        <div className="space-y-2 mb-4">
          {slice.processing.temperature && (
            <div className="flex items-center text-sm text-gray-600">
              <Flame className="w-3 h-3 mr-2 text-orange-500" />
              <span>
                温度: {slice.processing.temperature.value}
                {slice.processing.temperature.unit}
              </span>
            </div>
          )}

          {slice.processing.duration && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-3 h-3 mr-2 text-blue-500" />
              <span>
                时长: {slice.processing.duration.value}
                {slice.processing.duration.unit}
              </span>
            </div>
          )}

          {slice.processing.moistureContent !== undefined && (
            <div className="flex items-center text-sm text-gray-600">
              <Droplets className="w-3 h-3 mr-2 text-cyan-500" />
              <span>含水量: {slice.processing.moistureContent}%</span>
            </div>
          )}
        </div>

        {/* 炮制说明 */}
        {slice.processing.note && (
          <p className="text-sm text-gray-600 italic line-clamp-2">{slice.processing.note}</p>
        )}

        {/* 质控指标 */}
        {slice.qc.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">质控项目: {slice.qc.length}项</span>
              <span
                className={`font-medium ${
                  slice.qc.every((q) => q.qualified) ? 'text-green-600' : 'text-orange-600'
                }`}
              >
                {slice.qc.every((q) => q.qualified) ? '全部合格' : '待检'}
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
