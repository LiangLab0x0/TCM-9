import React from 'react';
import { motion } from 'framer-motion';
import { BaseNode } from '../types/tcm-core';

interface GalleryGridProps<T extends BaseNode> {
  items: T[];
  renderCard: (item: T) => React.ReactNode;
  viewMode?: 'grid' | 'list';
  columns?: 3 | 4 | 5;
  isLoading?: boolean;
  emptyMessage?: string;
}

/**
 * 通用画廊网格组件 - 支持任何实体类型
 */
export function GalleryGrid<T extends BaseNode>({
  items,
  renderCard,
  viewMode = 'grid',
  columns = 4,
  isLoading = false,
  emptyMessage = '暂无数据'
}: GalleryGridProps<T>) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  const gridCols = {
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100
      }
    }
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {items.map((item) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            {renderCard(item)}
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`grid ${gridCols[columns]} gap-6`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map((item) => (
        <motion.div key={item.id} variants={itemVariants}>
          {renderCard(item)}
        </motion.div>
      ))}
    </motion.div>
  );
}