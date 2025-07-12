import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, User, Award, BookOpen, Users, Calendar, 
  MapPin, GraduationCap, Star, FileText
} from 'lucide-react';
import { TCMExpert } from '../types';
import { useAppStore } from '../store';

interface ExpertDetailProps {
  expert: TCMExpert;
}

const ExpertDetail: React.FC<ExpertDetailProps> = ({ expert }) => {
  const { setCurrentView } = useAppStore();

  const handleBack = () => {
    setCurrentView('experts');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* 返回按钮 */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleBack}
          className="flex items-center gap-2 mb-6 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回专家列表</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：专家基本信息 */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-8"
            >
              {/* 专家头像区域 */}
              <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
                <div className="absolute inset-0 bg-black bg-opacity-20" />
                <div className="absolute bottom-6 left-6 right-6 text-center">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mx-auto mb-4">
                    <User className="w-12 h-12 text-gray-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-1">{expert.name}</h1>
                  <p className="text-blue-100">{expert.title}</p>
                </div>
              </div>

              {/* 基本信息 */}
              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">工作单位</p>
                      <p className="font-medium">{expert.institution}</p>
                    </div>
                  </div>

                  {expert.birthYear && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Calendar className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-sm text-gray-500">出生年份</p>
                        <p className="font-medium">{expert.birthYear} 年</p>
                      </div>
                    </div>
                  )}

                  {expert.clinicalExperience && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <GraduationCap className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="text-sm text-gray-500">从业经验</p>
                        <p className="font-medium">{expert.clinicalExperience} 年</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 专业领域 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">专业领域</h3>
                  <div className="flex flex-wrap gap-2">
                    {expert.specialization.map((spec, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 荣誉称号 */}
                {expert.honors && expert.honors.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">荣誉称号</h3>
                    <div className="space-y-2">
                      {expert.honors.map((honor, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm text-gray-700">{honor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* 右侧：详细信息 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 个人简介 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <User className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-800">个人简介</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-justify">
                {expert.biography}
              </p>
            </motion.div>

            {/* 主要成就 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-6 h-6 text-yellow-600" />
                <h2 className="text-xl font-bold text-gray-800">主要成就</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {expert.achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg"
                  >
                    <Award className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{achievement}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* 学术著作 */}
            {expert.publications && expert.publications.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-6 h-6 text-green-600" />
                  <h2 className="text-xl font-bold text-gray-800">学术著作</h2>
                </div>
                <div className="space-y-4">
                  {expert.publications.map((publication, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="border-l-4 border-green-500 pl-4 py-2"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1">{publication.title}</h3>
                          {publication.description && (
                            <p className="text-gray-600 text-sm mb-2">{publication.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{publication.year} 年</span>
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                              {publication.type === 'book' ? '著作' : 
                               publication.type === 'paper' ? '论文' : '标准'}
                            </span>
                          </div>
                        </div>
                        <FileText className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 研究领域 */}
            {expert.researchAreas && expert.researchAreas.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="w-6 h-6 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-800">研究领域</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {expert.researchAreas.map((area, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-center"
                    >
                      <span className="text-purple-800 font-medium">{area}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 传承人信息 */}
            {expert.students && expert.students.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-xl font-bold text-gray-800">传承人</h2>
                  <span className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full">
                    {expert.students.length} 位
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {expert.students.map((student, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{student.name}</h3>
                          <p className="text-sm text-indigo-600 mb-1">{student.batch}</p>
                          <p className="text-sm text-gray-600 mb-1">{student.currentPosition}</p>
                          <p className="text-xs text-gray-500">{student.institution}</p>
                          
                          {student.specialization && student.specialization.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {student.specialization.slice(0, 2).map((spec, i) => (
                                <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                  {spec}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          {student.achievements && student.achievements.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-600">{student.achievements[0]}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ExpertDetail;
