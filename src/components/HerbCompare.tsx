import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, X, Star, Zap, Pill, MapPin, Users } from 'lucide-react'
import { Herb, getNatureTheme, getProfessionalLevel } from '../types'
import { useAppStore } from '../store'

const HerbCompare: React.FC = () => {
  const { compareList, removeFromCompare, clearCompare, setCurrentView } = useAppStore()

  const handleBack = () => {
    setCurrentView('gallery')
  }

  const handleRemoveHerb = (herbId: string) => {
    removeFromCompare(herbId)
  }

  const handleClearAll = () => {
    clearCompare()
  }

  if (compareList.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">对比列表为空</h2>
          <p className="text-gray-600 mb-6">在药材卡片上点击"+"按钮来添加药材进行对比</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            返回图鉴
          </motion.button>
        </motion.div>
      </div>
    )
  }

  const getCommonProperties = () => {
    const properties = {
      categories: [...new Set(compareList.map((h) => h.category))],
      natures: [...new Set(compareList.map((h) => h.nature))],
      tastes: [...new Set(compareList.flatMap((h) => h.taste))],
      origins: [...new Set(compareList.flatMap((h) => h.origin || []))],
      meridians: [...new Set(compareList.flatMap((h) => h.meridians || []))],
      functions: [...new Set(compareList.flatMap((h) => h.functions))],
      indications: [...new Set(compareList.flatMap((h) => h.indications))],
    }

    return properties
  }

  const commonProps = getCommonProperties()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* 头部操作栏 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>返回图鉴</span>
            </motion.button>

            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-800">药材对比</h1>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {compareList.length} 种药材
              </span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClearAll}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            清空对比
          </motion.button>
        </div>

        {/* 对比卡片 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          <AnimatePresence>
            {compareList.map((herb, index) => {
              const theme = getNatureTheme(herb.nature)
              const professional = getProfessionalLevel(herb)

              return (
                <motion.div
                  key={herb.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden relative"
                >
                  {/* 移除按钮 */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRemoveHerb(herb.id)}
                    className="absolute top-3 right-3 z-10 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>

                  {/* 药材图片 */}
                  <div className="relative h-48">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${theme.primary} opacity-20`}
                    />
                    <img
                      src={`/images/herbs/${herb.primaryImage}`}
                      alt={herb.name}
                      className="w-full h-full object-cover object-center"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/images/placeholder-herb.jpg'
                      }}
                    />

                    {/* 专业等级角标 */}
                    <div
                      className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-bold ${professional.color} bg-white bg-opacity-95 shadow-sm`}
                    >
                      <span>{professional.level}</span>
                    </div>
                  </div>

                  {/* 基本信息 */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{herb.name}</h3>
                      <p className="text-sm text-gray-600">{herb.pinyin}</p>
                    </div>

                    {/* 属性标签 */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className={`p-2 rounded-lg ${theme.secondary}`}>
                        <p className="text-xs text-gray-500">药性</p>
                        <p className={`font-bold text-sm ${theme.accent}`}>{herb.nature}</p>
                      </div>
                      <div className={`p-2 rounded-lg ${theme.secondary}`}>
                        <p className="text-xs text-gray-500">类别</p>
                        <p className={`font-bold text-sm ${theme.accent}`}>{herb.category}</p>
                      </div>
                    </div>

                    {/* 药味 */}
                    <div>
                      <p className="text-xs text-gray-500 mb-1">药味</p>
                      <div className="flex flex-wrap gap-1">
                        {herb.taste.map((taste, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {taste}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 主要功效 */}
                    <div>
                      <p className="text-xs text-gray-500 mb-1">主要功效</p>
                      <div className="space-y-1">
                        {herb.functions.slice(0, 3).map((func, i) => (
                          <div key={i} className="text-xs text-gray-700 flex items-center gap-1">
                            <div className="w-1 h-1 bg-blue-500 rounded-full" />
                            {func}
                          </div>
                        ))}
                        {herb.functions.length > 3 && (
                          <p className="text-xs text-gray-500">
                            +{herb.functions.length - 3} 更多...
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* 对比分析 */}
        {compareList.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* 基本属性对比 */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">属性对比</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">药材类别</p>
                  <div className="space-y-1">
                    {commonProps.categories.map((category) => (
                      <span
                        key={category}
                        className="block px-2 py-1 bg-blue-50 text-blue-800 text-sm rounded"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">药性</p>
                  <div className="space-y-1">
                    {commonProps.natures.map((nature) => (
                      <span
                        key={nature}
                        className="block px-2 py-1 bg-green-50 text-green-800 text-sm rounded"
                      >
                        {nature}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">药味</p>
                  <div className="flex flex-wrap gap-1">
                    {commonProps.tastes.map((taste) => (
                      <span
                        key={taste}
                        className="px-2 py-1 bg-purple-50 text-purple-800 text-xs rounded"
                      >
                        {taste}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">专业等级</p>
                  <div className="space-y-1">
                    {compareList.map((herb) => {
                      const professional = getProfessionalLevel(herb)
                      return (
                        <div key={herb.id} className="flex items-center gap-2">
                          <span className="text-xs text-gray-600">{herb.name}:</span>
                          <span className={`text-xs font-bold ${professional.color}`}>
                            {professional.level}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* 功效对比 */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-800">功效对比</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {commonProps.functions.map((func) => (
                  <div key={func} className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-900 mb-1">{func}</p>
                    <div className="text-xs text-blue-700">
                      具有此功效：
                      {compareList
                        .filter((h) => h.functions.includes(func))
                        .map((h) => h.name)
                        .join('、')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 主治病症对比 */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Pill className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold text-gray-800">主治病症对比</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                {commonProps.indications.slice(0, 20).map((indication) => (
                  <div
                    key={indication}
                    className="p-2 bg-green-50 rounded text-green-800 text-sm text-center"
                  >
                    {indication}
                  </div>
                ))}
                {commonProps.indications.length > 20 && (
                  <div className="p-2 bg-gray-50 rounded text-gray-600 text-sm text-center">
                    +{commonProps.indications.length - 20} 更多...
                  </div>
                )}
              </div>
            </div>

            {/* 产地和归经对比 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 产地 */}
              {commonProps.origins.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-6 h-6 text-purple-600" />
                    <h2 className="text-xl font-bold text-gray-800">产地分布</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {commonProps.origins.map((origin) => (
                      <span
                        key={origin}
                        className="px-3 py-2 bg-purple-50 text-purple-800 rounded-lg font-medium"
                      >
                        {origin}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 归经 */}
              {commonProps.meridians.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-6 h-6 text-orange-600" />
                    <h2 className="text-xl font-bold text-gray-800">归经分布</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {commonProps.meridians.map((meridian) => (
                      <span
                        key={meridian}
                        className="px-3 py-2 bg-orange-50 text-orange-800 rounded-lg font-medium"
                      >
                        {meridian}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default HerbCompare
