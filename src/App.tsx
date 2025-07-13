import React, { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAppStore, initializeStore } from './store';
import Navigation from './components/Navigation';
import HerbGallery from './components/HerbGallery';
import HerbDetail from './components/HerbDetail';
import HerbCompare from './components/HerbCompare';
import ChinaMap from './components/ChinaMap';
import ExpertsList from './components/ExpertsList';
import ExpertDetail from './components/ExpertDetail';
import GraphView from './components/GraphView';

function App() {
  const { 
    currentView, 
    selectedHerb,
    selectedExpert
  } = useAppStore();

  // 初始化加载数据
  useEffect(() => {
    initializeStore();
  }, []);

  const renderContent = () => {
    switch (currentView) {
      case 'detail':
        return selectedHerb ? <HerbDetail herb={selectedHerb} /> : <HerbGallery />;
      
      case 'compare':
        return <HerbCompare />;
      
      case 'map':
        return <ChinaMap />;
      
      case 'experts':
        return <ExpertsList />;
      
      case 'expert-detail':
        return selectedExpert ? <ExpertDetail expert={selectedExpert} /> : <ExpertsList />;
      
      case 'graph':
        return <GraphView />;
      
      case 'gallery':
      default:
        return <HerbGallery />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>
      
      {/* 背景装饰 - 更加专业的设计 */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-200 rounded-full opacity-5 animate-pulse" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-200 rounded-full opacity-5 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-purple-200 rounded-full opacity-5 animate-pulse" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-indigo-200 rounded-full opacity-5 animate-pulse" style={{ animationDelay: '6s' }} />
        
        {/* 中医药元素装饰 */}
        <div className="absolute top-1/4 right-1/4 w-16 h-16 opacity-3">
          <div className="w-full h-full border-2 border-green-300 rounded-full animate-spin" style={{ animationDuration: '20s' }}>
            <div className="absolute inset-2 border border-green-400 rounded-full"></div>
            <div className="absolute inset-4 bg-green-200 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
