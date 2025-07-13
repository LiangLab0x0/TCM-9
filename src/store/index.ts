/**
 * Store主入口 - 使用适配器提供向后兼容
 * 
 * 这个文件导出与原始store相同的API，但内部使用新的store结构
 * 这样可以逐步迁移代码，而不会破坏现有功能
 */

export { useAppStore } from './adapter';
export { initializeStore } from './index.new';

// 如果需要直接访问新store
export { useAppStore as useNewAppStore } from './index.new';