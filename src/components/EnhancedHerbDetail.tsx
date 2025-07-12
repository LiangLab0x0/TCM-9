import React, { useState } from 'react';
import { ArrowLeft, Plus, Minus, BookOpen, Microscope, Pill, ShieldCheck, Users, TrendingUp, FileText, Star, AlertTriangle } from 'lucide-react';
import { Herb, getNatureTheme, getProfessionalLevel } from '../types';
import { useAppStore } from '../store';

interface EnhancedHerbDetailProps {
  herb: Herb;
}

const EnhancedHerbDetail: React.FC<EnhancedHerbDetailProps> = ({ herb }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const {
    compareList,
    herbs,
    addToCompare,
    removeFromCompare,
    setCurrentView
  } = useAppStore();

  const theme = getNatureTheme(herb.nature);
  const professional = getProfessionalLevel(herb);
  const isInCompare = compareList.some(h => h.id === herb.id);

  const handleToggleCompare = () => {
    if (isInCompare) {
      removeFromCompare(herb.id);
    } else {
      addToCompare(herb);
    }
  };

  const tabs = [
    { id: 'overview', label: '基本信息', icon: BookOpen },
    { id: 'pharmacopoeia', label: '药典信息', icon: FileText },
    { id: 'chemistry', label: '化学成分', icon: Microscope },
    { id: 'pharmacology', label: '药理作用', icon: Pill },
    { id: 'clinical', label: '临床应用', icon: Users },
    { id: 'quality', label: '质量控制', icon: ShieldCheck },
    { id: 'resources', label: '资源信息', icon: TrendingUp },
    { id: 'research', label: '现代研究', icon: Star }
  ];

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* 基本信息卡片 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          基本药性信息
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 性味 */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">性味</h4>
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${theme.secondary} ${theme.accent}`}>
                {herb.nature}
              </span>
              {herb.taste.map((taste, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {taste}
                </span>
              ))}
            </div>
          </div>

          {/* 归经 */}
          {herb.meridians && herb.meridians.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">归经</h4>
              <div className="flex flex-wrap gap-2">
                {herb.meridians.map((meridian, index) => (
                  <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    {meridian}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 产地 */}
          {herb.origin && herb.origin.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">主要产地</h4>
              <div className="flex flex-wrap gap-2">
                {herb.origin.map((origin, index) => (
                  <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    {origin}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 功效主治 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">功效主治</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-3">主要功效</h4>
            <div className="space-y-2">
              {herb.functions.map((func, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">{func}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-3">主治病症</h4>
            <div className="space-y-2">
              {herb.indications.map((indication, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">{indication}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 用法用量 */}
      {herb.dosage && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">用法用量</h3>
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
            <p className="text-amber-800">{herb.dosage}</p>
          </div>
        </div>
      )}

      {/* 注意事项 */}
      {herb.contraindications && herb.contraindications.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            注意事项
          </h3>
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <ul className="space-y-2">
              {herb.contraindications.map((contraindication, index) => (
                <li key={index} className="text-red-700 flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  {contraindication}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );

  const renderPharmacopoeiaTab = () => (
    <div className="space-y-6">
      {herb.pharmacopoeiaInfo ? (
        <>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">药典基本信息</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">药典编号</label>
                <p className="text-lg font-mono bg-gray-50 p-2 rounded">{herb.pharmacopoeiaInfo.code}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">拉丁学名</label>
                <p className="text-lg italic text-gray-800">{herb.pharmacopoeiaInfo.latinName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">药材等级</label>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  herb.pharmacopoeiaInfo.grade === 'premium' ? 'bg-purple-100 text-purple-800' :
                  herb.pharmacopoeiaInfo.grade === 'first' ? 'bg-blue-100 text-blue-800' :
                  herb.pharmacopoeiaInfo.grade === 'second' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {herb.pharmacopoeiaInfo.grade === 'premium' ? '特级' :
                   herb.pharmacopoeiaInfo.grade === 'first' ? '一级' :
                   herb.pharmacopoeiaInfo.grade === 'second' ? '二级' : '三级'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">标准制定年份</label>
                <p className="text-lg text-gray-800">{herb.pharmacopoeiaInfo.standardYear}年版</p>
              </div>
            </div>
            {herb.pharmacopoeiaInfo.aliases.length > 0 && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-600 mb-2">别名</label>
                <div className="flex flex-wrap gap-2">
                  {herb.pharmacopoeiaInfo.aliases.map((alias, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                      {alias}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">暂无药典信息</p>
        </div>
      )}
    </div>
  );

  const renderChemistryTab = () => (
    <div className="space-y-6">
      {herb.chemicalComponents && herb.chemicalComponents.length > 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">化学成分</h3>
          <div className="grid gap-4">
            {herb.chemicalComponents.map((component, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-800">{component.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    component.importance === 'primary' ? 'bg-red-100 text-red-800' :
                    component.importance === 'secondary' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {component.importance === 'primary' ? '主要成分' :
                     component.importance === 'secondary' ? '次要成分' : '微量成分'}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">类别: </span>
                    <span className="text-gray-800">{component.category}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">含量: </span>
                    <span className="text-gray-800">{component.content}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">作用: </span>
                    <span className="text-gray-800">{component.function}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <Microscope className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">暂无化学成分信息</p>
        </div>
      )}
    </div>
  );

  const renderPharmacologyTab = () => (
    <div className="space-y-6">
      {herb.pharmacologicalActions && herb.pharmacologicalActions.length > 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">药理作用</h3>
          <div className="space-y-6">
            {herb.pharmacologicalActions.map((action, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-6">
                <h4 className="font-medium text-gray-800 mb-2">{action.action}</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">作用机制: </span>
                    <span className="text-gray-700">{action.mechanism}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">证据等级: </span>
                    <span className="text-gray-700">{action.evidence}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">临床意义: </span>
                    <span className="text-gray-700">{action.clinicalRelevance}</span>
                  </div>
                  {action.studies && action.studies.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-600">相关研究: </span>
                      <ul className="mt-1 space-y-1">
                        {action.studies.map((study, idx) => (
                          <li key={idx} className="text-gray-600 text-xs">• {study}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <Pill className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">暂无药理作用信息</p>
        </div>
      )}
    </div>
  );

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'pharmacopoeia':
        return renderPharmacopoeiaTab();
      case 'chemistry':
        return renderChemistryTab();
      case 'pharmacology':
        return renderPharmacologyTab();
      case 'clinical':
        return <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">临床应用信息开发中...</p>
        </div>;
      case 'quality':
        return <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <ShieldCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">质量控制信息开发中...</p>
        </div>;
      case 'resources':
        return <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">资源信息开发中...</p>
        </div>;
      case 'research':
        return <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">现代研究信息开发中...</p>
        </div>;
      default:
        return renderOverviewTab();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* 返回按钮 */}
        <button
          onClick={() => setCurrentView('gallery')}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          返回药材库
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：药材图片和基本信息 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* 药材图片 */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={`/images/herbs/${herb.primaryImage}`}
                  alt={herb.name}
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/placeholder-herb.jpg';
                  }}
                />
                
                {/* 专业等级角标 */}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-lg text-sm font-bold ${professional.color} bg-white bg-opacity-95 shadow-sm`}>
                  {professional.level}
                </div>
              </div>

              {/* 基本信息 */}
              <div className="p-6">
                <div className="text-center mb-4">
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">{herb.name}</h1>
                  <p className="text-gray-600">{herb.pinyin}</p>
                  {herb.englishName && (
                    <p className="text-sm text-gray-500 italic">{herb.englishName}</p>
                  )}
                </div>

                {/* 专业描述 */}
                <div className="mb-6">
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {professional.description}
                  </p>
                </div>

                {/* 操作按钮 */}
                <div className="space-y-3">
                  <button
                    onClick={handleToggleCompare}
                    className={`
                      w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2
                      ${isInCompare 
                        ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                      }
                    `}
                  >
                    {isInCompare ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {isInCompare ? '移出对比' : '加入对比'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：详细信息 */}
          <div className="lg:col-span-2">
            {/* 标签页导航 */}
            <div className="bg-white rounded-t-xl shadow-lg">
              <div className="flex flex-wrap border-b border-gray-200">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors
                      ${activeTab === tab.id
                        ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 标签页内容 */}
            <div className="bg-gray-50 rounded-b-xl p-6">
              {renderTab()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedHerbDetail;
