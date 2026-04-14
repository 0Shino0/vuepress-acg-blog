# 🌸 ACG Dream - 萌系动漫博客动效站

## 项目概述

这是一个基于 VuePress 2 打造的极致萌系动漫风格博客，集成了 GSAP、Motion One、Rive、Spline、WebGL Shader 六大顶级动效库，实现了 Scroll-driven storytelling 的叙事级动效体验。

## ✨ 核心特性

### 🎨 萌系设计系统 (Pastel Dream)

- **色彩方案**：樱花粉 `#FFB6C1`、薰衣草紫 `#E6E6FA`、阳光金 `#FFD700`、奶油白 `#FFF5F7`
- **圆角系统**：12px/20px/32px/48px 萌系圆角
- **动效曲线**：弹性曲线 `cubic-bezier(0.68, -0.55, 0.265, 1.55)` 营造可爱弹跳效果

### 🌊 WebGL Shader 特效

- **流体背景**：Simplex Noise 算法生成的粉色渐变流体动画
- **粒子系统**：40 个樱花花瓣的飘落效果，支持鼠标交互
- **爱心爆炸**：Canvas 实现的点赞粒子爆炸效果

### 🎭 GSAP 动画引擎

- **ScrollTrigger**：滚动驱动的叙事动画
- **弹跳入场**：标题文字逐字弹跳入场
- **交错动画**：文章卡片网格的 stagger 延迟入场
- **数字滚动**：统计数字的 count-up 动画

### 🎮 互动组件

- **Rive 吉祥物**：可交互的萌系角色，支持多状态切换（idle/happy/surprised/excited/love）
- **阅读进度条**：彩虹渐变 + 章节导航
- **悬浮目录**：自动提取文章标题，点击跳转
- **萌系按钮**：弹性悬浮 + 波纹动画 + 加载状态

## 📁 项目结构

```
docs/.vuepress/
├── components/
│   ├── effects/
│   │   ├── LiquidBackground.vue    # WebGL 流体背景
│   │   ├── ParticleField.vue       # 樱花粒子系统
│   │   └── ParticleHeart.vue       # 爱心爆炸效果
│   ├── ui/
│   │   ├── MoeButton.vue           # 萌系动画按钮
│   │   └── MoeCard.vue             # 萌系浮动卡片
│   ├── rive/
│   │   └── RiveMascot.vue          # 互动吉祥物
│   ├── ArticleList.vue             # 文章列表（已有）
│   ├── MoeArticleCard.vue          # 萌系文章卡片
│   ├── ArticleProgress.vue         # 阅读进度条
│   └── ArticleReactions.vue        # 文章互动（扩展）
├── composables/
│   ├── useGsap.ts                  # GSAP 动画封装
│   └── usePerformance.ts           # 性能优化工具
├── layouts/
│   ├── Article.vue                 # 文章列表布局（已有）
│   ├── ArticleDetail.vue           # 文章详情布局（全新）
│   ├── Category.vue                # 分类布局（已有）
│   ├── Home.vue                    # 萌系首页布局（全新）
│   ├── Tag.vue                     # 标签布局（已有）
│   └── Timeline.vue                # 时间线布局（已有）
├── styles/
│   ├── config.scss                 # CSS 变量定义
│   └── index.scss                  # 全局萌系样式
├── client.js                       # 客户端配置（已更新）
└── config.js                       # 站点配置（已更新）
```

## 🚀 技术栈

### 核心依赖

```json
{
  "gsap": "^3.14.2",              // 动画引擎
  "@vueuse/motion": "^3.0.3",      // Vue 动效组合式函数
  "three": "^0.183.2",              // WebGL 3D 渲染
  "@rive-app/canvas": "^2.37.1",   // 互动插画
  "lottie-web": "^5.13.0",          // JSON 动画
  "@splinetool/runtime": "^1.12.81" // 3D 场景
}
```

### 已有依赖

- `@vuepress/bundler-vite`: 2.0.0-rc.20
- `@vuepress/plugin-blog`: 2.0.0-rc.86
- `@vuepress/theme-default`: 2.0.0-rc.88
- `sass-embedded`: ^1.86.0

## 🎯 页面效果

### 首页 (Home.vue)

1. **全屏 Hero 区**：
   - WebGL 流体渐变背景（粉色/紫色）
   - 樱花飘落粒子效果
   - GSAP 标题弹跳入场
   - Spline 3D 角色展示（带后备方案）
   - 向下滚动提示动画

2. **介绍区**：
   - 浮动萌系卡片
   - 打字机效果文字
   - 数字滚动统计

3. **精选文章区**：
   - 萌系文章卡片网格
   - ScrollTrigger 交错入场
   - Hover 弹性缩放效果

4. **分类导航**：
   - 轨道式布局
   - 弹跳入场动画

### 文章详情页 (ArticleDetail.vue)

1. **头图区域**：
   - 全屏渐变背景
   - GSAP 标题动画
   - 返回按钮

2. **阅读进度条**：
   - 彩虹渐变
   - 章节高亮
   - 百分比显示

3. **悬浮目录**：
   - 自动提取文章标题
   - 平滑滚动跳转
   - 当前章节高亮

4. **文章内容**：
   - 段落淡入显现
   - 代码块高亮
   - 引用块样式

5. **互动区域**：
   - 爱心粒子爆炸点赞
   - 社交分享按钮
   - Rive 吉祥物

6. **导航**：
   - 上一篇/下一篇

## 📱 响应式适配

- **移动端降级**：小屏幕简化动效
- **性能检测**：根据设备性能自动降级
- **触摸优化**：替换 Hover 为点击效果
- **减少动画**：支持 `prefers-reduced-motion`

## 🔧 使用方法

### 启动开发服务器

```bash
pnpm docs:dev
```

### 构建生产版本

```bash
pnpm docs:build
```

### 文章 Frontmatter

```yaml
---
layout: ArticleDetail    # 使用新的详情页布局
title: 文章标题
date: 2026-04-11
author: 作者名
category:
  - 分类A
  - 分类B
tag:
  - 标签1
  - 标签2
sticky: 10              # 置顶优先级
excerpt: <p>摘要内容</p>
---
```

## 🎨 自定义主题

### CSS 变量

在 `docs/.vuepress/styles/config.scss` 中修改：

```scss
:root {
  --moe-primary: #FFB6C1;           // 樱花粉
  --moe-secondary: #E6E6FA;         // 薰衣草紫
  --moe-accent: #FFD700;            // 阳光金
  --moe-bg-primary: #FFF5F7;        // 奶油白
  --moe-text-primary: #5D4E6D;      // 柔和深紫灰
}
```

### 粒子效果配置

```vue
<ParticleField 
  type="sakura"        // sakura | star | heart | bubble | snow
  :count="40"         // 粒子数量
  :speed="0.6"         // 速度
  :opacity="0.7"       // 不透明度
  interactive           // 启用鼠标交互
/>
```

### 流体背景配置

```vue
<LiquidBackground 
  :intensity="1.2"     // 噪声强度
  :speed="0.3"         // 动画速度
  :opacity="0.6"       // 不透明度
  :colors="['#FFB6C1', '#E6E6FA', '#FFD1DC']"
/>
```

## 📦 部署

构建后的静态文件位于 `docs/.vuepress/dist/`，可以部署到任何静态托管服务：

- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

## 📝 注意事项

1. **Spline 3D**：需要替换为自己的 Spline 场景 URL，或者使用提供的后备 CSS 动画
2. **Rive 文件**：需要准备 `.riv` 格式的动画文件放到 `public/rive/` 目录
3. **Lottie 动画**：可以将 JSON 动画文件放到 `public/lottie/` 目录
4. **性能优化**：WebGL 效果在移动端会自动降级

## 🎉 效果预览

### 首页滚动体验

1. 进入页面：流体粉色背景缓慢流动，3D 角色在中央旋转
2. 滚动触发：标题文字逐个弹跳出现，樱花粒子飘落
3. 文章区：卡片像浮在水面一样轻轻晃动
4. 底栏：萌系页脚 + 粒子雨

### 文章页阅读体验

1. 头图：Shader 扭曲渐变背景，标题打字机效果
2. 滚动：顶部彩虹进度条填充，章节高亮
3. 互动：点击 Rive 吉祥物切换表情，点赞触发爱心爆炸
4. 图片：优雅的 hover 效果

## 图片展示

![首页1](https://shinoimg.yyshino.top/img/20260414203326.png)
![首页2](https://shinoimg.yyshino.top/img/20260414203326.png)

## 📄 许可证

MIT Licensed | Copyright © 2024-2026 ACG Dream

---

**Made with 💕 by ACG Dream**
