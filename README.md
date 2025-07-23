# 🐢 海龟汤猜谜游戏

一个基于Web的文字推理游戏平台，用户通过与AI主持人对话来猜测谜题答案。

## ✨ 功能特点

- 🔐 **统一密码登录** - 简单的密码验证，无需注册
- 🎮 **多个游戏选择** - 精心设计的海龟汤推理题目
- 🤖 **AI智能交互** - 集成OpenAI GPT模型作为游戏主持人
- 📱 **响应式设计** - 完美支持手机端和桌面端
- 🎨 **现代化UI** - 深蓝橙色主题，营造神秘推理氛围

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
# 或
pnpm install
```

### 2. 配置环境变量（可选）

#### 前端配置
复制前端环境变量示例文件：
```bash
cp .env.example .env
```

#### 后端配置（推荐）
为了安全起见，API密钥现在配置在后端服务器中：
```bash
cp server/.env.example server/.env
```

编辑 `server/.env` 文件，添加你的OpenAI API密钥：
```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_BASE_URL=https://openrouter.ai/api/v1  # 使用OpenRouter
OPENAI_MODEL=openai/gpt-3.5-turbo
```

> **注意**：如果不配置API密钥，游戏将使用模拟回答模式，仍然可以正常游玩。

### 3. 启动开发服务器

```bash
npm run dev
# 或
pnpm dev
```

### 4. 访问游戏

打开浏览器访问 `http://localhost:8080`

**默认密码**：`turtle123`

## 🎯 游戏规则

### 什么是海龟汤？

海龟汤是一种推理游戏，玩家需要通过问是非问题来推断出一个看似不合理事件背后的真相。

### 如何游戏

1. **选择游戏** - 从游戏列表中选择一个感兴趣的故事
2. **提出问题** - 向AI主持人提出是非问题（只能回答是/否）
3. **逻辑推理** - 根据AI的回答，逐步缩小范围
4. **找出真相** - 通过推理找出事件的完整真相

### 提问技巧

- ✅ **正确示例**："他是男人吗？"、"有人死了吗？"、"这是意外吗？"
- ❌ **错误示例**："为什么会这样？"、"他叫什么名字？"

## 🛠️ 技术栈

### 前端
- **前端框架**：React 18 + TypeScript
- **构建工具**：Vite
- **样式方案**：Tailwind CSS
- **状态管理**：Zustand
- **路由管理**：React Router
- **图标库**：Lucide React
- **通知组件**：Sonner

### 后端
- **服务器框架**：Express.js
- **AI集成**：OpenAI SDK
- **跨域处理**：CORS
- **环境变量**：dotenv

## 📁 项目结构

```
├── src/                    # 前端源码
│   ├── components/         # 可复用组件
│   │   └── ProtectedRoute.tsx
│   ├── data/              # 游戏数据配置
│   │   └── games.json
│   ├── pages/             # 页面组件
│   │   ├── Login.tsx      # 登录页面
│   │   ├── GameList.tsx   # 游戏列表页面
│   │   └── GameChat.tsx   # 游戏聊天页面
│   ├── services/          # 服务层
│   │   └── openaiService.ts # 后端API服务
│   ├── store/             # 状态管理
│   │   └── gameStore.ts   # 游戏状态
│   ├── types/             # TypeScript类型定义
│   │   └── game.ts
│   └── App.tsx            # 主应用组件
├── server/                # 后端服务器
│   ├── index.js          # Express服务器
│   ├── .env.example      # 后端环境变量示例
│   └── .env              # 后端环境变量（需创建）
└── package.json          # 项目依赖配置
```

## 🎮 添加新游戏

编辑 `src/data/games.json` 文件，按以下格式添加新游戏：

```json
{
  "id": "game4",
  "title": "游戏标题",
  "description": "谜面描述",
  "answer": "完整的真相解释",
  "hints": [
    "提示1",
    "提示2",
    "提示3"
  ]
}
```

## 🔧 开发命令

```bash
# 启动开发服务器
npm run dev

# 类型检查
npm run check

# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 代码检查
npm run lint
```

## 🌐 部署

### 构建项目

```bash
npm run build
```

构建完成后，`dist` 目录包含所有静态文件，可以部署到任何静态文件服务器。

### 环境变量配置

#### 前端环境变量
- `VITE_API_BASE_URL` - 后端API地址（默认：http://localhost:3001）
- `VITE_GAME_PASSWORD` - 游戏登录密码（可选，默认为turtle123）

#### 后端环境变量（推荐配置）
- `OPENAI_API_KEY` - OpenAI/OpenRouter API密钥
- `OPENAI_BASE_URL` - API端点（OpenRouter: https://openrouter.ai/api/v1）
- `OPENAI_MODEL` - AI模型（如：openai/gpt-3.5-turbo）
- `PORT` - 服务器端口（默认：3001）

> **安全提示**：API密钥现在安全地存储在后端，不会暴露给前端用户。

## 📝 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

---

🐢 **享受推理的乐趣吧！**
