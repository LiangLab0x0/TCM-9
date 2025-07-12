import React from 'react';
import { Plus, Minus, MapPin, BookOpen } from 'lucide-react';
import { Herb, getNatureTheme, getProfessionalLevel } from '../types';
import { useAppStore } from '../store';

interface HerbCardProps {
  herb: Herb;
  isCompact?: boolean;
}

const HerbCard: React.FC<HerbCardProps> = ({ herb, isCompact = false }) => {
  const {
    compareList,
    addToCompare,
    removeFromCompare,
    setSelectedHerb,
    setCurrentView
  } = useAppStore();

  const theme = getNatureTheme(herb.nature);
  const professional = getProfessionalLevel(herb);
  const isInCompare = compareList.some(h => h.id === herb.id);

  const handleCardClick = () => {
    setSelectedHerb(herb);
    setCurrentView('detail');
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInCompare) {
      removeFromCompare(herb.id);
    } else {
      addToCompare(herb);
    }
  };

  return (
    <div
      className={`
        relative bg-white rounded-lg overflow-hidden cursor-pointer
        border ${theme.border} shadow-sm hover:shadow-md transition-shadow duration-200
        ${isCompact ? 'h-48' : 'h-80'}
      `}
      onClick={handleCardClick}
    >
      {/* 专业等级角标 */}
      <div className={`absolute top-2 left-2 z-10 px-3 py-1 rounded-lg text-xs font-bold ${professional.color} bg-white bg-opacity-95 shadow-sm`}>
        {professional.level}
      </div>

      {/* 状态标识 */}
      <div className="absolute top-2 right-2 z-10 flex gap-1">
        {herb.origin && herb.origin.length > 0 && (
          <div className="bg-slate-100 rounded p-1.5">
            <MapPin className="w-4 h-4 text-slate-600" />
          </div>
        )}
      </div>

      {/* 背景渐变 */}
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.primary} opacity-5`} />

      {/* 药材图片 */}
      <div className={`relative ${isCompact ? 'h-24' : 'h-48'} overflow-hidden`}>
        <img
          src={`/images/herbs/${herb.primaryImage}`}
          alt={herb.name}
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/placeholder-herb.jpg';
          }}
        />
        
        {/* 图片遮罩渐变 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-20" />
        
        {/* 属性标签 */}
        <div className="absolute bottom-2 left-2 flex gap-1">
          <span className={`px-2 py-1 rounded-md text-xs font-medium bg-white bg-opacity-95 ${theme.accent} shadow-sm`}>
            {herb.nature}
          </span>
          <span className={`px-2 py-1 rounded-md text-xs font-medium bg-white bg-opacity-95 ${theme.accent} shadow-sm`}>
            {herb.category}
          </span>
        </div>
      </div>

      {/* 药材信息 */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 truncate">{herb.name}</h3>
            <p className="text-sm text-gray-600">{herb.pinyin}</p>
            {herb.englishName && (
              <p className="text-xs text-gray-500 italic">{herb.englishName}</p>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleToggleCompare}
              className={`p-2 rounded transition-colors ${
                isInCompare ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
              }`}
              title={isInCompare ? '移出对比' : '加入对比'}
            >
              {isInCompare ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
          </div>
        </div>
        
        {!isCompact && (
          <>
            {/* 药味标签 */}
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1">
                {herb.taste.slice(0, 3).map((taste, index) => (
                  <span key={index} className={`px-2 py-1 ${theme.secondary} ${theme.accent} text-xs rounded-md font-medium`}>
                    {taste}
                  </span>
                ))}
                {herb.taste.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                    +{herb.taste.length - 3}
                  </span>
                )}
              </div>
            </div>
            
            {/* 主要功效 */}
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-medium">主要功效</p>
              <div className="text-sm text-gray-700">
                {herb.functions.slice(0, 2).join('、')}
                {herb.functions.length > 2 && <span className="text-gray-500">...</span>}
              </div>
            </div>

            {/* 产地信息 */}
            {herb.origin && herb.origin.length > 0 && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-600">
                  {herb.origin.slice(0, 2).join('、')}
                  {herb.origin.length > 2 && '等'}
                </span>
              </div>
            )}

            {/* 专业描述 */}
            <div className="pt-1">
              <p className="text-xs text-gray-500">{professional.description}</p>
            </div>
          </>
        )}

        {/* 查看详情按钮 */}
        <button
          onClick={handleCardClick}
          className={`
            w-full py-2 px-4 rounded font-medium text-sm transition-colors
            ${theme.primary} text-white hover:opacity-90
            flex items-center justify-center gap-2
          `}
        >
          <BookOpen className="w-4 h-4" />
          查看详情
        </button>
      </div>
    </div>
  );
};

export default HerbCard;
