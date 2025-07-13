# TCM Knowledge Graph Gallery v9.0

中医药知识图谱画廊系统 - 工业级重构版本

## 项目概述

本项目是一个以"TCM专家 → 相关药材/方剂/研究"为中心的中医药知识图谱系统，提供专家信息展示、药材图鉴、知识图谱可视化等功能。

## 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS + shadcn/ui
- **状态管理**: Zustand
- **路由**: React Router v6
- **数据验证**: Zod
- **代码质量**: ESLint + Prettier + Husky

## 项目结构

```
src/
├── components/        # UI组件
│   ├── experts/      # 专家相关组件
│   ├── herbs/        # 药材相关组件
│   └── ui/           # 通用UI组件
├── core/             # 核心数据模型
│   ├── entities.ts   # 实体定义
│   └── validation.ts # 数据验证
├── store/            # 状态管理
│   ├── slices/       # 各领域切片
│   └── useAppStore.ts # 主Store
└── App.tsx           # 主应用入口
```

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 运行类型检查
pnpm typecheck

# 运行代码检查
pnpm lint

# 格式化代码
pnpm format
```

## 数据迁移

运行数据迁移脚本将旧数据转换为新格式：

```bash
pnpm tsx scripts/migrate-data.ts
```

## 路由结构

- `/` - 专家列表（首页）
- `/experts/:id` - 专家详情
- `/herbs` - 药材图鉴
- `/herbs/:id` - 药材详情
- `/graph` - 知识图谱

## 开发规范

1. 所有组件使用 TypeScript 严格类型
2. 遵循 ESLint 规则，提交前自动格式化
3. 组件命名使用 PascalCase
4. 文件命名使用 kebab-case
5. 使用 Conventional Commits 规范

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 部署指南

### Vercel 部署

1. 在 Vercel Dashboard 中导入项目
2. 设置构建命令：
   ```
   pnpm install --frozen-lockfile && pnpm build
   ```
3. 设置输出目录：`dist`
4. 环境变量：无需特殊配置

### pnpm v10 构建脚本白名单说明

本项目使用 pnpm v10，已在 `package.json` 中配置了构建脚本白名单：

```json
{
  "pnpm": {
    "onlyBuiltDependencies": [
      "esbuild",
      "@swc/core", 
      "sharp"
    ]
  }
}
```

这确保了在 CI/CD 环境中（包括 Vercel）不会出现 "Ignored build scripts" 警告。

### 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 运行测试
pnpm test

# 构建生产版本
pnpm build
```

## License

MIT
