import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { MapPin, Filter, X } from 'lucide-react';
import { useAppStore } from '../store';
import { ProvinceMapData } from '../types';

const OriginMap: React.FC = () => {
  const { herbs, updateSearchFilters, setCurrentView } = useAppStore();
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);

  // 处理省份数据
  const provinceData = useMemo(() => {
    const provinceMap = new Map<string, { count: number; herbs: string[] }>();
    
    herbs.forEach(herb => {
      if (herb.origin) {
        herb.origin.forEach(province => {
          if (!provinceMap.has(province)) {
            provinceMap.set(province, { count: 0, herbs: [] });
          }
          const data = provinceMap.get(province)!;
          data.count += 1;
          data.herbs.push(herb.name);
        });
      }
    });

    const maxCount = Math.max(...Array.from(provinceMap.values()).map(v => v.count));
    
    return Array.from(provinceMap.entries()).map(([province, data]): ProvinceMapData => ({
      name: province,
      value: data.count,
      herbs: data.herbs,
      itemStyle: {
        areaColor: getProvinceColor(data.count, maxCount)
      }
    }));
  }, [herbs]);

  // 根据药材数量获取颜色
  const getProvinceColor = (count: number, maxCount: number): string => {
    const ratio = count / maxCount;
    if (ratio > 0.8) return '#1e40af'; // 深蓝
    if (ratio > 0.6) return '#3b82f6'; // 蓝色
    if (ratio > 0.4) return '#60a5fa'; // 浅蓝
    if (ratio > 0.2) return '#93c5fd'; // 很浅蓝
    return '#dbeafe'; // 极浅蓝
  };

  // ECharts配置
  const option = {
    title: {
      text: '中药材产地分布图',
      left: 'center',
      textStyle: {
        color: '#374151',
        fontSize: 20,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const provinceInfo = provinceData.find(p => p.name === params.name);
        if (!provinceInfo) return '';
        
        return `
          <div style="padding: 8px;">
            <strong>${params.name}</strong><br/>
            药材种类: ${provinceInfo.value} 种<br/>
            <div style="max-height: 120px; overflow-y: auto; margin-top: 8px;">
              ${provinceInfo.herbs.slice(0, 10).map(herb => 
                `<span style="display: inline-block; background: #f3f4f6; margin: 2px; padding: 2px 6px; border-radius: 4px; font-size: 12px;">${herb}</span>`
              ).join('')}
              ${provinceInfo.herbs.length > 10 ? `<div style="margin-top: 4px; color: #6b7280; font-size: 12px;">+${provinceInfo.herbs.length - 10} 更多...</div>` : ''}
            </div>
          </div>
        `;
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: {
        color: '#374151'
      }
    },
    visualMap: {
      min: 0,
      max: Math.max(...provinceData.map(p => p.value)),
      text: ['高', '低'],
      realtime: false,
      calculable: true,
      inRange: {
        color: ['#dbeafe', '#1e40af']
      },
      textStyle: {
        color: '#374151'
      }
    },
    series: [
      {
        name: '中药材产地',
        type: 'map',
        map: 'china',
        roam: true,
        data: provinceData,
        emphasis: {
          itemStyle: {
            areaColor: '#fbbf24',
            borderWidth: 2,
            borderColor: '#f59e0b'
          },
          label: {
            show: true,
            color: '#374151',
            fontWeight: 'bold'
          }
        },
        select: {
          itemStyle: {
            areaColor: '#dc2626',
            borderWidth: 2,
            borderColor: '#b91c1c'
          }
        }
      }
    ]
  };

  // 地图事件处理
  const onEvents = {
    'click': (params: any) => {
      const provinceName = params.name;
      setSelectedProvince(provinceName);
      // 过滤该省份的药材
      updateSearchFilters({ origin: provinceName });
      setCurrentView('gallery');
    },
    'mouseover': (params: any) => {
      setHoveredProvince(params.name);
    },
    'mouseout': () => {
      setHoveredProvince(null);
    }
  };

  // 清除省份选择
  const clearSelection = () => {
    setSelectedProvince(null);
    updateSearchFilters({ origin: '' });
  };

  // 省份统计排序
  const sortedProvinces = [...provinceData]
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">中药材产地分布</h1>
          <p className="text-gray-600">点击省份查看该地区的药材分布情况</p>
        </div>

        {/* 选择状态 */}
        {selectedProvince && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span className="text-blue-800 font-medium">
                已选择：{selectedProvince}
              </span>
              <span className="text-blue-600">
                ({provinceData.find(p => p.name === selectedProvince)?.value || 0} 种药材)
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearSelection}
              className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <X className="w-4 h-4" />
              清除选择
            </motion.button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 地图区域 */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <ReactECharts
                option={option}
                style={{ height: '600px', width: '100%' }}
                onEvents={onEvents}
                theme="default"
              />
            </motion.div>
          </div>

          {/* 侧边栏信息 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 产地排行榜 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-bold text-gray-800">产地排行榜</h2>
              </div>
              <div className="space-y-3">
                {sortedProvinces.map((province, index) => (
                  <motion.div
                    key={province.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      setSelectedProvince(province.name);
                      updateSearchFilters({ origin: province.name });
                      setCurrentView('gallery');
                    }}
                    className={`
                      p-3 rounded-lg cursor-pointer transition-all duration-200
                      ${selectedProvince === province.name
                        ? 'bg-blue-100 border-2 border-blue-300'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`
                          w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                          ${index < 3 
                            ? 'bg-yellow-400 text-yellow-900' 
                            : 'bg-gray-300 text-gray-700'
                          }
                        `}>
                          {index + 1}
                        </span>
                        <span className="font-medium text-gray-800">{province.name}</span>
                      </div>
                      <span className="text-sm font-bold text-blue-600">
                        {province.value} 种
                      </span>
                    </div>
                    
                    {/* 进度条 */}
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(province.value / Math.max(...sortedProvinces.map(p => p.value))) * 100}%` 
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* 使用说明 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-lg font-bold text-gray-800 mb-4">使用说明</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs">1</span>
                  </div>
                  <p>点击地图上的省份查看该地区的药材</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs">2</span>
                  </div>
                  <p>颜色越深表示该省份药材种类越多</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs">3</span>
                  </div>
                  <p>鼠标悬停可查看详细药材列表</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs">4</span>
                  </div>
                  <p>支持地图缩放和拖拽操作</p>
                </div>
              </div>
            </motion.div>

            {/* 当前悬停信息 */}
            {hoveredProvince && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
              >
                <h3 className="font-bold text-yellow-800 mb-2">{hoveredProvince}</h3>
                <p className="text-yellow-700 text-sm">
                  {provinceData.find(p => p.name === hoveredProvince)?.value || 0} 种药材
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OriginMap;
