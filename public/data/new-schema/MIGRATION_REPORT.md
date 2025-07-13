# 数据迁移报告

生成时间: 2025/7/13 01:46:14

## 数据统计

- 原始药材数: 50
- 生成药材(Materials): 50
- 生成饮片(Slices): 50
- 生成方剂(Formulas): 0
- 生成颗粒成分(GranuleIngredients): 0
- 生成颗粒处方(GranuleFormulas): 0
- 生成中成药(PatentMedicines): 0

## 文件列表

- materials.json (50 条记录)
- slices.json (50 条记录)
- formulas.json (0 条记录)
- granules.json (0 条记录)
- granuleFormulas.json (0 条记录)
- medicines.json (0 条记录)
- index.json (索引文件)
- relations.json (关系映射)

## 迁移规则

1. 每个Herb转换为一个Material
2. 如有炮制方法，每种方法生成一个Slice；否则生成默认生品Slice
3. 如有配伍信息，生成示例Formula
4. 产地信息映射到AuthenticRegion
5. 化学成分和药理作用保留原有数据结构

## 注意事项

- Material.names.latin 需要补充拉丁学名
- 部分字段可能需要人工审核和补充
- 建议运行JSON Schema验证确保数据完整性
