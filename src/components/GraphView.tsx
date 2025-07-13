import React from 'react';
import { motion } from 'framer-motion';
import { Network } from 'lucide-react';

/**
 * 知识图谱视图 - 将在后续集成react-flow
 */
export const GraphView: React.FC = () => {
  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center py-20">
        <Network className="w-20 h-20 mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">知识图谱视图</h2>
        <p className="text-gray-500">即将上线，敬请期待</p>
        <p className="text-sm text-gray-400 mt-4">
          将展示药材、饮片、方剂之间的关系网络
        </p>
      </div>
    </motion.div>
  );
};

export default GraphView;