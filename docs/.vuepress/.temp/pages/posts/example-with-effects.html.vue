<template><div><h1 id="🌸-萌系动漫博客动效展示" tabindex="-1"><a class="header-anchor" href="#🌸-萌系动漫博客动效展示"><span>🌸 萌系动漫博客动效展示</span></a></h1>
<p>欢迎来到 <strong>ACG Dream</strong> 萌系动漫博客的技术分享文章。在这篇文章中，我们将探索如何使用 VuePress 2 打造极致的萌系动漫博客，集成多种顶级动效技术。</p>
<h2 id="✨-技术栈概览" tabindex="-1"><a class="header-anchor" href="#✨-技术栈概览"><span>✨ 技术栈概览</span></a></h2>
<p>我们的博客采用了以下技术栈：</p>
<h3 id="基础框架" tabindex="-1"><a class="header-anchor" href="#基础框架"><span>基础框架</span></a></h3>
<ul>
<li><strong>VuePress 2</strong> - 静态网站生成器</li>
<li><strong>Vue 3</strong> - Composition API</li>
<li><strong>Vite</strong> - 构建工具</li>
</ul>
<h3 id="动效引擎" tabindex="-1"><a class="header-anchor" href="#动效引擎"><span>动效引擎</span></a></h3>
<ul>
<li><strong>GSAP + ScrollTrigger</strong> - 页面滚动叙事、时间线控制</li>
<li><strong>Motion One (@vueuse/motion)</strong> - Vue 组件级微动效、手势交互</li>
<li><strong>Three.js</strong> - WebGL 3D 渲染</li>
</ul>
<h3 id="视觉特效" tabindex="-1"><a class="header-anchor" href="#视觉特效"><span>视觉特效</span></a></h3>
<ul>
<li><strong>Spline</strong> - 首页 3D 动漫角色展示</li>
<li><strong>Rive</strong> - 可交互的萌系角色动画</li>
<li><strong>Lottie</strong> - UI 图标、加载动画</li>
<li><strong>WebGL Shader</strong> - 流体背景、粒子系统</li>
</ul>
<h2 id="🎨-萌系设计系统" tabindex="-1"><a class="header-anchor" href="#🎨-萌系设计系统"><span>🎨 萌系设计系统</span></a></h2>
<h3 id="色彩方案-pastel-dream" tabindex="-1"><a class="header-anchor" href="#色彩方案-pastel-dream"><span>色彩方案 (Pastel Dream)</span></a></h3>
<p>我们精心设计的色彩方案：</p>
<table>
<thead>
<tr>
<th>颜色</th>
<th>色值</th>
<th>用途</th>
</tr>
</thead>
<tbody>
<tr>
<td>樱花粉</td>
<td><code v-pre>#FFB6C1</code></td>
<td>主色调、按钮、高亮</td>
</tr>
<tr>
<td>薰衣草紫</td>
<td><code v-pre>#E6E6FA</code></td>
<td>辅助色、渐变</td>
</tr>
<tr>
<td>阳光金</td>
<td><code v-pre>#FFD700</code></td>
<td>强调色、星星标记</td>
</tr>
<tr>
<td>奶油白</td>
<td><code v-pre>#FFF5F7</code></td>
<td>页面背景</td>
</tr>
<tr>
<td>柔和灰</td>
<td><code v-pre>#5D4E6D</code></td>
<td>正文文字</td>
</tr>
</tbody>
</table>
<h3 id="动效曲线" tabindex="-1"><a class="header-anchor" href="#动效曲线"><span>动效曲线</span></a></h3>
<p>我们使用了三种核心的动效曲线：</p>
<ol>
<li><strong>弹性曲线</strong> <code v-pre>cubic-bezier(0.68, -0.55, 0.265, 1.55)</code> - 可爱弹跳效果</li>
<li><strong>平滑曲线</strong> <code v-pre>cubic-bezier(0.4, 0, 0.2, 1)</code> - 标准过渡</li>
<li><strong>叙事曲线</strong> <code v-pre>cubic-bezier(0.16, 1, 0.3, 1)</code> - 优雅入场</li>
</ol>
<h2 id="🌊-webgl-shader-流体背景" tabindex="-1"><a class="header-anchor" href="#🌊-webgl-shader-流体背景"><span>🌊 WebGL Shader 流体背景</span></a></h2>
<p>首页的背景采用了自定义的 WebGL Shader 实现的流体动画效果。我们使用 Simplex Noise 算法生成了有机的流动图案，配合樱花粉到薰衣草紫的渐变色彩，营造出梦幻的氛围。</p>
<div class="language-glsl line-numbers-mode" data-highlighter="prismjs" data-ext="glsl"><pre v-pre><code><span class="line"><span class="token comment">// Fragment Shader 核心代码</span></span>
<span class="line"><span class="token keyword">float</span> noise1 <span class="token operator">=</span> <span class="token function">fbm</span><span class="token punctuation">(</span>uv <span class="token operator">*</span> <span class="token number">2.0</span> <span class="token operator">+</span> time <span class="token operator">*</span> <span class="token number">0.1</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">float</span> noise2 <span class="token operator">=</span> <span class="token function">fbm</span><span class="token punctuation">(</span>uv <span class="token operator">*</span> <span class="token number">3.0</span> <span class="token operator">-</span> time <span class="token operator">*</span> <span class="token number">0.15</span> <span class="token operator">+</span> <span class="token number">100.0</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">float</span> noise3 <span class="token operator">=</span> <span class="token function">fbm</span><span class="token punctuation">(</span>uv <span class="token operator">*</span> <span class="token number">1.5</span> <span class="token operator">+</span> time <span class="token operator">*</span> <span class="token number">0.08</span> <span class="token operator">+</span> <span class="token keyword">vec2</span><span class="token punctuation">(</span>noise1 <span class="token operator">*</span> <span class="token number">0.5</span><span class="token punctuation">,</span> noise2 <span class="token operator">*</span> <span class="token number">0.3</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="🌸-樱花粒子系统" tabindex="-1"><a class="header-anchor" href="#🌸-樱花粒子系统"><span>🌸 樱花粒子系统</span></a></h2>
<p>在背景层之上，我们添加了 Canvas 实现的樱花飘落粒子系统：</p>
<ul>
<li><strong>粒子数量</strong>：40 个樱花花瓣</li>
<li><strong>交互性</strong>：鼠标靠近时花瓣会轻微避开</li>
<li><strong>物理效果</strong>：重力、摇摆、旋转</li>
<li><strong>性能优化</strong>：使用 requestAnimationFrame 和对象池</li>
</ul>
<h2 id="🎭-gsap-scrolltrigger-滚动叙事" tabindex="-1"><a class="header-anchor" href="#🎭-gsap-scrolltrigger-滚动叙事"><span>🎭 GSAP ScrollTrigger 滚动叙事</span></a></h2>
<p>我们使用 GSAP 的 ScrollTrigger 插件实现了滚动驱动的叙事动画：</p>
<h3 id="标题弹跳入场" tabindex="-1"><a class="header-anchor" href="#标题弹跳入场"><span>标题弹跳入场</span></a></h3>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code><span class="line">gsap<span class="token punctuation">.</span><span class="token function">fromTo</span><span class="token punctuation">(</span></span>
<span class="line">  title<span class="token punctuation">.</span><span class="token function">querySelectorAll</span><span class="token punctuation">(</span><span class="token string">'.char'</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">{</span> <span class="token literal-property property">opacity</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token literal-property property">y</span><span class="token operator">:</span> <span class="token number">80</span><span class="token punctuation">,</span> <span class="token literal-property property">scale</span><span class="token operator">:</span> <span class="token number">0.5</span><span class="token punctuation">,</span> <span class="token literal-property property">rotateX</span><span class="token operator">:</span> <span class="token operator">-</span><span class="token number">90</span> <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">{</span></span>
<span class="line">    <span class="token literal-property property">opacity</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token literal-property property">y</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token literal-property property">scale</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token literal-property property">rotateX</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token literal-property property">duration</span><span class="token operator">:</span> <span class="token number">0.8</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token literal-property property">stagger</span><span class="token operator">:</span> <span class="token number">0.08</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token literal-property property">ease</span><span class="token operator">:</span> <span class="token string">'back.out(1.7)'</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token literal-property property">delay</span><span class="token operator">:</span> <span class="token number">0.5</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="文章卡片交错入场" tabindex="-1"><a class="header-anchor" href="#文章卡片交错入场"><span>文章卡片交错入场</span></a></h3>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code><span class="line">ScrollTrigger<span class="token punctuation">.</span><span class="token function">batch</span><span class="token punctuation">(</span>cards<span class="token punctuation">,</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token function-variable function">onEnter</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter">elements</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span></span>
<span class="line">    gsap<span class="token punctuation">.</span><span class="token function">to</span><span class="token punctuation">(</span>elements<span class="token punctuation">,</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">opacity</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token literal-property property">y</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token literal-property property">scale</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">duration</span><span class="token operator">:</span> <span class="token number">0.6</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">stagger</span><span class="token operator">:</span> <span class="token number">0.1</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">ease</span><span class="token operator">:</span> <span class="token string">'back.out(1.4)'</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token literal-property property">start</span><span class="token operator">:</span> <span class="token string">'top 85%'</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="🎨-rive-互动吉祥物" tabindex="-1"><a class="header-anchor" href="#🎨-rive-互动吉祥物"><span>🎨 Rive 互动吉祥物</span></a></h2>
<p>页面右下角有一个互动的 Rive 吉祥物，支持以下功能：</p>
<ul>
<li><strong>多状态动画</strong>：idle、happy、surprised、sleepy、excited、love</li>
<li><strong>点击切换</strong>：点击吉祥物切换不同的表情状态</li>
<li><strong>状态指示器</strong>：显示当前状态文字</li>
<li><strong>气泡效果</strong>：状态切换时会产生对应的气泡 emoji</li>
</ul>
<h2 id="💖-爱心粒子爆炸" tabindex="-1"><a class="header-anchor" href="#💖-爱心粒子爆炸"><span>💖 爱心粒子爆炸</span></a></h2>
<p>点赞按钮采用了 Canvas 实现的爱心粒子爆炸效果：</p>
<ul>
<li><strong>粒子发射</strong>：从点击位置向四周发射爱心</li>
<li><strong>物理模拟</strong>：重力、摩擦力、旋转</li>
<li><strong>生命周期</strong>：淡入淡出、自动清理</li>
<li><strong>多色爱心</strong>：8 种不同的粉色系颜色</li>
</ul>
<h2 id="📊-阅读进度条" tabindex="-1"><a class="header-anchor" href="#📊-阅读进度条"><span>📊 阅读进度条</span></a></h2>
<p>文章顶部有一个彩虹渐变的阅读进度条，功能包括：</p>
<ul>
<li><strong>进度计算</strong>：基于文章内容区域的滚动位置</li>
<li><strong>章节导航</strong>：显示文章大纲，点击可跳转到对应章节</li>
<li><strong>高亮当前章节</strong>：到达视口的章节会高亮显示</li>
<li><strong>百分比显示</strong>：实时显示阅读进度百分比</li>
</ul>
<h2 id="🎴-萌系文章卡片" tabindex="-1"><a class="header-anchor" href="#🎴-萌系文章卡片"><span>🎴 萌系文章卡片</span></a></h2>
<p>文章列表页面使用了精心设计的萌系卡片组件：</p>
<ul>
<li><strong>浮动动画</strong>：卡片像浮在水面一样轻轻晃动</li>
<li><strong>弹性缩放</strong>：Hover 时缩放 1.03 倍，使用弹簧曲线</li>
<li><strong>渐变叠加</strong>：封面图使用粉色系渐变</li>
<li><strong>置顶标识</strong>：置顶文章有脉冲动画的图钉标识</li>
<li><strong>角标装饰</strong>：分类标签带有弹跳动画</li>
</ul>
<h2 id="🧩-代码块展示" tabindex="-1"><a class="header-anchor" href="#🧩-代码块展示"><span>🧩 代码块展示</span></a></h2>
<p>当然，技术博客少不了代码块的高亮展示：</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code><span class="line"><span class="token comment">// 使用 Motion One 添加悬浮动效</span></span>
<span class="line"><span class="token keyword">const</span> <span class="token punctuation">{</span> variant <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">useMotion</span><span class="token punctuation">(</span>cardRef<span class="token punctuation">,</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token literal-property property">initial</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token literal-property property">scale</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token literal-property property">y</span><span class="token operator">:</span> <span class="token number">0</span> <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token literal-property property">hovered</span><span class="token operator">:</span> <span class="token punctuation">{</span> </span>
<span class="line">    <span class="token literal-property property">scale</span><span class="token operator">:</span> <span class="token number">1.03</span><span class="token punctuation">,</span> </span>
<span class="line">    <span class="token literal-property property">y</span><span class="token operator">:</span> <span class="token operator">-</span><span class="token number">8</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token literal-property property">transition</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">'spring'</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">stiffness</span><span class="token operator">:</span> <span class="token number">300</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">damping</span><span class="token operator">:</span> <span class="token number">20</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-css line-numbers-mode" data-highlighter="prismjs" data-ext="css"><pre v-pre><code><span class="line"><span class="token comment">/* 萌系按钮样式 */</span></span>
<span class="line"><span class="token selector">.moe-button</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">background</span><span class="token punctuation">:</span> <span class="token function">var</span><span class="token punctuation">(</span>--moe-gradient-primary<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token property">color</span><span class="token punctuation">:</span> <span class="token function">var</span><span class="token punctuation">(</span>--moe-text-light<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token property">box-shadow</span><span class="token punctuation">:</span> <span class="token function">var</span><span class="token punctuation">(</span>--moe-shadow-md<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token property">border-radius</span><span class="token punctuation">:</span> <span class="token function">var</span><span class="token punctuation">(</span>--moe-radius-full<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token property">transition</span><span class="token punctuation">:</span> all <span class="token function">var</span><span class="token punctuation">(</span>--moe-duration-normal<span class="token punctuation">)</span> <span class="token function">var</span><span class="token punctuation">(</span>--moe-ease-bounce<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token selector">.moe-button:hover</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">box-shadow</span><span class="token punctuation">:</span> <span class="token function">var</span><span class="token punctuation">(</span>--moe-shadow-hover<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token property">transform</span><span class="token punctuation">:</span> <span class="token function">translateY</span><span class="token punctuation">(</span>-2px<span class="token punctuation">)</span> <span class="token function">scale</span><span class="token punctuation">(</span>1.02<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="📱-响应式适配" tabindex="-1"><a class="header-anchor" href="#📱-响应式适配"><span>📱 响应式适配</span></a></h2>
<p>所有的动效和组件都经过了响应式适配：</p>
<ul>
<li><strong>移动端降级</strong>：在小屏幕上简化部分动效</li>
<li><strong>触摸优化</strong>：替换 Hover 效果为点击效果</li>
<li><strong>性能优化</strong>：移动端降低粒子数量</li>
<li><strong>布局调整</strong>：自适应的网格布局和字体大小</li>
</ul>
<h2 id="🎉-总结" tabindex="-1"><a class="header-anchor" href="#🎉-总结"><span>🎉 总结</span></a></h2>
<p>通过本文的介绍，我们展示了如何将 VuePress 2 打造成一个极致的萌系动漫博客。集成 GSAP、Spline、Rive、WebGL Shader 等顶级动效技术，实现了一个让人眼前一亮的博客标杆案例。</p>
<h3 id="核心亮点" tabindex="-1"><a class="header-anchor" href="#核心亮点"><span>核心亮点</span></a></h3>
<ol>
<li><strong>Scroll-driven storytelling</strong> - 滚动驱动的叙事体验</li>
<li><strong>WebGL 流体背景</strong> - 梦幻的粉色渐变流体动画</li>
<li><strong>樱花粒子系统</strong> - 氛围感十足的飘落效果</li>
<li><strong>GSAP 动画系统</strong> - 流畅的入场和交互动画</li>
<li><strong>Rive 互动角色</strong> - 可爱的吉祥物陪伴阅读</li>
<li><strong>爱心粒子爆炸</strong> - 有趣的点赞反馈效果</li>
</ol>
<h3 id="未来展望" tabindex="-1"><a class="header-anchor" href="#未来展望"><span>未来展望</span></a></h3>
<p>我们还会继续优化和扩展这个博客系统：</p>
<ul>
<li>更多 3D 场景和模型</li>
<li>更丰富的 Shader 效果</li>
<li>更多的互动元素</li>
<li>更好的性能优化</li>
<li>更多的主题色彩选择</li>
</ul>
<hr>
<p>感谢阅读！如果你喜欢这篇文章，记得点赞收藏哦 💕</p>
</div></template>


