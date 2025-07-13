import React from 'react';
import { motion } from 'framer-motion';
import { Book, Users, Weight, Pill } from 'lucide-react';
import { Formula, calculateFormulaWeight } from '../../types/tcm-core';
import { useNewAppStore } from '../../store';

interface FormulaCardProps {
  formula: Formula;
}

export const FormulaCard: React.FC<FormulaCardProps> = ({ formula }) => {
  const { setSelectedFormula, setCurrentView, addToCompareFormulas, compareFormulas } = useNewAppStore();
  
  const isInCompare = compareFormulas.some(f => f.id === formula.id);
  const totalWeight = calculateFormulaWeight(formula);

  const handleClick = () => {
    setSelectedFormula(formula);
    setCurrentView('detail');
  };

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInCompare) {
      // 需要实现removeFromCompareFormulas
    } else {
      addToCompareFormulas(formula);
    }
  };

  // 获取君药数量
  const monarchCount = formula.components.filter(c => c.role === '君').length;
  
  return (
    <motion.div
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
      whileHover={{ y: -5 }}
      onClick={handleClick}
    >
      {/* 图片区域 */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50">
        {formula.thumbnail ? (
          <img
            src={formula.thumbnail}
            alt={formula.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Pill className="w-16 h-16 text-indigo-300" />
          </div>
        )}
        
        {/* 比较按钮 */}
        <button
          onClick={handleCompareToggle}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
            isInCompare 
              ? 'bg-indigo-600 text-white' 
              : 'bg-white/80 hover:bg-white text-gray-700'
          }`}
        >
          <Users className="w-4 h-4" />
        </button>
      </div>

      {/* 内容区域 */}
      <div className="p-4">
        {/* 标题 */}
        <h3 className="text-lg font-bold text-gray-800 mb-1">{formula.name}</h3>
        <p className="text-sm text-gray-500 mb-3">{formula.pinyin}</p>
        
        {/* 出处和类别 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <Book className="w-3 h-3 mr-1" />
            <span>{formula.source}</span>
          </div>
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
            {formula.category}
          </span>
        </div>

        {/* 组成概览 */}
        <div className="mb-3">
          <div className="flex items-center text-sm text-gray-700 mb-2">
            <Weight className="w-3 h-3 mr-1" />
            <span>共{formula.components.length}味药，{totalWeight}g</span>
          </div>
          
          {/* 君臣佐使分布 */}
          <div className="flex gap-2 text-xs">
            {['君', '臣', '佐', '使'].map(role => {
              const count = formula.components.filter(c => c.role === role as any).length;
              return count > 0 ? (
                <span
                  key={role}
                  className={`px-2 py-1 rounded-full ${
                    role === '君' ? 'bg-red-100 text-red-700' :
                    role === '臣' ? 'bg-orange-100 text-orange-700' :
                    role === '佐' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}
                >
                  {role} {count}
                </span>
              ) : null;
            })}
          </div>
        </div>

        {/* 功效 */}
        <div className="mb-3">
          <p className="text-sm text-gray-700 line-clamp-2">
            {formula.functions.slice(0, 2).join('，')}
            {formula.functions.length > 2 && '...'}
          </p>
        </div>

        {/* 主治 */}
        <div className="text-xs text-gray-500 line-clamp-2">
          主治：{formula.indications.slice(0, 2).join('、')}
          {formula.indications.length > 2 && '...'}
        </div>

        {/* 剂型标签 */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
            {formula.usage.dosageForm}
          </span>
        </div>
      </div>
    </motion.div>
  );
};