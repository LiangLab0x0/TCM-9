import React from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Star,
  Heart,
  Plus,
  Minus,
  MapPin,
  Zap,
  Pill,
  AlertTriangle,
  BookOpen,
  Users,
} from 'lucide-react'
import type { Herb } from '../types'
import { getNatureTheme, getProfessionalLevel } from '../types'
import { useAppStore } from '../store'

interface HerbDetailProps {
  herb: Herb
}

const HerbDetail: React.FC<HerbDetailProps> = ({ herb }) => {
  const { compareList, herbs, addToCompare, removeFromCompare, setCurrentView } = useAppStore()

  const theme = getNatureTheme(herb.nature)
  const professional = getProfessionalLevel(herb)
  const isInCompare = compareList.some((h) => h.id === herb.id)

  // 相关药材推荐（相同类别或性味）
  const relatedHerbs = herbs
    .filter((h) => h.id !== herb.id && (h.category === herb.category || h.nature === herb.nature))
    .slice(0, 4)

  const handleBack = () => {
    setCurrentView('gallery')
  }

  const handleToggleCompare = () => {
    if (isInCompare) {
      removeFromCompare(herb.id)
    } else {
      addToCompare(herb)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* 返回按钮 */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleBack}
          className="flex items-center gap-2 mb-6 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回图鉴</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：药材图片和基本信息 */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              {/* 药材图片 */}
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${theme.primary} opacity-20`} />
                <img
                  src={`/images/herbs/${herb.primaryImage}`}
                  alt={herb.name}
                  className="w-full h-80 object-cover object-center"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/images/placeholder-herb.jpg'
                  }}
                />

                {/* 专业等级角标 */}
                <div
                  className={`absolute top-4 left-4 px-3 py-2 rounded-lg text-sm font-bold ${professional.color} bg-white bg-opacity-95 shadow-sm`}
                >
                  <span>{professional.level}</span>
                </div>

                {/* 收藏状态 */}
              </div>

              {/* 基本信息 */}
              <div className="p-6">
                <div className="text-center mb-4">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{herb.name}</h1>
                  <p className="text-lg text-gray-600">{herb.pinyin}</p>
                  {herb.englishName && (
                    <p className="text-sm text-gray-500 italic">{herb.englishName}</p>
                  )}
                </div>

                {/* 属性标签 */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className={`p-3 rounded-lg ${theme.secondary}`}>
                    <p className="text-xs text-gray-500 mb-1">药性</p>
                    <p className={`font-bold ${theme.accent}`}>{herb.nature}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${theme.secondary}`}>
                    <p className="text-xs text-gray-500 mb-1">类别</p>
                    <p className={`font-bold ${theme.accent}`}>{herb.category}</p>
                  </div>
                </div>

                {/* 药味 */}
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-2">药味</p>
                  <div className="flex flex-wrap gap-2">
                    {herb.taste.map((taste, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${theme.secondary} ${theme.accent}`}
                      >
                        {taste}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 专业等级描述 */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 font-medium mb-1">专业等级</p>
                  <p className={`font-bold ${professional.color}`}>{professional.level}</p>
                  <p className="text-xs text-gray-500 mt-1">{professional.description}</p>
                </div>

                {/* 操作按钮 */}
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <button
                      onClick={handleToggleCompare}
                      className={`
                        flex-1 py-2 px-4 rounded-lg font-medium transition-colors
                        ${
                          isInCompare
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : 'bg-gray-100 text-gray-700 border border-gray-200'
                        }
                      `}
                    >
                      {isInCompare ? (
                        <Minus className="w-4 h-4 inline mr-1" />
                      ) : (
                        <Plus className="w-4 h-4 inline mr-1" />
                      )}
                      {isInCompare ? '移出对比' : '加入对比'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 右侧：详细信息 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 主要功效 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-800">主要功效</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {herb.functions.map((func, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-blue-900 font-medium">{func}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* 主治病症 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Pill className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold text-gray-800">主治病症</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {herb.indications.map((indication, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.03 }}
                    className="px-3 py-2 bg-green-50 text-green-800 rounded-lg text-sm text-center"
                  >
                    {indication}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* 产地信息 */}
            {herb.origin && herb.origin.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-6 h-6 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-800">主要产地</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {herb.origin.map((place, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-purple-50 text-purple-800 rounded-lg font-medium"
                    >
                      {place}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 归经信息 */}
            {herb.meridians && herb.meridians.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-6 h-6 text-orange-600" />
                  <h2 className="text-xl font-bold text-gray-800">归经</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {herb.meridians.map((meridian, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-orange-50 text-orange-800 rounded-lg font-medium"
                    >
                      {meridian}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 注意事项 */}
            {herb.contraindications && herb.contraindications.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <h2 className="text-xl font-bold text-gray-800">注意事项</h2>
                </div>
                <div className="space-y-2">
                  {herb.contraindications.map((item, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-red-900 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* 相关药材推荐 */}
        {relatedHerbs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">相关药材</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedHerbs.map((relatedHerb, index) => (
                <motion.div
                  key={relatedHerb.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => {
                    // 这里可以切换到相关药材的详情页
                    console.log('Navigate to', relatedHerb.name)
                  }}
                >
                  <img
                    src={`/images/herbs/${relatedHerb.primaryImage}`}
                    alt={relatedHerb.name}
                    className="w-full h-24 object-cover rounded-lg mb-2"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/images/placeholder-herb.jpg'
                    }}
                  />
                  <h3 className="font-bold text-gray-800 text-sm">{relatedHerb.name}</h3>
                  <p className="text-xs text-gray-600">{relatedHerb.category}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default HerbDetail
