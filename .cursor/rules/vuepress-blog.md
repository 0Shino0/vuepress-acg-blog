# ACG Blog - VuePress 项目开发规范

## 一、项目概述

本项目是基于 VuePress 2 (v2.0.0-rc.20) 构建的博客系统，采用"继承默认主题 + 自定义布局"的扩展方式。

### 技术栈
- **VuePress**: 2.0.0-rc.20
- **主题**: @vuepress/theme-default (默认主题扩展)
- **插件**: @vuepress/plugin-blog (博客功能核心)
- **打包器**: @vuepress/bundler-vite (Vite)
- **样式**: SCSS (sass-embedded)

### 项目结构
```
acg-blog/
├── docs/                          # 文档根目录（网站内容）
│   ├── .vuepress/                 # VuePress 配置目录
│   │   ├── components/            # 自定义 Vue 组件
│   │   │   └── ArticleList.vue    # 文章列表组件
│   │   ├── layouts/               # 自定义布局组件
│   │   │   ├── Article.vue        # 文章列表页布局
│   │   │   ├── Category.vue       # 分类页布局
│   │   │   ├── Tag.vue            # 标签页布局
│   │   │   └── Timeline.vue       # 时间线页布局
│   │   ├── client.js              # 客户端配置文件
│   │   └── config.js              # 站点主配置文件
│   ├── posts/                     # 博客文章目录
│   │   ├── article1.md
│   │   ├── sticky.md              # 置顶文章示例
│   │   └── archive1.md            # 归档文章示例
│   ├── README.md                  # 首页
│   └── get-started.md             # 入门指南页面
├── package.json
└── node_modules/
```

---

## 二、强制代码注释规范

### 2.1 注释总体原则
- 注释必须清晰、准确、简洁、有用，与代码逻辑完全一致
- 注释只描述意图与目的，不描述语法或显而易见的实现细节
- 禁止废话注释，禁止逐行注释，禁止重复代码语义
- 代码修改时，注释必须同步更新，禁止注释与代码不一致
- 注释风格统一，使用标准 JavaScript/Vue 注释规范，保持格式整齐

### 2.2 Vue 单文件组件注释规范

#### 模板部分 (template)
```vue
<!--
  布局组件：文章列表页
  功能：展示博客文章列表，支持从父布局继承导航栏和侧边栏
  使用场景：博客文章列表页面
  @author: yy
  @date: 2026-04-11
-->
<template>
  <!-- 继承默认主题的 Layout 布局，复用导航和侧边栏 -->
  <ParentLayout>
    <!-- page 插槽：覆盖默认页面内容区域 -->
    <template #page>
      <main class="page">
        <!-- 文章列表组件，展示过滤后的文章 -->
        <ArticleList :items="articles.items" />
      </main>
    </template>
  </ParentLayout>
</template>
```

#### 脚本部分 (script setup)
```javascript
/**
 * 分类页布局组件
 * 
 * 核心职责：
 * 1. 展示所有文章分类标签
 * 2. 根据当前路由显示对应分类的文章列表
 * 3. 继承默认主题的 Layout 布局保持一致性
 * 
 * 业务逻辑：
 * - 使用 useBlogCategory 获取分类映射数据
 * - 使用 useRoutePath 获取当前路由路径用于高亮当前分类
 * - 通过 RouteLink 实现分类导航
 * 
 * @author: yy
 * @date: 2026-04-11
 */
<script setup>
import { useBlogCategory } from '@vuepress/plugin-blog/client'
import ParentLayout from '@vuepress/theme-default/layouts/Layout.vue'
import { RouteLink, useRoutePath } from 'vuepress/client'
import ArticleList from '../components/ArticleList.vue'

// 获取全部分类映射（key: 分类名, value: { items, path }）
const categoryMap = useBlogCategory('category')

// 当前路由路径，用于判断哪个分类处于激活状态
const routePath = useRoutePath()
</script>
```

#### 样式部分 (style)
```scss
/**
 * 分类页面样式
 * 
 * 设计说明：
 * - 使用主题默认的 mixins.content-wrapper 保证与主题一致的宽度约束
 * - 顶部padding预留导航栏高度 + 间距
 * - 分类标签采用弹性布局，支持响应式换行
 */
<style lang="scss">
@use '@vuepress/theme-default/styles/mixins';

// 分类标签容器：弹性布局，支持换行
.category-wrapper {
  @include mixins.content-wrapper;
  padding-top: calc(var(--navbar-height) + 1rem) !important;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 1rem;
  padding-bottom: 0;
  // ... 更多样式
}
</style>
```

### 2.3 配置文件注释规范

#### config.js 主配置
```javascript
/**
 * VuePress 站点主配置文件
 * 
 * 核心配置职责：
 * 1. 站点基础信息（语言、标题、描述）
 * 2. 主题配置（导航栏、Logo 等）
 * 3. 博客插件配置（分类、标签、文章类型、排序等）
 * 4. 打包器配置（Vite）
 * 
 * 博客功能设计：
 * - 文章过滤：仅处理 posts/ 目录下文件
 * - 元数据提取：标题、作者、日期、分类、标签、摘要
 * - 分类系统：category（多对多）、tag（多对多）
 * - 文章类型：article（普通文章）、timeline（时间线）
 * - 排序规则：置顶优先，然后按日期倒序
 * 
 * @author: yy
 * @date: 2026-04-11
 */
import { blogPlugin } from '@vuepress/plugin-blog'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'

export default defineUserConfig({
  // 站点语言设置
  lang: 'en-US',
  
  // 站点标题（显示在导航栏和浏览器标签）
  title: 'VuePress',
  
  // 站点描述（用于 SEO）
  description: 'My first VuePress Site',

  // 主题配置：继承默认主题并进行扩展
  theme: defaultTheme({
    // 导航栏 Logo 图片
    logo: 'https://vuejs.press/images/hero.png',
    
    // 导航栏链接配置
    navbar: [
      '/',
      { text: 'Article', link: '/article/' },
      { text: 'Category', link: '/category/' },
      { text: 'Tag', link: '/tag/' },
      { text: 'Timeline', link: '/timeline/' },
    ],
  }),

  // 插件配置：博客功能核心
  plugins: [
    blogPlugin({
      // 文章过滤规则：只处理 posts/ 目录下的 Markdown 文件
      filter: ({ filePathRelative }) =>
        filePathRelative ? filePathRelative.startsWith('posts/') : false,

      // 提取文章元数据，用于列表展示和排序
      getInfo: ({ frontmatter, title, data }) => ({
        title,
        author: frontmatter.author || '',
        date: frontmatter.date || null,
        category: frontmatter.category || [],
        tag: frontmatter.tag || [],
        excerpt: typeof frontmatter.excerpt === 'string'
          ? frontmatter.excerpt
          : data?.excerpt || '',
      }),

      // 分类配置：支持 category 和 tag 两种分类维度
      category: [
        {
          key: 'category',                          // 分类标识
          getter: (page) => page.frontmatter.category || [],  // 数据来源
          layout: 'Category',                       // 分类首页布局
          itemLayout: 'Category',                   // 分类详情页布局
        },
        {
          key: 'tag',
          getter: (page) => page.frontmatter.tag || [],
          layout: 'Tag',
          itemLayout: 'Tag',
        },
      ],

      // 文章类型配置：定义不同的文章集合
      type: [
        {
          key: 'article',
          filter: (page) => !page.frontmatter.archive,  // 排除归档文章
          layout: 'Article',
          // 排序逻辑：置顶优先，然后按日期倒序
          sorter: (pageA, pageB) => {
            if (pageA.frontmatter.sticky && pageB.frontmatter.sticky)
              return pageB.frontmatter.sticky - pageA.frontmatter.sticky
            if (pageA.frontmatter.sticky && !pageB.frontmatter.sticky)
              return -1
            if (!pageA.frontmatter.sticky && pageB.frontmatter.sticky)
              return 1
            if (!pageB.frontmatter.date) return 1
            if (!pageA.frontmatter.date) return -1
            return new Date(pageB.frontmatter.date).getTime() - new Date(pageA.frontmatter.date).getTime()
          },
        },
        {
          key: 'timeline',
          filter: (page) => page.frontmatter.date instanceof Date,  // 必须有日期
          layout: 'Timeline',
        },
      ],
      
      // 开发模式启用热重载
      hotReload: true,
    }),
  ],

  // 打包器配置：使用 Vite
  bundler: viteBundler(),
})
```

#### client.js 客户端配置
```javascript
/**
 * VuePress 客户端配置文件
 * 
 * 核心职责：注册自定义布局组件，使其可在 Markdown 的 frontmatter 中使用
 * 
 * 布局说明：
 * - Article: 文章列表页布局，展示所有博客文章
 * - Category: 分类页布局，展示分类标签和对应文章
 * - Tag: 标签页布局，展示标签云和对应文章
 * - Timeline: 时间线页布局，按时间顺序展示文章
 * 
 * 设计模式：通过 defineClientConfig 声明式注册，VuePress 会自动处理组件加载
 * 
 * @author: yy
 * @date: 2026-04-11
 */
import { defineClientConfig } from 'vuepress/client'
import Article from './layouts/Article.vue'
import Category from './layouts/Category.vue'
import Tag from './layouts/Tag.vue'
import Timeline from './layouts/Timeline.vue'

export default defineClientConfig({
  // 注册博客专用布局，键名为布局标识，在 frontmatter 的 layout 字段中使用
  layouts: {
    Article,      // layout: Article
    Category,     // layout: Category
    Tag,          // layout: Tag
    Timeline,     // layout: Timeline
  },
})
```

### 2.4 组件注释规范

```javascript
/**
 * 文章列表组件
 * 
 * 核心职责：统一展示文章列表，支持普通列表和时间线两种模式
 * 
 * 功能特性：
 * - 展示文章标题、作者、日期、分类、标签、摘要
 * - 支持点击跳转至文章详情页
 * - 时间线模式在标题前显示日期前缀
 * - 空列表时显示友好提示
 * 
 * @param {Array} items - 文章列表数据，每项包含 info 和 path
 * @param {boolean} isTimeline - 是否为时间线模式，控制日期显示方式
 * @author: yy
 * @date: 2026-04-11
 */
<script setup>
defineProps({
  items: { type: Array, required: true },
  isTimeline: Boolean,
})
</script>
```

---

## 三、开发规范

### 3.1 文件组织原则

#### 目录职责
| 目录 | 职责 | 文件类型 |
|------|------|----------|
| `docs/.vuepress/components/` | 可复用 Vue 组件 | `.vue` 单文件组件 |
| `docs/.vuepress/layouts/` | 页面布局组件 | `.vue` 布局组件 |
| `docs/.vuepress/` | 配置文件 | `config.js`, `client.js` |
| `docs/posts/` | 博客文章 | `.md` Markdown 文件 |
| `docs/` | 独立页面 | `.md` Markdown 文件 |

#### 命名规范
- **组件文件**: PascalCase (如 `ArticleList.vue`, `Category.vue`)
- **配置文件**: camelCase (如 `config.js`, `client.js`)
- **Markdown 文件**: kebab-case (如 `get-started.md`)
- **目录名**: kebab-case (如 `.vuepress/`, `posts/`)

### 3.2 Vue 组件开发规范

#### 布局组件模板
所有布局组件必须继承默认主题的 `Layout` 以保持一致性：

```vue
<script setup>
/**
 * 布局组件名称
 * 
 * 核心职责：...
 * 
 * @author: yy
 * @date: 2026-04-11
 */
import ParentLayout from '@vuepress/theme-default/layouts/Layout.vue'
// 其他导入...
</script>

<template>
  <!-- 继承默认主题布局，复用导航栏和侧边栏 -->
  <ParentLayout>
    <!-- 覆盖 page 插槽以自定义页面内容 -->
    <template #page>
      <main class="page">
        <!-- 页面内容 -->
      </main>
    </template>
  </ParentLayout>
</template>

<style lang="scss">
/**
 * 样式说明...
 */
@use '@vuepress/theme-default/styles/mixins';

// 内容容器：应用主题的内容宽度约束
.page {
  @include mixins.content-wrapper;
}
</style>
```

#### 组件导入顺序
1. Vue/VuePress 核心 API
2. 博客插件客户端 API
3. 主题布局
4. 本地组件

```javascript
import { defineClientConfig } from 'vuepress/client'           // 1. 核心
import { useBlogType } from '@vuepress/plugin-blog/client'      // 2. 插件
import ParentLayout from '@vuepress/theme-default/layouts/Layout.vue'  // 3. 主题
import ArticleList from '../components/ArticleList.vue'         // 4. 本地
```

### 3.3 Markdown 文章规范

#### Frontmatter 字段
```yaml
---
# 基本信息
title: 文章标题           # 文章标题（可选，默认使用一级标题）
date: 2022-01-01        # 发布日期（ISO 8601 格式）
author: 作者名           # 作者名称

# 分类（数组，支持多分类）
category:
  - Category A
  - Category B

# 标签（数组，支持多标签）
tag:
  - tag A
  - tag B

# 博客特性
sticky: true            # 置顶文章（数字越大优先级越高）
archive: true           # 归档文章（不会出现在文章列表）
excerpt: <p>摘要内容</p> # 自定义摘要（支持 HTML）

# 布局（覆盖默认布局）
layout: Article
---
```

#### 文章模板
```markdown
---
date: 2022-01-01
category:
  - Category A
tag:
  - tag A
  - tag B
---

# 文章标题

## 章节标题

正文内容...

### 小节标题

更多内容...
```

---

## 四、常用 API 参考

### 4.1 博客插件客户端 API

| API | 用途 | 返回值 |
|-----|------|--------|
| `useBlogType(key)` | 获取文章类型数据 | `{ items, type }` |
| `useBlogCategory(key)` | 获取分类数据 | `{ map, currentItems }` |
| `useBlogFrontmatter()` | 获取 Frontmatter 数据 | 对象 |

### 4.2 VuePress 客户端 API

| API | 用途 | 导入路径 |
|-----|------|----------|
| `useRoutePath()` | 获取当前路由路径 | `vuepress/client` |
| `RouteLink` | 路由链接组件 | `vuepress/client` |
| `defineClientConfig()` | 定义客户端配置 | `vuepress/client` |

### 4.3 默认主题 Mixins

```scss
@use '@vuepress/theme-default/styles/mixins';

// 内容容器：应用主题的宽度约束和水平内边距
@include mixins.content-wrapper;

// 水平内边距
@include mixins.horizontal-wrapper;
```

---

## 五、脚本命令

```json
{
  "docs:dev": "vuepress dev docs",           // 启动开发服务器
  "docs:clean-dev": "vuepress dev docs --clean-cache",  // 清除缓存后启动
  "docs:build": "vuepress build docs",       // 构建生产环境
  "docs:update-package": "pnpm dlx vp-update" // 更新 VuePress 包
}
```

---

## 六、注意事项

### 6.1 热重载
博客插件已启用 `hotReload: true`，开发模式下修改文章或配置会自动刷新。

### 6.2 缓存清理
当遇到构建异常或配置未生效时，使用 `docs:clean-dev` 清除缓存。

### 6.3 主题继承
- 布局组件必须导入 `ParentLayout` 并包裹内容
- 样式优先使用主题提供的 CSS 变量和 mixins
- 自定义样式放在 `<style lang="scss">` 中，使用 `@use` 导入主题样式

### 6.4 文章管理
- 所有博客文章放在 `docs/posts/` 目录
- 首页和其他独立页面放在 `docs/` 根目录
- 通过 Frontmatter 控制文章的分类、标签、置顶等属性
