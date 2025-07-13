# Herb Type Field Usage Map

此文档记录了项目中Herb类型所有字段的使用情况，便于后续迁移和重构。

## 核心字段 (Core Fields)

### id

- `src/components/HerbCompare.tsx:110,122,251` - 比较视图中的key和删除操作
- `src/components/HerbCard.tsx:22,32` - 卡片组件的比较列表检查
- `src/components/HerbDetail.tsx:25,30,43` - 详情页的比较和相关药材过滤
- `src/components/HerbGallery.tsx:216` - 画廊列表的key
- `src/store/index.ts:179,190,197` - 历史记录、比较列表管理

### name

- `src/components/HerbCard.tsx:68,94` - 卡片显示标题
- `src/components/HerbDetail.tsx:81,101` - 详情页标题
- `src/components/HerbCompare.tsx:150,252,273` - 比较视图显示
- `src/components/ChinaMap.tsx:352,430` - 地图视图显示
- `src/store/index.ts:126` - 搜索过滤
- `src/components/HerbGallery.tsx:28` - 排序功能

### englishName

- `src/components/HerbCard.tsx:96-97` - 卡片英文名显示
- `src/components/HerbDetail.tsx:103-104` - 详情页英文名
- `src/store/index.ts:128` - 搜索过滤

### pinyin

- `src/components/HerbCard.tsx:95` - 卡片拼音显示
- `src/components/HerbDetail.tsx:102` - 详情页拼音
- `src/components/HerbCompare.tsx:151` - 比较视图拼音
- `src/store/index.ts:127` - 搜索过滤

### functions

- `src/components/HerbCard.tsx:135-136` - 卡片显示前2个功效
- `src/components/HerbDetail.tsx:179` - 详情页功效列表
- `src/components/HerbCompare.tsx:53,182-189,273` - 比较视图功效分析
- `src/store/index.ts:129` - 搜索过滤
- `src/types/index.ts:414` - 专业等级计算

### nature

- `src/components/HerbCard.tsx:20,82` - 卡片主题和显示
- `src/components/HerbDetail.tsx:23,31,112` - 详情页主题和显示
- `src/components/SearchAndFilters.tsx:12` - 过滤器选项
- `src/store/index.ts:141` - 性味过滤
- `src/components/HerbGallery.tsx:34` - 排序功能

### taste

- `src/components/HerbCard.tsx:118-125` - 卡片显示前3个性味
- `src/components/HerbDetail.tsx:124` - 详情页性味列表
- `src/components/SearchAndFilters.tsx:13` - 过滤器选项
- `src/store/index.ts:145` - 性味过滤

### origin

- `src/components/HerbCard.tsx:54,141-146` - 卡片产地显示
- `src/components/HerbDetail.tsx:221,233` - 详情页产地列表
- `src/components/ChinaMap.tsx:193-194` - 地图数据处理
- `src/components/OriginMap.tsx:18-19` - 产地地图组件
- `src/store/index.ts:158,213` - 产地过滤和统计

### category

- `src/components/HerbCard.tsx:85` - 卡片类别显示
- `src/components/HerbDetail.tsx:31,116` - 详情页类别和相关推荐
- `src/components/SearchAndFilters.tsx:11` - 过滤器选项
- `src/store/index.ts:136,212` - 类别过滤和统计
- `src/components/HerbGallery.tsx:31` - 排序功能

### indications

- `src/components/HerbDetail.tsx:206` - 详情页适应症列表
- `src/components/HerbCompare.tsx:54` - 比较视图适应症提取
- `src/store/index.ts:130` - 搜索过滤

### primaryImage

- `src/components/HerbCard.tsx:67` - 卡片主图
- `src/components/HerbDetail.tsx:80` - 详情页主图
- `src/components/HerbCompare.tsx:132` - 比较视图图片

### meridians

- `src/components/HerbDetail.tsx:246,258` - 详情页归经显示
- `src/components/SearchAndFilters.tsx:14` - 过滤器选项
- `src/store/index.ts:151` - 归经过滤
- `src/types/index.ts:415` - 专业等级计算

### dosage

- `src/components/EnhancedHerbDetail.tsx:127,131` - 增强详情页用量显示

### contraindications

- `src/components/HerbDetail.tsx:271,283` - 详情页禁忌症列表
- `src/components/EnhancedHerbDetail.tsx:137,145` - 增强详情页禁忌
- `src/types/index.ts:415` - 专业等级计算

## 未使用字段

以下字段在类型定义中存在，但在当前组件中未被使用：

- images
- processing
- compounds
- description
- detailedOrigins
- expertRecommendations
- clinicalApplication
- pharmacology
- qualityStandards

## v9.0 药典级字段（部分使用）

### 已使用

- **pharmacopoeiaInfo** - `src/components/EnhancedHerbDetail.tsx:160-195`
- **chemicalComponents** - `src/components/EnhancedHerbDetail.tsx:216-220`, `src/components/AdvancedSearch.tsx:80`
- **pharmacologicalActions** - `src/components/EnhancedHerbDetail.tsx:262-266`, `src/components/AdvancedSearch.tsx:87`

### 未使用

- qualityControl
- clinicalGuide
- resourceInfo
- modernResearch
- compatibilityInfo

## 迁移注意事项

1. **高频使用字段**（id, name, nature, category等）需要优先处理映射
2. **搜索相关字段**（name, pinyin, englishName, functions, indications）需要保证搜索功能正常
3. **显示相关字段**（primaryImage, nature, taste, origin）影响UI展示
4. **未使用字段**可以在后续版本中逐步实现或考虑移除
