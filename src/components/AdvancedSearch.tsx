import React, { useState } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp, Microscope, Pill, Users, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../store';

interface AdvancedSearchProps {
  onClose: () => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onClose }) => {
  const { herbs, updateSearchFilters } = useAppStore();
  const [searchForm, setSearchForm] = useState({
    basicSearch: '',
    chemicalComponent: '',
    pharmacologicalAction: '',
    clinicalIndication: '',
    qualityGrade: '',
    priceRange: '',
    researchLevel: ''
  });
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    chemical: false,
    pharmacology: false,
    clinical: false,
    quality: false
  });

  const handleInputChange = (field: string, value: string) => {
    setSearchForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSearch = () => {
    // 应用高级搜索过滤器
    updateSearchFilters({
      searchTerm: searchForm.basicSearch,
      chemicalComponent: searchForm.chemicalComponent,
      pharmacologicalAction: searchForm.pharmacologicalAction,
      clinicalIndication: searchForm.clinicalIndication,
      qualityGrade: searchForm.qualityGrade,
      priceRange: searchForm.priceRange,
      researchLevel: searchForm.researchLevel
    });
    onClose();
  };

  const clearSearch = () => {
    setSearchForm({
      basicSearch: '',
      chemicalComponent: '',
      pharmacologicalAction: '',
      clinicalIndication: '',
      qualityGrade: '',
      priceRange: '',
      researchLevel: ''
    });
    updateSearchFilters({
      searchTerm: '',
      chemicalComponent: '',
      pharmacologicalAction: '',
      clinicalIndication: '',
      qualityGrade: '',
      priceRange: '',
      researchLevel: ''
    });
  };

  // 从现有数据中提取化学成分选项
  const chemicalOptions = Array.from(new Set(
    herbs.flatMap(herb => 
      herb.chemicalComponents?.map(comp => comp.name) || []
    )
  )).filter(Boolean);

  // 从现有数据中提取药理作用选项
  const pharmacologyOptions = Array.from(new Set(
    herbs.flatMap(herb => 
      herb.pharmacologicalActions?.map(action => action.action) || []
    )
  )).filter(Boolean);

  // 临床适应症选项
  const clinicalOptions = Array.from(new Set(
    herbs.flatMap(herb => herb.indications || [])
  )).filter(Boolean);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Search className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">高级搜索</h2>
            <span className="text-sm text-gray-500">药典级专业搜索</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 基础搜索 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-500" />
                基础搜索
              </h3>
              <button
                onClick={() => toggleSection('basic')}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                {expandedSections.basic ? 
                  <ChevronUp className="w-4 h-4 text-gray-500" /> : 
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                }
              </button>
            </div>
            
            {expandedSections.basic && (
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    药材名称、功效、产地等
                  </label>
                  <input
                    type="text"
                    value={searchForm.basicSearch}
                    onChange={(e) => handleInputChange('basicSearch', e.target.value)}
                    placeholder="输入关键词进行搜索..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 化学成分搜索 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Microscope className="w-5 h-5 text-green-500" />
                化学成分搜索
              </h3>
              <button
                onClick={() => toggleSection('chemical')}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                {expandedSections.chemical ? 
                  <ChevronUp className="w-4 h-4 text-gray-500" /> : 
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                }
              </button>
            </div>
            
            {expandedSections.chemical && (
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    化学成分名称
                  </label>
                  <select
                    value={searchForm.chemicalComponent}
                    onChange={(e) => handleInputChange('chemicalComponent', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">请选择化学成分</option>
                    {chemicalOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="mb-2">常见化学成分类别：</p>
                  <div className="flex flex-wrap gap-2">
                    {['黄酮类', '生物碱', '皂苷类', '多糖类', '挥发油', '酚酸类'].map(category => (
                      <span key={category} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 药理作用搜索 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Pill className="w-5 h-5 text-purple-500" />
                药理作用搜索
              </h3>
              <button
                onClick={() => toggleSection('pharmacology')}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                {expandedSections.pharmacology ? 
                  <ChevronUp className="w-4 h-4 text-gray-500" /> : 
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                }
              </button>
            </div>
            
            {expandedSections.pharmacology && (
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    药理作用类型
                  </label>
                  <select
                    value={searchForm.pharmacologicalAction}
                    onChange={(e) => handleInputChange('pharmacologicalAction', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">请选择药理作用</option>
                    {pharmacologyOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="mb-2">常见药理作用：</p>
                  <div className="flex flex-wrap gap-2">
                    {['抗炎', '抗菌', '抗病毒', '免疫调节', '抗肿瘤', '心血管保护', '保肝', '抗氧化'].map(action => (
                      <span key={action} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                        {action}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 临床应用搜索 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                临床应用搜索
              </h3>
              <button
                onClick={() => toggleSection('clinical')}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                {expandedSections.clinical ? 
                  <ChevronUp className="w-4 h-4 text-gray-500" /> : 
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                }
              </button>
            </div>
            
            {expandedSections.clinical && (
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    临床适应症
                  </label>
                  <select
                    value={searchForm.clinicalIndication}
                    onChange={(e) => handleInputChange('clinicalIndication', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">请选择适应症</option>
                    {clinicalOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* 质量等级搜索 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-orange-500" />
                质量等级筛选
              </h3>
              <button
                onClick={() => toggleSection('quality')}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                {expandedSections.quality ? 
                  <ChevronUp className="w-4 h-4 text-gray-500" /> : 
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                }
              </button>
            </div>
            
            {expandedSections.quality && (
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      药典等级
                    </label>
                    <select
                      value={searchForm.qualityGrade}
                      onChange={(e) => handleInputChange('qualityGrade', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">所有等级</option>
                      <option value="premium">特级</option>
                      <option value="first">一级</option>
                      <option value="second">二级</option>
                      <option value="third">三级</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      研究程度
                    </label>
                    <select
                      value={searchForm.researchLevel}
                      onChange={(e) => handleInputChange('researchLevel', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">所有级别</option>
                      <option value="extensive">深入研究</option>
                      <option value="moderate">一般研究</option>
                      <option value="basic">基础研究</option>
                      <option value="limited">研究有限</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 底部操作栏 */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={clearSearch}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
          >
            清除所有
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              搜索
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;
