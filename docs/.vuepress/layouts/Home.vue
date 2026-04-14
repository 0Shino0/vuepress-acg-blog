<!--
  萌系动漫博客首页布局
  
  核心功能：
  1. Hero 区 - 全屏沉浸式欢迎，包含 3D 场景和流体背景
  2. 介绍区 - 打字机效果的博客介绍
  3. 精选文章区 - 萌系卡片展示最新文章
  4. 分类导航 - 萌系风格快速导航
  
  动效集成：
  - LiquidBackground: WebGL 流体渐变背景
  - ParticleField: 樱花飘落粒子效果
  - Spline 3D: 可交互的 3D 动漫角色
  - GSAP ScrollTrigger: 滚动驱动的叙事动画
  
  @author: yy
  @date: 2026-04-11
-->
<template>
  <div class="moe-home">
    <!-- 全局背景效果层 -->
    <LiquidBackground 
      :intensity="1.2" 
      :speed="0.3"
      :opacity="0.6"
      :colors="['#FFB6C1', '#E6E6FA', '#FFD1DC', '#FFF0F5']"
    />
    
    <!-- 樱花粒子层 -->
    <ParticleField 
      type="sakura"
      :count="40"
      :speed="0.6"
      :opacity="0.7"
      interactive
    />
    
    <!-- Hero 区域 - 全屏欢迎 -->
    <section ref="heroSection" class="moe-hero">
      <div class="moe-hero__content">
        <!-- 3D Spline 场景容器 -->
        <div ref="splineContainer" class="moe-hero__spline">
          <canvas ref="splineCanvas" class="moe-hero__spline-canvas" />
          <div class="moe-hero__spline-fallback">
            <span class="moe-hero__emoji">🌸</span>
          </div>
        </div>
        
        <!-- 标题区 -->
        <div class="moe-hero__text">
          <h1 ref="heroTitle" class="moe-hero__title">
            {{ siteTitle }}
          </h1>
          <p ref="heroSubtitle" class="moe-hero__subtitle">
            {{ description }}
          </p>
          
          <!-- 快速行动按钮 -->
          <div class="moe-hero__actions">
            <MoeButton 
              variant="primary" 
              size="lg"
              rounded
              @click="scrollToArticles"
            >
              <span>✨ 开始阅读</span>
            </MoeButton>
            <MoeButton 
              variant="ghost" 
              size="lg"
              rounded
              @click="scrollToAbout"
            >
              <span>了解更多</span>
            </MoeButton>
          </div>
        </div>
      </div>
      
      <!-- 向下滚动提示 -->
      <div class="moe-hero__scroll-hint" @click="scrollToContent">
        <div class="moe-hero__mouse">
          <div class="moe-hero__mouse-wheel" />
        </div>
        <span class="moe-hero__scroll-text">向下滚动</span>
      </div>
    </section>
    
    <!-- 介绍区 -->
    <section ref="introSection" class="moe-intro">
      <div class="moe-container">
        <MoeCard 
          float
          :float-intensity="2"
          class="moe-intro__card"
        >
          <template #header>
            <h2 class="moe-intro__title">
              <span class="moe-text-gradient">欢迎来到梦幻世界</span>
            </h2>
          </template>
          
          <p ref="introText" class="moe-intro__text">
            {{ introContent }}
          </p>
          
          <template #footer>
            <div class="moe-intro__stats">
              <div class="moe-intro__stat">
                <span ref="statArticles" class="moe-intro__stat-number">0</span>
                <span class="moe-intro__stat-label">篇文章</span>
              </div>
              <div class="moe-intro__stat">
                <span ref="statCategories" class="moe-intro__stat-number">0</span>
                <span class="moe-intro__stat-label">个分类</span>
              </div>
              <div class="moe-intro__stat">
                <span ref="statTags" class="moe-intro__stat-number">0</span>
                <span class="moe-intro__stat-label">个标签</span>
              </div>
            </div>
          </template>
        </MoeCard>
      </div>
    </section>
    
    <!-- 精选文章区 -->
    <section ref="articlesSection" class="moe-articles">
      <div class="moe-container">
        <div class="moe-section-header">
          <h2 class="moe-section-title">
            <span class="moe-text-gradient">精选文章</span>
          </h2>
          <p class="moe-section-subtitle">探索最新的动漫资讯与思考</p>
        </div>
        
        <!-- 文章卡片网格 -->
        <div ref="articlesGrid" class="moe-articles__grid">
          <MoeArticleCard 
            v-for="(article, index) in featuredArticles"
            :key="article.path"
            :article="article"
            :index="index"
            @click="navigateToArticle(article.path)"
          />
        </div>
        
        <!-- 查看更多按钮 -->
        <div class="moe-articles__more">
          <MoeButton 
            variant="secondary" 
            size="lg"
            rounded
            @click="navigateToAllArticles"
          >
            <span>查看全部文章 →</span>
          </MoeButton>
        </div>
      </div>
    </section>
    
    <!-- 分类导航区 -->
    <section ref="categoriesSection" class="moe-categories">
      <div class="moe-container">
        <div class="moe-section-header">
          <h2 class="moe-section-title">
            <span class="moe-text-gradient">探索分类</span>
          </h2>
          <p class="moe-section-subtitle">发现你感兴趣的话题</p>
        </div>
        
        <!-- 分类轨道导航 -->
        <div ref="categoriesOrbit" class="moe-categories__orbit">
          <div 
            v-for="(category, index) in categories"
            :key="category.key"
            class="moe-categories__item"
            :style="getOrbitPosition(index, categories.length)"
            @click="navigateToCategory(category.path)"
          >
            <div class="moe-categories__icon">
              {{ category.icon }}
            </div>
            <span class="moe-categories__name">{{ category.name }}</span>
            <span class="moe-categories__count">{{ category.count }} 篇</span>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 页脚区 -->
    <footer class="moe-footer">
      <div class="moe-container">
        <div class="moe-footer__content">
          <div class="moe-footer__brand">
            <span class="moe-footer__logo">🌸</span>
            <span class="moe-footer__name">{{ siteTitle }}</span>
          </div>
          <p class="moe-footer__desc">用萌系风格记录动漫世界的美好</p>
          <div class="moe-footer__links">
            <a 
              v-for="link in footerLinks" 
              :key="link.text"
              :href="link.url"
              class="moe-footer__link"
            >
              {{ link.text }}
            </a>
          </div>
        </div>
        <div class="moe-footer__copyright">
          © {{ currentYear }} {{ siteTitle }}. Made with 💕
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vuepress/client'
import { useBlogType, useBlogCategory } from '@vuepress/plugin-blog/client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Application } from '@splinetool/runtime'

// 导入组件
import LiquidBackground from '../components/effects/LiquidBackground.vue'
import ParticleField from '../components/effects/ParticleField.vue'
import MoeButton from '../components/ui/MoeButton.vue'
import MoeCard from '../components/ui/MoeCard.vue'
import MoeArticleCard from '../components/MoeArticleCard.vue'

// 注册 GSAP 插件
gsap.registerPlugin(ScrollTrigger)

/**
 * 获取博客文章数据
 */
const articles = useBlogType('article')
const categoryMap = useBlogCategory('category')

/**
 * 路由导航
 */
const router = useRouter()

/**
 * DOM 引用
 */
const heroSection = ref(null)
const heroTitle = ref(null)
const heroSubtitle = ref(null)
const splineCanvas = ref(null)
const splineContainer = ref(null)
const introSection = ref(null)
const introText = ref(null)
const statArticles = ref(null)
const statCategories = ref(null)
const statTags = ref(null)
const articlesSection = ref(null)
const articlesGrid = ref(null)
const categoriesSection = ref(null)
const categoriesOrbit = ref(null)

/**
 * 站点配置（从 siteData 获取）
 */
const siteTitle = ref('ACG Dream')
const description = ref('探索二次元世界的无限可能')
const introContent = ref('这里是一个充满爱与梦想的动漫博客，记录着我们与二次元世界相遇的每一个瞬间。从经典老番到最新新番，从深度解析到轻松吐槽，用文字与图像编织属于我们的ACG记忆。')

/**
 * 精选文章列表（取前 6 篇）
 */
const featuredArticles = computed(() => {
  return (articles.value?.items || []).slice(0, 6)
})

/**
 * 分类列表
 */
const categories = computed(() => {
  const cats = categoryMap.value?.map || {}
  return Object.entries(cats).map(([name, data], index) => ({
    key: name,
    name,
    path: data.path,
    count: data.items.length,
    icon: ['📺', '🎮', '🎵', '📚', '✨', '🌟'][index % 6]
  }))
})

/**
 * 页脚链接
 */
const footerLinks = [
  { text: '文章', url: '/article/' },
  { text: '分类', url: '/category/' },
  { text: '标签', url: '/tag/' },
  { text: '时间线', url: '/timeline/' }
]

/**
 * 当前年份
 */
const currentYear = computed(() => new Date().getFullYear())

/**
 * 计算轨道位置
 */
const getOrbitPosition = (index, total) => {
  const angle = (360 / total) * index - 90
  const radius = 150
  const x = Math.cos((angle * Math.PI) / 180) * radius
  const y = Math.sin((angle * Math.PI) / 180) * radius * 0.5
  
  return {
    transform: `translate(${x}px, ${y}px)`
  }
}

/**
 * 初始化 Spline 3D 场景
 */
const initSpline = async () => {
  if (!splineCanvas.value) return
  
  try {
    const spline = new Application(splineCanvas.value)
    // 使用 Spline 公共 URL（需要用户替换为自己的场景）
    // await spline.load('https://prod.spline.design/YOUR-SCENE-URL/scene.splinecode')
    
    // 这里使用备用动画
    gsap.to(splineContainer.value, {
      rotateY: 360,
      duration: 20,
      repeat: -1,
      ease: 'none'
    })
  } catch (error) {
    console.log('Spline 3D 加载失败，使用备用动画')
  }
}

/**
 * 初始化 Hero 区动画
 */
const initHeroAnimations = () => {
  // 标题弹跳入场
  if (heroTitle.value) {
    const chars = heroTitle.value.textContent.split('')
    heroTitle.value.innerHTML = chars
      .map(char => char === ' ' ? '&nbsp;' : `<span class="char">${char}</span>`)
      .join('')
    
    gsap.fromTo(
      heroTitle.value.querySelectorAll('.char'),
      { 
        opacity: 0, 
        y: 80, 
        scale: 0.5,
        rotateX: -90 
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'back.out(1.7)',
        delay: 0.5
      }
    )
  }
  
  // 副标题淡入
  if (heroSubtitle.value) {
    gsap.fromTo(
      heroSubtitle.value,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, delay: 1.2, ease: 'power3.out' }
    )
  }
}

/**
 * 初始化滚动触发动画
 */
const initScrollAnimations = () => {
  // 介绍区卡片入场
  if (introSection.value) {
    ScrollTrigger.create({
      trigger: introSection.value,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        // 卡片动画
        gsap.fromTo(
          introSection.value.querySelector('.moe-intro__card'),
          { opacity: 0, y: 80, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'back.out(1.2)' }
        )
        
        // 数字滚动动画
        animateNumbers()
      }
    })
  }
  
  // 文章卡片交错入场
  if (articlesGrid.value) {
    const cards = articlesGrid.value.querySelectorAll('.moe-article-card')
    gsap.set(cards, { opacity: 0, y: 60, scale: 0.9 })
    
    ScrollTrigger.create({
      trigger: articlesSection.value,
      start: 'top 70%',
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.4)'
        })
      }
    })
  }
  
  // 分类轨道入场
  if (categoriesOrbit.value) {
    const items = categoriesOrbit.value.querySelectorAll('.moe-categories__item')
    gsap.set(items, { opacity: 0, scale: 0 })
    
    ScrollTrigger.create({
      trigger: categoriesSection.value,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        gsap.to(items, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'back.out(2)'
        })
      }
    })
  }
}

/**
 * 数字滚动动画
 */
const animateNumbers = () => {
  const stats = [
    { el: statArticles.value, target: featuredArticles.value.length || 12 },
    { el: statCategories.value, target: categories.value.length || 5 },
    { el: statTags.value, target: 24 }
  ]
  
  stats.forEach(({ el, target }, index) => {
    if (!el) return
    
    const obj = { value: 0 }
    gsap.to(obj, {
      value: target,
      duration: 2,
      delay: index * 0.2,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = Math.round(obj.value)
      }
    })
  })
}

/**
 * 导航方法
 */
const scrollToArticles = () => {
  articlesSection.value?.scrollIntoView({ behavior: 'smooth' })
}

const scrollToAbout = () => {
  introSection.value?.scrollIntoView({ behavior: 'smooth' })
}

const scrollToContent = () => {
  introSection.value?.scrollIntoView({ behavior: 'smooth' })
}

const navigateToArticle = (path) => {
  router.push(path)
}

const navigateToAllArticles = () => {
  router.push('/article/')
}

const navigateToCategory = (path) => {
  router.push(path)
}

/**
 * 生命周期 - 挂载
 */
onMounted(() => {
  // 延迟初始化以确保 DOM 准备就绪
  setTimeout(() => {
    initSpline()
    initHeroAnimations()
    initScrollAnimations()
  }, 100)
})
</script>

<style lang="scss" scoped>
.moe-home {
  position: relative;
  min-height: 100vh;
}

// Hero 区域
.moe-hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  overflow: hidden;
  
  &__content {
    position: relative;
    z-index: 2;
    text-align: center;
    max-width: 900px;
  }
  
  &__spline {
    position: relative;
    width: 300px;
    height: 300px;
    margin: 0 auto 2rem;
    perspective: 1000px;
  }
  
  &__spline-canvas {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  
  &__spline-fallback {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--moe-gradient-primary);
    border-radius: 50%;
    box-shadow: var(--moe-shadow-lg);
  }
  
  &__emoji {
    font-size: 8rem;
    animation: float-emoji 3s ease-in-out infinite;
  }
  
  &__text {
    position: relative;
  }
  
  &__title {
    font-family: var(--moe-font-display);
    font-size: clamp(3rem, 8vw, 5rem);
    color: var(--moe-text-primary);
    margin: 0 0 1rem;
    line-height: 1.2;
    
    :deep(.char) {
      display: inline-block;
      transform-origin: center bottom;
    }
  }
  
  &__subtitle {
    font-size: clamp(1.2rem, 3vw, 1.5rem);
    color: var(--moe-text-secondary);
    margin: 0 0 2rem;
    font-weight: 500;
  }
  
  &__actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  &__scroll-hint {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.3s;
    z-index: 3;
    
    &:hover {
      opacity: 1;
    }
  }
  
  &__mouse {
    width: 26px;
    height: 40px;
    border: 2px solid var(--moe-text-secondary);
    border-radius: 13px;
    position: relative;
  }
  
  &__mouse-wheel {
    width: 4px;
    height: 8px;
    background: var(--moe-text-secondary);
    border-radius: 2px;
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    animation: scroll-wheel 1.5s ease-in-out infinite;
  }
  
  &__scroll-text {
    font-size: 0.875rem;
    color: var(--moe-text-secondary);
  }
}

// 介绍区域
.moe-intro {
  padding: 6rem 2rem;
  position: relative;
  z-index: 2;
  
  &__card {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }
  
  &__title {
    font-family: var(--moe-font-display);
    font-size: 2.5rem;
    margin: 0;
  }
  
  &__text {
    font-size: 1.125rem;
    line-height: 1.8;
    color: var(--moe-text-secondary);
    margin: 0;
  }
  
  &__stats {
    display: flex;
    justify-content: center;
    gap: 3rem;
    flex-wrap: wrap;
  }
  
  &__stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  
  &__stat-number {
    font-family: var(--moe-font-display);
    font-size: 2.5rem;
    background: var(--moe-gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  &__stat-label {
    font-size: 0.875rem;
    color: var(--moe-text-muted);
  }
}

// 文章区域
.moe-articles {
  padding: 6rem 2rem;
  position: relative;
  z-index: 2;
  
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2rem;
    margin: 3rem 0;
  }
  
  &__more {
    text-align: center;
    margin-top: 3rem;
  }
}

// 分类区域
.moe-categories {
  padding: 6rem 2rem;
  position: relative;
  z-index: 2;
  
  &__orbit {
    position: relative;
    width: 400px;
    height: 300px;
    margin: 4rem auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  &__item {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background: var(--moe-bg-tertiary);
    border-radius: var(--moe-radius-lg);
    box-shadow: var(--moe-shadow-md);
    cursor: pointer;
    transition: all 0.3s var(--moe-ease-bounce);
    min-width: 100px;
    
    &:hover {
      transform: scale(1.1) !important;
      box-shadow: var(--moe-shadow-hover);
    }
  }
  
  &__icon {
    font-size: 2rem;
  }
  
  &__name {
    font-weight: 600;
    color: var(--moe-text-primary);
  }
  
  &__count {
    font-size: 0.75rem;
    color: var(--moe-text-muted);
  }
}

// 通用区块头部
.moe-section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.moe-section-title {
  font-family: var(--moe-font-display);
  font-size: 2.5rem;
  margin: 0 0 0.5rem;
}

.moe-section-subtitle {
  font-size: 1.125rem;
  color: var(--moe-text-secondary);
  margin: 0;
}

// 页脚
.moe-footer {
  padding: 4rem 2rem 2rem;
  background: linear-gradient(180deg, transparent 0%, rgba(255, 182, 193, 0.1) 100%);
  position: relative;
  z-index: 2;
  
  &__content {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  &__brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  
  &__logo {
    font-size: 2rem;
  }
  
  &__name {
    font-family: var(--moe-font-display);
    font-size: 1.5rem;
    color: var(--moe-text-primary);
  }
  
  &__desc {
    color: var(--moe-text-secondary);
    margin-bottom: 1.5rem;
  }
  
  &__links {
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
  }
  
  &__link {
    color: var(--moe-text-secondary);
    text-decoration: none;
    transition: color 0.3s;
    
    &:hover {
      color: var(--moe-primary-dark);
    }
  }
  
  &__copyright {
    text-align: center;
    font-size: 0.875rem;
    color: var(--moe-text-muted);
    padding-top: 2rem;
    border-top: 1px solid rgba(255, 182, 193, 0.2);
  }
}

// 动画关键帧
@keyframes float-emoji {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
  }
}

@keyframes scroll-wheel {
  0% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(12px);
  }
}

// 响应式调整
@media (max-width: 768px) {
  .moe-hero {
    padding: 1rem;
    
    &__spline {
      width: 200px;
      height: 200px;
    }
    
    &__emoji {
      font-size: 5rem;
    }
  }
  
  .moe-categories__orbit {
    width: 300px;
    height: 250px;
  }
  
  .moe-intro__stats {
    gap: 1.5rem;
  }
}
</style>
