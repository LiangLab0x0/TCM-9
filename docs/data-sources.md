# Data Sources Documentation

## Overview
This document records the reference sources used for creating the TCM demo data entities. All data is sourced from publicly available materials including pharmacopoeias, published formularies, and drug specifications.

## Sources by Entity Type

### Materials (药材)
- **Source**: Existing data from migration
- **Count**: 50 entities
- **Reference**: 中国药典2020年版一部 (Chinese Pharmacopoeia 2020 Edition, Part I)

### Slices (饮片)
- **Source**: Existing data from migration
- **Count**: 50 entities  
- **Reference**: 中药饮片炮制规范 (Chinese Medicine Decoction Pieces Processing Standards)

### Formulas (方剂)
- **Count**: 2 entities created
1. **黄芩汤 (Huangqin Tang)**
   - Source: 《伤寒论》张仲景 (Treatise on Cold Damage by Zhang Zhongjing)
   - Reference: 方剂学, 人民卫生出版社, 2016年版
   
2. **丹参饮 (Danshen Yin)**
   - Source: 《时方歌括》王泰林 (Contemporary Formula Compendium by Wang Tailin)
   - Reference: 中医方剂大辞典, 人民卫生出版社

### GranuleIngredients (配方颗粒成分)
- **Count**: 2 entities created
1. **白芍配方颗粒**
   - Reference: 《中药配方颗粒质量标准》国家药典委员会
   - Standards: 中国药典2020年版四部通则0213配方颗粒
   
2. **丹参配方颗粒**
   - Reference: 《中药配方颗粒质量标准》国家药典委员会
   - Manufacturing specs: 《中药提取物标准》中国医药科技出版社

### GranuleFormulas (配方颗粒处方)
- **Count**: 2 entities created
- **Reference**: 
  - 《中药配方颗粒临床应用指南》中华中医药学会
  - 《中医内科学》高等中医药院校规划教材

### PatentMedicines (中成药)
- **Count**: 2 entities created
1. **丹参滴丸**
   - Approval: 国药准字Z10950111
   - Reference: 天士力制药股份有限公司产品说明书
   - Clinical data: 《中成药临床应用指南》
   
2. **清热解毒口服液**
   - Approval: 国药准字Z20063832
   - Reference: 江西济民可信药业有限公司产品说明书
   - Standards: 《中华人民共和国药典临床用药须知》

## Data Authenticity Notes

1. All chemical composition data (active components, marker compounds) are based on published pharmacopoeia standards
2. Manufacturing parameters for granules follow industry standard practices as outlined in official guidelines
3. Clinical indications and contraindications are derived from approved drug labels and clinical guidelines
4. Dosage recommendations follow standard TCM prescribing practices
5. Quality control standards reference official testing methods from the Chinese Pharmacopoeia

## Disclaimer

This data is for demonstration purposes only. While based on real sources, specific values may be simplified or generalized. For actual clinical or commercial use, always refer to the latest official pharmacopoeia and drug specifications.