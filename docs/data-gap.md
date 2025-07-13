# Data Gap Analysis Report

## Current Status (2025-07-13)

### Existing Data

| Entity Type | Current Count | Data Location |
|-------------|---------------|---------------|
| Material (药材) | 50 | `/public/data/new-schema/materials.json` |
| Slice (饮片) | 50 | `/public/data/new-schema/slices.json` |
| Formula (方剂) | 0 | `/public/data/new-schema/formulas.json` (empty) |
| Granule (颗粒) | 0 | `/public/data/new-schema/granules.json` (empty) |
| Medicine (成药) | 0 | `/public/data/new-schema/medicines.json` (empty) |

### Missing Entities & Minimum Requirements

| Entity Type | Required Min | Suggested Examples | Cross-Chain Relations |
|-------------|--------------|-------------------|----------------------|
| **Plant (原植物)** | 2 | 黄芩 (Scutellaria baicalensis), 丹参 (Salvia miltiorrhiza) | → Link to Material |
| **Material (药材)** | 4 | 黄芩、丹参、甘草、连翘 | → Each has ≥1 Slice |
| **Slice (饮片)** | 4 | 炒黄芩片、酒黄芩片、生甘草片、炙甘草片 | → Link to GranuleIngredient |
| **GranuleIngredient (配方颗粒成分)** | 2 | 黄芩配方颗粒、丹参配方颗粒 | → Reference Slice |
| **GranuleFormula (配方颗粒)** | 2 | 清热解毒颗粒、活血化瘀颗粒 | → Contains GranuleIngredients |
| **PatentMedicine (中成药)** | 2 | 丹参滴丸, 清热解毒口服液 | → Reference Formula/GranuleFormula |
| **Formula (方剂)** | 2 | 黄芩汤, 丹参饮 | → Components include Slices |

### Data Structure Issues

1. **Plant Entity**: Not defined in current schema (`src/types/tcm-core.ts`)
2. **GranuleIngredient vs GranuleFormula**: Schema shows `GranuleIngredient extends BaseNode` but no `GranuleFormula` type
3. **Cross-references**: Need to establish proper ID relationships between entities

### Action Items

1. ✅ Materials and Slices already have sufficient data (50 each)
2. ❌ Need to add Plant entity type to schema
3. ❌ Need to populate Formula entities (minimum 2)
4. ❌ Need to populate Granule entities (minimum 2 each type)
5. ❌ Need to populate PatentMedicine entities (minimum 2)
6. ❌ Establish proper cross-chain relationships

### Data Sources Required

- 中国药典 (Chinese Pharmacopoeia) for standard formulations
- 药品说明书 (Drug specifications) for patent medicines
- 中药饮片炮制规范 (Processing standards) for slices
- 植物志 (Flora records) for plant taxonomy