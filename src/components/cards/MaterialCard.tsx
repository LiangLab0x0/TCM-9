import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, MapPin, Thermometer } from 'lucide-react';
import { Material, getQiTheme } from '../../types/tcm-core';
import { useNewAppStore } from '../../store';

interface MaterialCardProps {
  material: Material;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({ material }) => {
  const { setSelectedMaterial, setCurrentView } = useNewAppStore();
  const theme = getQiTheme(material.qi);

  const handleClick = () => {
    setSelectedMaterial(material);
    setCurrentView('detail');
  };

  return (
    <motion.div
      className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-2 ${theme.border}`}
      whileHover={{ y: -5 }}
      onClick={handleClick}
    >
      {/* 图片区域 */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
        {material.images?.primary ? (
          <img
            src={`/images/${material.images.primary}`}
            alt={material.names.cn}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Leaf className="w-16 h-16 text-green-300" />
          </div>
        )}
        
        {/* 四气标签 */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${theme.bg} ${theme.text}`}>
          <Thermometer className="w-3 h-3 inline mr-1" />
          {material.qi}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-4">
        {/* 标题 */}
        <h3 className="text-lg font-bold text-gray-800 mb-1">{material.names.cn}</h3>
        <p className="text-sm text-gray-500 mb-3">{material.names.pinyin}</p>

        {/* 类别和性味 */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
            {material.category}
          </span>
          <div className="flex items-center gap-1">
            {material.flavor.slice(0, 3).map((taste, index) => (
              <span
                key={index}
                className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full"
              >
                {taste}
              </span>
            ))}
          </div>
        </div>

        {/* 功效 */}
        <div className="mb-3">
          <p className="text-sm text-gray-700 line-clamp-2">
            {material.functions.slice(0, 2).join('、')}
            {material.functions.length > 2 && '...'}
          </p>
        </div>

        {/* 产地 */}
        {material.origin.length > 0 && (
          <div className="flex items-center text-xs text-gray-500">
            <MapPin className="w-3 h-3 mr-1" />
            <span>
              {material.origin.slice(0, 2).map(o => o.region).join('、')}
              {material.origin.length > 2 && `等${material.origin.length}地`}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};