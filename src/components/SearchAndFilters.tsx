import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ChevronDown, MapPin } from 'lucide-react';
import { useAppStore } from '../store';

const SearchAndFilters: React.FC = () => {
  const { searchFilters, updateSearchFilters, herbs } = useAppStore();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // 从数据中提取唯一的过滤选项
  const categories = [...new Set(herbs.map(herb => herb.category))];
  const natures = [...new Set(herbs.map(herb => herb.nature))];
  const tastes = [...new Set(herbs.flatMap(herb => herb.taste))];
  const meridians = [...new Set(herbs.flatMap(herb => herb.meridians || []))];
  const origins = [...new Set(herbs.flatMap(herb => herb.origin || []))].sort();

  const clearFilters = () => {
    updateSearchFilters({
      searchTerm: '',
      category: '',
      nature: '',
      taste: '',
      meridian: '',
      origin: ''
    });
  };

  const hasActiveFilters = searchFilters.category || searchFilters.nature || 
                          searchFilters.taste || searchFilters.meridian || searchFilters.origin;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      {/* 搜索框 */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="搜索药材名称、功效、性味、产地..."
          value={searchFilters.searchTerm}
          onChange={(e) => updateSearchFilters({ searchTerm: e.target.value })}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
        {searchFilters.searchTerm && (
          <button
            onClick={() => updateSearchFilters({ searchTerm: '' })}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 过滤器切换按钮 */}
      <div className="flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg transition-all
            ${hasActiveFilters 
              ? 'bg-blue-100 text-blue-700 border-2 border-blue-200' 
              : 'bg-gray-100 text-gray-700 border-2 border-gray-200'
            }
          `}
        >
          <Filter className="w-4 h-4" />
          <span>专业筛选</span>
          {hasActiveFilters && (
            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
              {[searchFilters.category, searchFilters.nature, searchFilters.taste, 
                searchFilters.meridian, searchFilters.origin]
                .filter(Boolean).length}
            </span>
          )}
          <ChevronDown 
            className={`w-4 h-4 transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} 
          />
        </motion.button>

        {hasActiveFilters && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            清除筛选
          </motion.button>
        )}
      </div>

      {/* 过滤器面板 */}
      <AnimatePresence>
        {isFiltersOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 overflow-hidden"
          >
            {/* 药材类别 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">药材类别</label>
              <select
                value={searchFilters.category}
                onChange={(e) => updateSearchFilters({ category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="">全部类别</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* 药性 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">药性</label>
              <select
                value={searchFilters.nature}
                onChange={(e) => updateSearchFilters({ nature: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="">全部药性</option>
                {natures.map(nature => (
                  <option key={nature} value={nature}>{nature}</option>
                ))}
              </select>
            </div>

            {/* 药味 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">药味</label>
              <select
                value={searchFilters.taste}
                onChange={(e) => updateSearchFilters({ taste: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="">全部药味</option>
                {tastes.map(taste => (
                  <option key={taste} value={taste}>{taste}</option>
                ))}
              </select>
            </div>

            {/* 归经 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">归经</label>
              <select
                value={searchFilters.meridian}
                onChange={(e) => updateSearchFilters({ meridian: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="">全部归经</option>
                {meridians.map(meridian => (
                  <option key={meridian} value={meridian}>{meridian}</option>
                ))}
              </select>
            </div>

            {/* 产地 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                主要产地
              </label>
              <select
                value={searchFilters.origin}
                onChange={(e) => updateSearchFilters({ origin: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="">全部产地</option>
                {origins.map(origin => (
                  <option key={origin} value={origin}>{origin}</option>
                ))}
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 活跃筛选器显示 */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 pt-4 border-t border-gray-200"
        >
          <p className="text-sm text-gray-600 mb-2">当前筛选条件：</p>
          <div className="flex flex-wrap gap-2">
            {searchFilters.category && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                类别: {searchFilters.category}
                <button 
                  onClick={() => updateSearchFilters({ category: '' })}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchFilters.nature && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                药性: {searchFilters.nature}
                <button 
                  onClick={() => updateSearchFilters({ nature: '' })}
                  className="text-green-600 hover:text-green-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchFilters.taste && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                药味: {searchFilters.taste}
                <button 
                  onClick={() => updateSearchFilters({ taste: '' })}
                  className="text-purple-600 hover:text-purple-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchFilters.meridian && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                归经: {searchFilters.meridian}
                <button 
                  onClick={() => updateSearchFilters({ meridian: '' })}
                  className="text-orange-600 hover:text-orange-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchFilters.origin && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                <MapPin className="w-3 h-3" />
                产地: {searchFilters.origin}
                <button 
                  onClick={() => updateSearchFilters({ origin: '' })}
                  className="text-yellow-600 hover:text-yellow-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SearchAndFilters;
