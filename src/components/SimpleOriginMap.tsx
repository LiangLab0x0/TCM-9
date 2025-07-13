import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Filter, X, TrendingUp } from 'lucide-react'
import { useAppStore } from '../store'

const SimpleOriginMap: React.FC = () => {
  const { herbs, updateSearchFilters, setCurrentView } = useAppStore()
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null)

  // 处理省份数据
  const provinceData = useMemo(() => {
    const provinceMap = new Map<string, { count: number; herbs: string[] }>()

    herbs.forEach((herb) => {
      if (herb.origin) {
        herb.origin.forEach((province) => {
          if (!provinceMap.has(province)) {
            provinceMap.set(province, { count: 0, herbs: [] })
          }
          const data = provinceMap.get(province)!
          data.count += 1
          data.herbs.push(herb.name)
        })
      }
    })

    return Array.from(provinceMap.entries())
      .map(([province, data]) => ({ province, ...data }))
      .sort((a, b) => b.count - a.count)
  }, [herbs])

  // 获取颜色强度
  const getColorIntensity = (count: number, maxCount: number): string => {
    const ratio = count / maxCount
    if (ratio > 0.8) return 'bg-blue-600'
    if (ratio > 0.6) return 'bg-blue-500'
    if (ratio > 0.4) return 'bg-blue-400'
    if (ratio > 0.2) return 'bg-blue-300'
    return 'bg-blue-200'
  }

  const maxCount = Math.max(...provinceData.map((p) => p.count))

  const handleProvinceClick = (province: string) => {
    setSelectedProvince(province)
    updateSearchFilters({ origin: province })
    setCurrentView('gallery')
  }

  const clearSelection = () => {
    setSelectedProvince(null)
    updateSearchFilters({ origin: '' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">中药材产地分布</h1>
          <p className="text-gray-600">点击省份查看该地区的药材分布情况</p>
        </div>

        {/* 选择状态 */}
        {selectedProvince && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span className="text-blue-800 font-medium">已选择：{selectedProvince}</span>
              <span className="text-blue-600">
                ({provinceData.find((p) => p.province === selectedProvince)?.count || 0} 种药材)
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearSelection}
              className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <X className="w-4 h-4" />
              清除选择
            </motion.button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主要内容：产地分布图 */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-800">产地分布热力图</h2>
              </div>

              {/* 网格布局的产地分布 */}
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {provinceData.map((item, index) => (
                  <motion.div
                    key={item.province}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleProvinceClick(item.province)}
                    className={`
                      relative p-3 rounded-xl cursor-pointer transition-all duration-200
                      ${getColorIntensity(item.count, maxCount)} text-white text-center
                      hover:shadow-lg border-2 
                      ${
                        selectedProvince === item.province
                          ? 'border-yellow-400 ring-2 ring-yellow-200'
                          : 'border-transparent'
                      }
                    `}
                  >
                    <div className="font-medium text-sm mb-1">{item.province}</div>
                    <div className="text-xs opacity-90">{item.count} 种</div>

                    {/* 进度条 */}
                    <div className="mt-2 w-full bg-white bg-opacity-30 rounded-full h-1">
                      <div
                        className="bg-white h-1 rounded-full transition-all duration-300"
                        style={{ width: `${(item.count / maxCount) * 100}%` }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* 图例 */}
              <div className="mt-6 flex items-center justify-center gap-4">
                <span className="text-sm text-gray-600">药材种类：</span>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-200 rounded"></div>
                  <span className="text-xs text-gray-500">少</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-400 rounded"></div>
                  <span className="text-xs text-gray-500">中等</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-600 rounded"></div>
                  <span className="text-xs text-gray-500">多</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 侧边栏信息 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 产地排行榜 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-bold text-gray-800">产地排行榜</h2>
              </div>
              <div className="space-y-3">
                {provinceData.slice(0, 10).map((province, index) => (
                  <motion.div
                    key={province.province}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleProvinceClick(province.province)}
                    className={`
                      p-3 rounded-lg cursor-pointer transition-all duration-200
                      ${
                        selectedProvince === province.province
                          ? 'bg-blue-100 border-2 border-blue-300'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`
                          w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                          ${
                            index < 3
                              ? 'bg-yellow-400 text-yellow-900'
                              : 'bg-gray-300 text-gray-700'
                          }
                        `}
                        >
                          {index + 1}
                        </span>
                        <span className="font-medium text-gray-800">{province.province}</span>
                      </div>
                      <span className="text-sm font-bold text-blue-600">{province.count} 种</span>
                    </div>

                    {/* 进度条 */}
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(province.count / maxCount) * 100}%`,
                        }}
                      />
                    </div>

                    {/* 部分药材列表 */}
                    <div className="mt-2 text-xs text-gray-600">
                      {province.herbs.slice(0, 3).join('、')}
                      {province.herbs.length > 3 && ` 等${province.herbs.length}种`}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* 统计信息 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-lg font-bold text-gray-800 mb-4">统计信息</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-700 font-medium">总产地数</span>
                  <span className="text-blue-900 font-bold">{provinceData.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-green-700 font-medium">最大产量</span>
                  <span className="text-green-900 font-bold">{maxCount} 种</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-purple-700 font-medium">平均产量</span>
                  <span className="text-purple-900 font-bold">
                    {Math.round(
                      provinceData.reduce((sum, p) => sum + p.count, 0) / provinceData.length
                    )}{' '}
                    种
                  </span>
                </div>
              </div>
            </motion.div>

            {/* 使用说明 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-lg font-bold text-gray-800 mb-4">使用说明</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs">1</span>
                  </div>
                  <p>点击产地方块查看该地区的药材</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs">2</span>
                  </div>
                  <p>颜色越深表示该省份药材种类越多</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs">3</span>
                  </div>
                  <p>右侧排行榜显示产地详细统计</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default SimpleOriginMap
