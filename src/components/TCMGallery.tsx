import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Grid, List, SortAsc, SortDesc, Filter } from 'lucide-react';
import { useNewAppStore } from '../store';
import { GalleryGrid } from './GalleryGrid';
import { MaterialCard } from './cards/MaterialCard';
import { SliceCard } from './cards/SliceCard';
import { FormulaCard } from './cards/FormulaCard';
import { EntityType } from '../store/slices/ui';
import SearchAndFilters from './SearchAndFilters';

type SortOption = 'name' | 'category' | 'created';
type SortOrder = 'asc' | 'desc';
type ViewMode = 'grid' | 'list';

/**
 * 新版画廊组件 - 支持多实体类型切换
 */
export const TCMGallery: React.FC = () => {
  const {
    currentEntityType,
    setCurrentEntityType,
    materials,
    filteredMaterials,
    slices,
    formulas,
    isLoading
  } = useNewAppStore();

  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // 实体类型选项
  const entityTypes: { value: EntityType; label: string; count: number }[] = [
    { value: 'material', label: '药材', count: materials.length },
    { value: 'slice', label: '饮片', count: slices.length },
    { value: 'formula', label: '方剂', count: formulas.length },
    { value: 'granule', label: '配方颗粒', count: 0 },
    { value: 'medicine', label: '中成药', count: 0 }
  ];

  // 获取当前显示的数据
  const getCurrentItems = () => {
    switch (currentEntityType) {
      case 'material':
        return sortItems(filteredMaterials);
      case 'slice':
        return sortItems(slices);
      case 'formula':
        return sortItems(formulas);
      default:
        return [];
    }
  };

  // 排序函数
  const sortItems = <T extends { id: string; createdAt?: string }>(items: T[]): T[] => {
    const sorted = [...items];
    
    sorted.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name': {
          // 根据不同类型获取名称
          const aName = getName(a);
          const bName = getName(b);
          comparison = aName.localeCompare(bName, 'zh-CN');
          break;
        }
        case 'category': {
          const aCat = getCategory(a);
          const bCat = getCategory(b);
          comparison = aCat.localeCompare(bCat, 'zh-CN');
          break;
        }
        case 'created':
          comparison = (a.createdAt || '').localeCompare(b.createdAt || '');
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
  };

  // 获取名称的辅助函数
  const getName = (item: any): string => {
    if ('names' in item) return item.names.cn;
    if ('name' in item) return item.name;
    return item.id;
  };

  // 获取类别的辅助函数
  const getCategory = (item: any): string => {
    if ('category' in item) return item.category;
    if ('processing' in item) return item.processing.category;
    return '';
  };

  // 渲染卡片
  const renderCard = (item: any) => {
    switch (currentEntityType) {
      case 'material':
        return <MaterialCard material={item} />;
      case 'slice':
        return <SliceCard slice={item} />;
      case 'formula':
        return <FormulaCard formula={item} />;
      default:
        return null;
    }
  };

  const items = getCurrentItems();

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 标题和实体类型切换 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">中医药知识图谱</h1>
        
        {/* 实体类型标签 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {entityTypes.map(type => (
            <button
              key={type.value}
              onClick={() => setCurrentEntityType(type.value)}
              className={`px-4 py-2 rounded-full transition-all ${
                currentEntityType === type.value
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              disabled={type.count === 0}
            >
              {type.label}
              <span className="ml-2 text-sm">({type.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* 搜索和过滤 */}
      {currentEntityType === 'material' && <SearchAndFilters />}

      {/* 工具栏 */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          {/* 排序选项 */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="name">按名称</option>
            <option value="category">按类别</option>
            <option value="created">按创建时间</option>
          </select>

          {/* 排序方向 */}
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            {sortOrder === 'asc' ? (
              <SortAsc className="w-5 h-5" />
            ) : (
              <SortDesc className="w-5 h-5" />
            )}
          </button>

          {/* 过滤器按钮 */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 hover:bg-gray-100 rounded-md transition-colors ${
              showFilters ? 'bg-gray-100' : ''
            }`}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* 视图模式切换 */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'grid' ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'list' ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 内容展示 */}
      <GalleryGrid
        items={items}
        renderCard={renderCard}
        viewMode={viewMode}
        isLoading={isLoading}
        emptyMessage={`暂无${entityTypes.find(t => t.value === currentEntityType)?.label}数据`}
      />
    </motion.div>
  );
};