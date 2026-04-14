---
layout: ArticleDetail
title: 🌸 萌系动漫博客动效展示 - VuePress 的极致体验
date: 2026-04-11
author: ACG Dream
category:
  - 技术分享
  - 动漫杂谈
tag:
  - VuePress
  - GSAP
  - WebGL
  - 萌系设计
sticky: 10
excerpt: <p>探索如何使用 VuePress 2 打造极致的萌系动漫博客，集成 GSAP、Spline、Rive、WebGL Shader 等顶级动效技术，实现 Scroll-driven storytelling 的叙事级体验。</p>
---

# 🌸 萌系动漫博客动效展示

欢迎来到 **ACG Dream** 萌系动漫博客的技术分享文章。在这篇文章中，我们将探索如何使用 VuePress 2 打造极致的萌系动漫博客，集成多种顶级动效技术。

## ✨ 技术栈概览

我们的博客采用了以下技术栈：

### 基础框架
- **VuePress 2** - 静态网站生成器
- **Vue 3** - Composition API
- **Vite** - 构建工具

### 动效引擎
- **GSAP + ScrollTrigger** - 页面滚动叙事、时间线控制
- **Motion One (@vueuse/motion)** - Vue 组件级微动效、手势交互
- **Three.js** - WebGL 3D 渲染

### 视觉特效
- **Spline** - 首页 3D 动漫角色展示
- **Rive** - 可交互的萌系角色动画
- **Lottie** - UI 图标、加载动画
- **WebGL Shader** - 流体背景、粒子系统

## 🎨 萌系设计系统

### 色彩方案 (Pastel Dream)

我们精心设计的色彩方案：

| 颜色 | 色值 | 用途 |
|------|------|------|
| 樱花粉 | `#FFB6C1` | 主色调、按钮、高亮 |
| 薰衣草紫 | `#E6E6FA` | 辅助色、渐变 |
| 阳光金 | `#FFD700` | 强调色、星星标记 |
| 奶油白 | `#FFF5F7` | 页面背景 |
| 柔和灰 | `#5D4E6D` | 正文文字 |

### 动效曲线

我们使用了三种核心的动效曲线：

1. **弹性曲线** `cubic-bezier(0.68, -0.55, 0.265, 1.55)` - 可爱弹跳效果
2. **平滑曲线** `cubic-bezier(0.4, 0, 0.2, 1)` - 标准过渡
3. **叙事曲线** `cubic-bezier(0.16, 1, 0.3, 1)` - 优雅入场

## 🌊 WebGL Shader 流体背景

首页的背景采用了自定义的 WebGL Shader 实现的流体动画效果。我们使用 Simplex Noise 算法生成了有机的流动图案，配合樱花粉到薰衣草紫的渐变色彩，营造出梦幻的氛围。

```glsl
// Fragment Shader 核心代码
float noise1 = fbm(uv * 2.0 + time * 0.1);
float noise2 = fbm(uv * 3.0 - time * 0.15 + 100.0);
float noise3 = fbm(uv * 1.5 + time * 0.08 + vec2(noise1 * 0.5, noise2 * 0.3));
```

## 🌸 樱花粒子系统

在背景层之上，我们添加了 Canvas 实现的樱花飘落粒子系统：

- **粒子数量**：40 个樱花花瓣
- **交互性**：鼠标靠近时花瓣会轻微避开
- **物理效果**：重力、摇摆、旋转
- **性能优化**：使用 requestAnimationFrame 和对象池

## 🎭 GSAP ScrollTrigger 滚动叙事

我们使用 GSAP 的 ScrollTrigger 插件实现了滚动驱动的叙事动画：

### 标题弹跳入场
```javascript
gsap.fromTo(
  title.querySelectorAll('.char'),
  { opacity: 0, y: 80, scale: 0.5, rotateX: -90 },
  {
    opacity: 1, y: 0, scale: 1, rotateX: 0,
    duration: 0.8,
    stagger: 0.08,
    ease: 'back.out(1.7)',
    delay: 0.5
  }
)
```

### 文章卡片交错入场
```javascript
ScrollTrigger.batch(cards, {
  onEnter: (elements) => {
    gsap.to(elements, {
      opacity: 1, y: 0, scale: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: 'back.out(1.4)'
    })
  },
  start: 'top 85%'
})
```

## 🎨 Rive 互动吉祥物

页面右下角有一个互动的 Rive 吉祥物，支持以下功能：

- **多状态动画**：idle、happy、surprised、sleepy、excited、love
- **点击切换**：点击吉祥物切换不同的表情状态
- **状态指示器**：显示当前状态文字
- **气泡效果**：状态切换时会产生对应的气泡 emoji

## 💖 爱心粒子爆炸

点赞按钮采用了 Canvas 实现的爱心粒子爆炸效果：

- **粒子发射**：从点击位置向四周发射爱心
- **物理模拟**：重力、摩擦力、旋转
- **生命周期**：淡入淡出、自动清理
- **多色爱心**：8 种不同的粉色系颜色

## 📊 阅读进度条

文章顶部有一个彩虹渐变的阅读进度条，功能包括：

- **进度计算**：基于文章内容区域的滚动位置
- **章节导航**：显示文章大纲，点击可跳转到对应章节
- **高亮当前章节**：到达视口的章节会高亮显示
- **百分比显示**：实时显示阅读进度百分比

## 🎴 萌系文章卡片

文章列表页面使用了精心设计的萌系卡片组件：

- **浮动动画**：卡片像浮在水面一样轻轻晃动
- **弹性缩放**：Hover 时缩放 1.03 倍，使用弹簧曲线
- **渐变叠加**：封面图使用粉色系渐变
- **置顶标识**：置顶文章有脉冲动画的图钉标识
- **角标装饰**：分类标签带有弹跳动画

## 🧩 代码块展示

当然，技术博客少不了代码块的高亮展示：

```javascript
// 使用 Motion One 添加悬浮动效
const { variant } = useMotion(cardRef, {
  initial: { scale: 1, y: 0 },
  hovered: { 
    scale: 1.03, 
    y: -8,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20
    }
  }
})
```

```css
/* 萌系按钮样式 */
.moe-button {
  background: var(--moe-gradient-primary);
  color: var(--moe-text-light);
  box-shadow: var(--moe-shadow-md);
  border-radius: var(--moe-radius-full);
  transition: all var(--moe-duration-normal) var(--moe-ease-bounce);
}

.moe-button:hover {
  box-shadow: var(--moe-shadow-hover);
  transform: translateY(-2px) scale(1.02);
}
```

## 📱 响应式适配

所有的动效和组件都经过了响应式适配：

- **移动端降级**：在小屏幕上简化部分动效
- **触摸优化**：替换 Hover 效果为点击效果
- **性能优化**：移动端降低粒子数量
- **布局调整**：自适应的网格布局和字体大小

## 🎉 总结

通过本文的介绍，我们展示了如何将 VuePress 2 打造成一个极致的萌系动漫博客。集成 GSAP、Spline、Rive、WebGL Shader 等顶级动效技术，实现了一个让人眼前一亮的博客标杆案例。

### 核心亮点

1. **Scroll-driven storytelling** - 滚动驱动的叙事体验
2. **WebGL 流体背景** - 梦幻的粉色渐变流体动画
3. **樱花粒子系统** - 氛围感十足的飘落效果
4. **GSAP 动画系统** - 流畅的入场和交互动画
5. **Rive 互动角色** - 可爱的吉祥物陪伴阅读
6. **爱心粒子爆炸** - 有趣的点赞反馈效果

### 未来展望

我们还会继续优化和扩展这个博客系统：

- 更多 3D 场景和模型
- 更丰富的 Shader 效果
- 更多的互动元素
- 更好的性能优化
- 更多的主题色彩选择

---

感谢阅读！如果你喜欢这篇文章，记得点赞收藏哦 💕
