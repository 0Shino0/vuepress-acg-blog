<!--
  文章详情页布局
  
  核心功能：
  1. 全屏 Shader 头图区域
  2. 阅读进度条
  3. 悬浮目录导航
  4. 文章互动组件（点赞、分享、Rive表情）
  5. 文章内容动画显现
  
  动效集成：
  - LiquidBackground: WebGL 流体渐变背景
  - ArticleProgress: 彩虹阅读进度条
  - RiveMascot: 互动吉祥物
  - ParticleHeart: 爱心粒子爆炸
  - GSAP ScrollTrigger: 文字段落显现
  
  @author: yy
  @date: 2026-04-11
-->
<template>
  <div class="article-detail">
    <!-- 全局背景 -->
    <LiquidBackground 
      :intensity="0.8" 
      :speed="0.2"
      :opacity="0.3"
    />
    
    <!-- 阅读进度条 -->
    <ArticleProgress 
      :article-ref="contentRef"
      :headings="headings"
    />
    
    <!-- 悬浮目录 -->
    <aside v-if="headings.length > 0" class="article-detail__toc">
      <div class="article-detail__toc-header">
        <span>📑</span>
        <span>目录</span>
      </div>
      <nav class="article-detail__toc-nav">
        <a
          v-for="heading in headings"
          :key="heading.id"
          :href="`#${heading.id}`"
          class="article-detail__toc-link"
          :class="{
            'article-detail__toc-link--active': activeHeading === heading.id,
            [`article-detail__toc-link--level-${heading.level}`]: true
          }"
          @click.prevent="scrollToHeading(heading.id)"
        >
          {{ heading.title }}
        </a>
      </nav>
    </aside>
    
    <!-- 互动吉祥物 -->
    <div class="article-detail__mascot">
      <RiveMascot 
        src="/rive/mascot.riv"
        :size="120"
        @click="handleMascotClick"
      />
    </div>
    
    <!-- 爱心粒子效果 -->
    <ParticleHeart ref="heartRef" />
    
    <!-- 文章主体 -->
    <article ref="articleRef" class="article-detail__article">
      <!-- 头图区域 -->
      <header class="article-detail__hero">
        <div class="article-detail__hero-bg" :style="heroStyle">
          <div class="article-detail__hero-pattern" />
        </div>
        
        <div class="article-detail__hero-content">
          <!-- 返回按钮 -->
          <button 
            class="article-detail__back"
            @click="goBack"
          >
            <span>←</span>
            <span>返回</span>
          </button>
          
          <!-- 标题 -->
          <h1 ref="titleRef" class="article-detail__title">
            {{ frontmatter.title }}
          </h1>
          
          <!-- 元信息 -->
          <div class="article-detail__meta">
            <span v-if="frontmatter.date" class="article-detail__date">
              📅 {{ formattedDate }}
            </span>
            <span v-if="frontmatter.author" class="article-detail__author">
              ✍️ {{ frontmatter.author }}
            </span>
            <span v-if="readingTime" class="article-detail__readtime">
              ⏱️ {{ readingTime }} 分钟阅读
            </span>
          </div>
          
          <!-- 分类标签 -->
          <div v-if="categories.length" class="article-detail__categories">
            <span 
              v-for="cat in categories" 
              :key="cat"
              class="article-detail__category"
            >
              {{ cat }}
            </span>
          </div>
        </div>
      </header>
      
      <!-- 内容区域 -->
      <div ref="contentRef" class="article-detail__content">
        <Content />
      </div>
      
      <!-- 互动区域 -->
      <footer class="article-detail__interactions">
        <!-- 点赞按钮 -->
        <div class="article-detail__like">
          <button 
            class="article-detail__like-btn"
            :class="{ 'article-detail__like-btn--active': isLiked }"
            @click="handleLike"
          >
            <span class="article-detail__like-icon">{{ isLiked ? '💖' : '🤍' }}</span>
            <span class="article-detail__like-count">{{ likeCount }}</span>
          </button>
        </div>
        
        <!-- 分享按钮 -->
        <div class="article-detail__share">
          <span class="article-detail__share-label">分享:</span>
          <button 
            v-for="platform in sharePlatforms" 
            :key="platform.name"
            class="article-detail__share-btn"
            @click="share(platform)"
          >
            {{ platform.icon }}
          </button>
        </div>
      </footer>
    </article>
    
    <!-- 上一篇/下一篇导航 -->
    <nav v-if="prevArticle || nextArticle" class="article-detail__nav">
      <div v-if="prevArticle" class="article-detail__nav-item article-detail__nav-item--prev">
        <span class="article-detail__nav-label">← 上一篇</span>
        <a :href="prevArticle.path" class="article-detail__nav-link">
          {{ prevArticle.info.title }}
        </a>
      </div>
      <div v-if="nextArticle" class="article-detail__nav-item article-detail__nav-item--next">
        <span class="article-detail__nav-label">下一篇 →</span>
        <a :href="nextArticle.path" class="article-detail__nav-link">
          {{ nextArticle.info.title }}
        </a>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { usePageData } from 'vuepress/client'
import { useBlogType } from '@vuepress/plugin-blog/client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// 导入组件
import LiquidBackground from '../components/effects/LiquidBackground.vue'
import ArticleProgress from '../components/ArticleProgress.vue'
import RiveMascot from '../components/rive/RiveMascot.vue'
import ParticleHeart from '../components/effects/ParticleHeart.vue'

// 注册 GSAP 插件
gsap.registerPlugin(ScrollTrigger)

// 页面数据
const page = usePageData()
const frontmatter = computed(() => page.value?.frontmatter || {})

// 获取所有文章用于上一篇/下一篇
const articles = useBlogType('article')

// DOM 引用
const articleRef = ref(null)
const contentRef = ref(null)
const titleRef = ref(null)
const heartRef = ref(null)

// 状态
const headings = ref([])
const activeHeading = ref('')
const isLiked = ref(false)
const likeCount = ref(42)

// 分享平台
const sharePlatforms = [
  { name: 'twitter', icon: '🐦', url: 'https://twitter.com/intent/tweet?text=' },
  { name: 'weibo', icon: '📱', url: 'https://service.weibo.com/share/share.php?title=' },
  { name: 'copy', icon: '🔗', url: '' }
]

/**
 * 计算格式化日期
 */
const formattedDate = computed(() => {
  const date = frontmatter.value.date
  if (!date) return ''
  
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

/**
 * 计算分类
 */
const categories = computed(() => {
  return frontmatter.value.category || []
})

/**
 * 计算阅读时间（估算）
 */
const readingTime = computed(() => {
  const content = document.querySelector('.theme-default-content')?.textContent || ''
  const words = content.length
  const minutes = Math.ceil(words / 300) // 假设 300 字/分钟
  return minutes
})

/**
 * 计算上一篇和下一篇文章
 */
const currentIndex = computed(() => {
  return articles.value?.items?.findIndex(
    item => item.path === page.value?.path
  ) || -1
})

const prevArticle = computed(() => {
  if (currentIndex.value > 0) {
    return articles.value?.items?.[currentIndex.value - 1]
  }
  return null
})

const nextArticle = computed(() => {
  if (currentIndex.value >= 0 && currentIndex.value < (articles.value?.items?.length || 0) - 1) {
    return articles.value?.items?.[currentIndex.value + 1]
  }
  return null
})

/**
 * 计算头图样式
 */
const heroStyle = computed(() => {
  const gradients = [
    'linear-gradient(135deg, #FFB6C1 0%, #E6E6FA 100%)',
    'linear-gradient(135deg, #E6E6FA 0%, #FFD1DC 100%)',
    'linear-gradient(135deg, #FFD1DC 0%, #FFB6C1 100%)',
    'linear-gradient(135deg, #F0E6FF 0%, #E6E6FA 100%)',
  ]
  
  // 根据标题长度选择颜色
  const index = (frontmatter.value.title?.length || 0) % gradients.length
  
  return {
    background: gradients[index]
  }
})

/**
 * 提取文章标题
 */
const extractHeadings = () => {
  if (!contentRef.value) return
  
  const content = contentRef.value
  const headingElements = content.querySelectorAll('h2, h3, h4')
  
  headings.value = Array.from(headingElements).map((el, index) => {
    // 确保标题有 id
    if (!el.id) {
      el.id = `heading-${index}`
    }
    
    return {
      id: el.id,
      title: el.textContent || '',
      level: parseInt(el.tagName.charAt(1))
    }
  })
}

/**
 * 滚动到指定标题
 */
const scrollToHeading = (id) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

/**
 * 返回上一页
 */
const goBack = () => {
  window.history.back()
}

/**
 * 处理点赞
 */
const handleLike = (event) => {
  isLiked.value = !isLiked.value
  
  if (isLiked.value) {
    likeCount.value++
    // 触发爱心粒子爆炸
    if (heartRef.value) {
      heartRef.value.explode(event, 20)
    }
  } else {
    likeCount.value--
  }
  
  // 保存到 localStorage
  localStorage.setItem(`liked_${page.value?.path}`, isLiked.value.toString())
}

/**
 * 处理吉祥物点击
 */
const handleMascotClick = (state) => {
  // 吉祥物状态变化时的处理
  console.log('Mascot state:', state)
}

/**
 * 分享文章
 */
const share = (platform) => {
  const url = encodeURIComponent(window.location.href)
  const title = encodeURIComponent(frontmatter.value.title || '')
  
  if (platform.name === 'copy') {
    navigator.clipboard.writeText(window.location.href)
    alert('链接已复制到剪贴板！')
  } else {
    window.open(`${platform.url}${title}&url=${url}`, '_blank')
  }
}

/**
 * 初始化标题入场动画
 */
const initTitleAnimation = () => {
  if (!titleRef.value) return
  
  gsap.fromTo(
    titleRef.value,
    { opacity: 0, y: 50, scale: 0.9 },
    { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      duration: 1, 
      ease: 'power3.out',
      delay: 0.3
    }
  )
}

/**
 * 初始化内容段落显现动画
 */
const initContentAnimations = () => {
  if (!contentRef.value) return
  
  const paragraphs = contentRef.value.querySelectorAll('p, h2, h3, h4, ul, ol, blockquote, pre')
  
  gsap.set(paragraphs, { opacity: 0, y: 30 })
  
  ScrollTrigger.batch(paragraphs, {
    onEnter: (elements) => {
      gsap.to(elements, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out'
      })
    },
    start: 'top 85%',
    once: true
  })
}

/**
 * 检查是否已点赞
 */
const checkLikedStatus = () => {
  const liked = localStorage.getItem(`liked_${page.value?.path}`)
  if (liked === 'true') {
    isLiked.value = true
  }
}

/**
 * 生命周期 - 挂载
 */
onMounted(() => {
  // 延迟执行确保 DOM 就绪
  setTimeout(() => {
    extractHeadings()
    initTitleAnimation()
    initContentAnimations()
    checkLikedStatus()
  }, 100)
})
</script>

<style lang="scss">
.article-detail {
  position: relative;
  min-height: 100vh;
  
  // 悬浮目录
  &__toc {
    position: fixed;
    left: 2rem;
    top: 50%;
    transform: translateY(-50%);
    width: 200px;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border-radius: var(--moe-radius-lg);
    padding: 1rem;
    box-shadow: var(--moe-shadow-md);
    z-index: 50;
    max-height: 60vh;
    overflow-y: auto;
    
    @media (max-width: 1200px) {
      display: none;
    }
  }
  
  &__toc-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    color: var(--moe-text-primary);
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(255, 182, 193, 0.2);
  }
  
  &__toc-nav {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  &__toc-link {
    padding: 0.375rem 0.5rem;
    border-radius: var(--moe-radius-md);
    font-size: 0.875rem;
    color: var(--moe-text-secondary);
    text-decoration: none;
    transition: all var(--moe-duration-fast);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    
    &:hover {
      background: var(--moe-primary-soft);
      color: var(--moe-primary-dark);
    }
    
    &--active {
      background: var(--moe-primary-soft);
      color: var(--moe-primary-dark);
      font-weight: 600;
    }
    
    &--level-3 {
      padding-left: 1rem;
      font-size: 0.8125rem;
    }
    
    &--level-4 {
      padding-left: 1.5rem;
      font-size: 0.75rem;
    }
  }
  
  // 吉祥物
  &__mascot {
    position: fixed;
    right: 2rem;
    bottom: 2rem;
    z-index: 50;
    
    @media (max-width: 768px) {
      right: 1rem;
      bottom: 1rem;
      transform: scale(0.8);
    }
  }
  
  // 文章主体
  &__article {
    position: relative;
    z-index: 1;
    max-width: 800px;
    margin: 0 auto;
    padding: 0 1.5rem;
    
    @media (max-width: 768px) {
      padding: 0 1rem;
    }
  }
  
  // 头图区域
  &__hero {
    position: relative;
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 -1.5rem 3rem;
    padding: 6rem 2rem 3rem;
    overflow: hidden;
    border-radius: 0 0 var(--moe-radius-xl) var(--moe-radius-xl);
    
    @media (max-width: 768px) {
      min-height: 40vh;
      padding: 5rem 1rem 2rem;
      margin: 0 -1rem 2rem;
    }
  }
  
  &__hero-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
  }
  
  &__hero-pattern {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(
      circle at 20% 50%,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 80%,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 50%
    );
  }
  
  &__hero-content {
    position: relative;
    z-index: 1;
    text-align: center;
    max-width: 700px;
  }
  
  &__back {
    position: absolute;
    top: 2rem;
    left: 2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: var(--moe-radius-md);
    font-size: 0.875rem;
    color: var(--moe-text-primary);
    cursor: pointer;
    transition: all var(--moe-duration-fast);
    box-shadow: var(--moe-shadow-sm);
    
    &:hover {
      transform: translateX(-4px);
      box-shadow: var(--moe-shadow-md);
    }
    
    @media (max-width: 768px) {
      top: 1rem;
      left: 1rem;
      padding: 0.375rem 0.75rem;
    }
  }
  
  &__title {
    font-family: var(--moe-font-display);
    font-size: clamp(2rem, 5vw, 3.5rem);
    color: var(--moe-text-primary);
    margin: 0 0 1.5rem;
    line-height: 1.3;
  }
  
  &__meta {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    flex-wrap: wrap;
    margin-bottom: 1.5rem;
    font-size: 0.875rem;
    color: var(--moe-text-secondary);
  }
  
  &__categories {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  
  &__category {
    padding: 0.375rem 1rem;
    background: rgba(255, 255, 255, 0.9);
    border-radius: var(--moe-radius-full);
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--moe-primary-dark);
  }
  
  // 内容区域
  &__content {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border-radius: var(--moe-radius-lg);
    padding: 3rem;
    box-shadow: var(--moe-shadow-md);
    
    @media (max-width: 768px) {
      padding: 1.5rem;
    }
    
    // 内容样式覆盖
    h2, h3, h4 {
      margin-top: 2.5rem;
      margin-bottom: 1rem;
      color: var(--moe-text-primary);
    }
    
    h2 {
      font-size: 1.75rem;
      border-bottom: 2px solid var(--moe-primary-light);
      padding-bottom: 0.5rem;
    }
    
    p {
      line-height: 1.8;
      margin-bottom: 1.25rem;
      color: var(--moe-text-secondary);
    }
    
    img {
      max-width: 100%;
      border-radius: var(--moe-radius-lg);
      box-shadow: var(--moe-shadow-md);
    }
    
    blockquote {
      border-left: 4px solid var(--moe-primary);
      background: var(--moe-primary-soft);
      padding: 1rem 1.5rem;
      border-radius: 0 var(--moe-radius-md) var(--moe-radius-md) 0;
      margin: 1.5rem 0;
      font-style: italic;
    }
    
    code {
      background: var(--moe-primary-soft);
      padding: 0.2rem 0.4rem;
      border-radius: var(--moe-radius-sm);
      font-family: var(--moe-font-mono);
      font-size: 0.875em;
    }
    
    pre {
      background: #2D2A3E;
      color: #FFE4E9;
      padding: 1.5rem;
      border-radius: var(--moe-radius-lg);
      overflow-x: auto;
      
      code {
        background: none;
        padding: 0;
        color: inherit;
      }
    }
  }
  
  // 互动区域
  &__interactions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 3rem;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.9);
    border-radius: var(--moe-radius-lg);
    box-shadow: var(--moe-shadow-md);
    
    @media (max-width: 768px) {
      flex-direction: column;
      gap: 1rem;
      padding: 1.5rem;
    }
  }
  
  &__like-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: var(--moe-bg-tertiary);
    border: 2px solid var(--moe-primary-light);
    border-radius: var(--moe-radius-full);
    cursor: pointer;
    transition: all var(--moe-duration-normal) var(--moe-ease-bounce);
    
    &:hover,
    &--active {
      background: var(--moe-gradient-primary);
      border-color: var(--moe-primary);
      transform: scale(1.05);
      box-shadow: var(--moe-shadow-md);
    }
    
    &--active {
      .article-detail__like-icon {
        animation: heart-beat 0.5s ease-in-out;
      }
    }
  }
  
  &__like-icon {
    font-size: 1.5rem;
  }
  
  &__like-count {
    font-weight: 600;
    color: var(--moe-text-primary);
  }
  
  &__share {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  &__share-label {
    font-size: 0.875rem;
    color: var(--moe-text-muted);
  }
  
  &__share-btn {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--moe-bg-tertiary);
    border: none;
    border-radius: 50%;
    font-size: 1.25rem;
    cursor: pointer;
    transition: all var(--moe-duration-fast);
    
    &:hover {
      background: var(--moe-primary-soft);
      transform: scale(1.1);
    }
  }
  
  // 上一篇/下一篇导航
  &__nav {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    max-width: 800px;
    margin: 3rem auto;
    padding: 0 1.5rem;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }
  
  &__nav-item {
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.9);
    border-radius: var(--moe-radius-lg);
    box-shadow: var(--moe-shadow-md);
    transition: all var(--moe-duration-normal);
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: var(--moe-shadow-hover);
    }
    
    &--next {
      text-align: right;
    }
    
    @media (max-width: 768px) {
      text-align: left !important;
    }
  }
  
  &__nav-label {
    display: block;
    font-size: 0.875rem;
    color: var(--moe-text-muted);
    margin-bottom: 0.5rem;
  }
  
  &__nav-link {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--moe-text-primary);
    text-decoration: none;
    
    &:hover {
      color: var(--moe-primary-dark);
    }
  }
}

// 心跳动画
@keyframes heart-beat {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
}
</style>
