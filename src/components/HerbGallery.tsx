import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Grid, List, Shuffle, SortAsc, SortDesc, Heart, Filter } from 'lucide-react'
import { useAppStore } from '../store'
import HerbCard from './HerbCard'
import SearchAndFilters from './SearchAndFilters'

type SortOption = 'name' | 'category' | 'nature'
type SortOrder = 'asc' | 'desc'
type ViewMode = 'grid' | 'list'

const HerbGallery: React.FC = () => {
  const { filteredHerbs, isLoading, error } = useAppStore()
  const [sortBy, setSortBy] = useState<SortOption>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  // 排序和过滤逻辑
  const getSortedAndFilteredHerbs = () => {
    const herbs = [...filteredHerbs]

    // 排序
    herbs.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name, 'zh-CN')
          break
        case 'category':
          comparison = a.category.localeCompare(b.category, 'zh-CN')
          break
        case 'nature':
          comparison = a.nature.localeCompare(b.nature, 'zh-CN')
          break
        default:
          comparison = 0
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

    return herbs
  }

  const sortedHerbs = getSortedAndFilteredHerbs()

  const handleSortChange = (newSortBy: SortOption) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(newSortBy)
      setSortOrder('asc')
    }
  }

  const shuffleHerbs = () => {
    // 随机排序的视觉效果
    setSortBy('name')
    setSortOrder(Math.random() > 0.5 ? 'asc' : 'desc')
    setTimeout(() => {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    }, 100)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
        <span className="ml-4 text-xl font-medium text-gray-700">正在加载药材图鉴...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😵</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">加载失败</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            重新加载
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">中药材图鉴</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            专业的中药材数据库，涵盖药材基本信息、产地分布、功效主治等详细资料
          </p>
        </div>

        {/* 搜索和过滤 */}
        <SearchAndFilters />

        {/* 工具栏 */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* 左侧：显示模式和筛选 */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title="网格视图"
                >
                  <Grid className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title="列表视图"
                >
                  <List className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* 右侧：排序选项 */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">排序：</span>

              {[
                { key: 'name' as const, label: '名称' },
                { key: 'category' as const, label: '类别' },
                { key: 'nature' as const, label: '药性' },
              ].map((option) => (
                <motion.button
                  key={option.key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSortChange(option.key)}
                  className={`
                    flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium transition-colors
                    ${
                      sortBy === option.key
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  <span>{option.label}</span>
                  {sortBy === option.key &&
                    (sortOrder === 'asc' ? (
                      <SortAsc className="w-4 h-4" />
                    ) : (
                      <SortDesc className="w-4 h-4" />
                    ))}
                </motion.button>
              ))}

              <motion.button
                whileHover={{ scale: 1.05, rotate: 180 }}
                whileTap={{ scale: 0.95 }}
                onClick={shuffleHerbs}
                className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                title="随机排序"
              >
                <Shuffle className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* 结果统计 */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              显示 <span className="font-bold text-blue-600">{sortedHerbs.length}</span> 种药材
            </p>
          </div>
        </div>

        {/* 药材网格/列表 */}
        <AnimatePresence mode="wait">
          {sortedHerbs.length > 0 ? (
            <motion.div
              key={`${viewMode}-${sortBy}-${sortOrder}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4'
              }
            >
              {sortedHerbs.map((herb, index) => (
                <motion.div
                  key={herb.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <HerbCard herb={herb} isCompact={viewMode === 'list'} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">没有找到匹配的药材</h3>
              <p className="text-gray-600 mb-4">试试调整搜索条件或筛选器</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default HerbGallery
