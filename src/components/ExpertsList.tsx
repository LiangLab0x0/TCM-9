import React from 'react';
import { motion } from 'framer-motion';
import { User, Award, BookOpen, Users, Calendar, MapPin } from 'lucide-react';
import { useAppStore } from '../store';
import { TCMExpert } from '../types';

const ExpertCard: React.FC<{ expert: TCMExpert; index: number }> = ({ expert, index }) => {
  const { setSelectedExpert, setCurrentView } = useAppStore();

  const handleExpertClick = () => {
    setSelectedExpert(expert);
    setCurrentView('expert-detail');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
      whileTap={{ scale: 0.98 }}
      onClick={handleExpertClick}
      className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer border-2 border-gray-100 hover:border-blue-200 transition-all duration-300"
    >
      {/* 专家头像区域 */}
      <div className="relative h-32 bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="absolute inset-0 bg-black bg-opacity-20" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <User className="w-8 h-8 text-gray-600" />
            </div>
            <div className="text-white">
              <h3 className="text-xl font-bold">{expert.name}</h3>
              <p className="text-blue-100 text-sm">{expert.title}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 专家信息 */}
      <div className="p-6 space-y-4">
        {/* 基本信息 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{expert.institution}</span>
          </div>
          {expert.clinicalExperience && (
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">从业 {expert.clinicalExperience} 年</span>
            </div>
          )}
        </div>

        {/* 专业领域 */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">专业领域</h4>
          <div className="flex flex-wrap gap-1">
            {expert.specialization.slice(0, 3).map((spec, i) => (
              <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                {spec}
              </span>
            ))}
            {expert.specialization.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                +{expert.specialization.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* 主要成就 */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">主要成就</h4>
          <div className="space-y-1">
            {expert.achievements.slice(0, 2).map((achievement, i) => (
              <div key={i} className="flex items-start gap-2">
                <Award className="w-3 h-3 text-yellow-500 mt-1 flex-shrink-0" />
                <span className="text-xs text-gray-600 line-clamp-2">{achievement}</span>
              </div>
            ))}
            {expert.achievements.length > 2 && (
              <p className="text-xs text-gray-500">+{expert.achievements.length - 2} 更多成就...</p>
            )}
          </div>
        </div>

        {/* 传承人信息 */}
        {expert.students && expert.students.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-green-600" />
              <h4 className="text-sm font-medium text-gray-700">传承人</h4>
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {expert.students.length} 位
              </span>
            </div>
            <div className="text-xs text-gray-600">
              {expert.students.slice(0, 3).map(s => s.name).join('、')}
              {expert.students.length > 3 && ` 等 ${expert.students.length} 位传承人`}
            </div>
          </div>
        )}

        {/* 查看详情按钮 */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium text-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
        >
          <BookOpen className="w-4 h-4" />
          查看详细资料
        </motion.button>
      </div>
    </motion.div>
  );
};

const ExpertsList: React.FC = () => {
  const { experts, isLoading } = useAppStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <span className="text-xl font-medium text-gray-700">正在加载专家信息...</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-800 mb-2"
          >
            中医药大师
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            汇聚国家级中医药传承工作室专家及其传承人，传承中医药智慧，弘扬传统文化
          </motion.p>
        </div>

        {/* 统计信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{experts.length}</p>
                <p className="text-sm text-gray-600">专家总数</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {experts.reduce((sum, expert) => sum + (expert.students?.length || 0), 0)}
                </p>
                <p className="text-sm text-gray-600">传承人数</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {Math.round(experts.reduce((sum, expert) => sum + (expert.clinicalExperience || 0), 0) / experts.length)}
                </p>
                <p className="text-sm text-gray-600">平均从业年限</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {experts.reduce((sum, expert) => sum + (expert.publications?.length || 0), 0)}
                </p>
                <p className="text-sm text-gray-600">学术著作</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 专家卡片网格 */}
        {experts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experts.map((expert, index) => (
              <ExpertCard key={expert.id} expert={expert} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">👨‍⚕️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">暂无专家信息</h3>
            <p className="text-gray-600">专家信息正在整理中，敬请期待</p>
          </motion.div>
        )}

        {/* 传承工作室介绍 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">传承工作室简介</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">工作室宗旨</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                国家级中医药传承工作室旨在继承和发扬老中医药专家的学术思想、临床经验和技术专长，
                培养高层次中医药人才，推动中医药事业的传承与发展。
              </p>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">主要职能</h3>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>传承老中医药专家的学术思想和临床经验</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>培养中医药继承人和学术继承人</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>整理和总结中医药传统知识</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">传承成果</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                工作室已培养多批传承人，形成了完整的传承体系。通过系统的理论学习和临床实践，
                传承人们不仅掌握了传统中医药技能，更重要的是传承了中医药文化的精神内核。
              </p>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">未来展望</h3>
              <p className="text-gray-600 leading-relaxed">
                继续深化传承工作，建立更加完善的人才培养机制，推动中医药现代化发展，
                为中医药事业的传承与创新贡献力量。
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ExpertsList;
