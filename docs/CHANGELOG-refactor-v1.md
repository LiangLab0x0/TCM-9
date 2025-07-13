# 技术变更文档 - TCM Gallery v1 重构

## 概述

本次重构实现了从单一 Herb 实体到完整中医药流程（药材→饮片→方剂→颗粒→中成药）的数据模型升级，同时保持了现有功能的向后兼容性。

## 主要变更

### 1. 数据模型重构

#### 新增文件
- `src/types/tcm-core.ts` - 新的标准化数据模型
  - Material（药材）
  - Slice（饮片）  
  - Formula（方剂）
  - GranuleIngredient（配方颗粒）
  - PatentMedicine（中成药）

#### 数据迁移
- `scripts/convert-herb-to-new-schema.ts` - 数据迁移脚本
- 生成新数据文件到 `public/data/new-schema/`
  - materials.json (50条)
  - slices.json (50条)
  - formulas.json (0条)
  - relations.json (关系映射)

### 2. 状态管理重构

#### 新的Store结构
```
src/store/
├── index.ts (主入口，提供向后兼容)
├── adapter.ts (适配器，将新store映射到旧API)
├── index.new.ts (新store整合)
├── index.old.ts (备份的原始store)
└── slices/
    ├── material.ts
    ├── slice.ts
    ├── formula.ts
    ├── ui.ts
    └── expert.ts
```

#### 关键特性
- 多slice架构，便于维护和扩展
- 完全向后兼容的API
- 支持并行数据加载
- TypeScript类型安全

### 3. UI组件更新

#### 新增组件
- `GalleryGrid.tsx` - 通用画廊网格组件
- `TCMGallery.tsx` - 多实体类型画廊（待集成）
- `cards/MaterialCard.tsx` - 药材卡片
- `cards/SliceCard.tsx` - 饮片卡片
- `cards/FormulaCard.tsx` - 方剂卡片
- `GraphView.tsx` - 知识图谱视图（占位）

#### 更新组件
- Navigation.tsx - 新增"知识图谱"入口
- App.tsx - 支持graph视图路由

### 4. 数据映射规则

| 旧字段 (Herb) | 新实体 | 新字段 | 说明 |
|-------------|--------|--------|------|
| id, name, pinyin | Material | 同名 | 直接映射 |
| nature | Material | qi | 转换为标准四气 |
| taste | Material | flavor | 转换为标准五味 |
| origin | Material | origin[] | 扩展为AuthenticRegion |
| processing[] | Slice | processing.method | 每种炮制方法生成独立Slice |
| functions | Material | functions | 保留在Material |
| indications | Material/Formula | indications | 根据是否有方剂出处分配 |

## Breaking Changes

暂无破坏性变更。所有现有组件通过适配器层继续正常工作。

## Migration Guide

### 第一阶段（已完成）
1. ✅ 创建新数据模型
2. ✅ 实现数据迁移脚本
3. ✅ 重构状态管理
4. ✅ 创建适配器保证兼容性

### 第二阶段（进行中）
1. 🔄 逐步迁移组件使用新API
2. ⏳ 实现Detail组件的多实体支持
3. ⏳ 更新Map组件使用authenticRegions
4. ⏳ 集成react-flow实现Graph视图

### 第三阶段（计划中）
1. ⏳ 移除适配器层
2. ⏳ 完全迁移到新数据模型
3. ⏳ 实现颗粒和中成药功能

## 技术债务

1. **数据完整性**
   - 需要补充Material.names.latin（拉丁学名）
   - Formula数据需要从其他来源导入
   - 缺少实际的化学成分和药理数据

2. **类型安全**
   - 部分类型转换使用了any
   - 需要更严格的类型检查

3. **性能优化**
   - 考虑使用React.lazy进行代码分割
   - 实现虚拟滚动优化大数据集展示

## 下一步计划

1. **功能完善**
   - 完成剩余组件的迁移
   - 实现Graph视图的react-flow集成
   - 添加数据导入/导出功能

2. **质量提升**
   - 添加单元测试
   - 配置Storybook
   - 设置CI/CD pipeline

3. **用户体验**
   - 实现响应式设计优化
   - 添加键盘快捷键
   - 改进加载状态展示

## 相关文档

- [Field Usage Map](./FIELD_USAGE_MAP.md) - 字段使用映射
- [Migration Report](../public/data/new-schema/MIGRATION_REPORT.md) - 数据迁移报告
- [Roadmap](./ROADMAP.md) - 产品路线图（待创建）