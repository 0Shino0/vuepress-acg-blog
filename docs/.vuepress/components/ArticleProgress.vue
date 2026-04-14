<!--
  文章阅读进度条组件
  
  功能：显示当前文章阅读进度，顶部彩虹进度条
  特性：
  - 根据滚动位置计算阅读进度
  - 彩虹渐变效果
  - 章节标题到达视口时高亮
  - 平滑的进度动画
  
  使用示例：
  <ArticleProgress 
    :article-ref="articleContentRef"
    :headings="headings"
  />
  
  @author: yy
  @date: 2026-04-11
-->
<template>
  <div class="article-progress" :class="{ 'article-progress--visible': showProgress }">
    <!-- 彩虹进度条 -->
    <div class="article-progress__bar">
      <div 
        class="article-progress__fill"
        :style="{ width: `${progress}%` }"
      />
    </div>
    
    <!-- 章节导航指示器 -->
    <div v-if="headings.length > 0" class="article-progress__chapters">
      <div 
        v-for="(heading, index) in headings"
        :key="heading.id || index"
        class="article-progress__chapter"
        :class="{
          'article-progress__chapter--active': activeHeading === index,
          'article-progress__chapter--passed': index < activeHeading
        }"
        @click="scrollToHeading(heading)"
      >
        <span class="article-progress__chapter-dot" />
        <span class="article-progress__chapter-title">{{ heading.title }}</span>
      </div>
    </div>
    
    <!-- 百分比显示 -->
    <div class="article-progress__percent">
      {{ Math.round(progress) }}%
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

/**
 * 组件 Props 定义
 * 
 * @property {HTMLElement} articleRef - 文章内容区域引用
 * @property {Array} headings - 文章标题列表 [{ id, title, level }]
 * @property {number} offset - 进度计算偏移量
 */
const props = defineProps({
  articleRef: {
    type: Object, // HTMLElement or Ref
    default: null
  },
  headings: {
    type: Array,
    default: () => []
  },
  offset: {
    type: Number,
    default: 100 // 顶部偏移
  }
})

// 进度百分比
const progress = ref(0)

// 是否显示进度条（滚动后才显示）
const showProgress = ref(false)

// 当前激活的章节索引
const activeHeading = ref(-1)

// 节流定时器
let scrollTimer = null

/**
 * 计算阅读进度
 */
const calculateProgress = () => {
  const article = props.articleRef?.$el || props.articleRef
  if (!article) return
  
  const rect = article.getBoundingClientRect()
  const articleHeight = article.offsetHeight
  const windowHeight = window.innerHeight
  
  // 文章顶部到视口顶部的距离
  const articleTop = rect.top
  
  // 已经滚动过的距离
  const scrolled = -articleTop + props.offset
  
  // 可滚动的总距离
  const totalScrollable = articleHeight - windowHeight + props.offset
  
  // 计算百分比
  let percent = (scrolled / totalScrollable) * 100
  percent = Math.max(0, Math.min(100, percent))
  
  progress.value = percent
  
  // 根据进度决定是否显示进度条
  showProgress.value = percent > 0 && percent < 100
  
  // 更新当前章节
  updateActiveHeading()
}

/**
 * 更新当前激活的章节
 */
const updateActiveHeading = () => {
  if (!props.headings.length) return
  
  const scrollY = window.scrollY + props.offset + 200
  
  let currentIndex = -1
  
  for (let i = 0; i < props.headings.length; i++) {
    const heading = props.headings[i]
    const element = document.getElementById(heading.id)
    
    if (element) {
      const rect = element.getBoundingClientRect()
      const top = rect.top + window.scrollY
      
      if (top <= scrollY) {
        currentIndex = i
      } else {
        break
      }
    }
  }
  
  activeHeading.value = currentIndex
}

/**
 * 滚动到指定章节
 */
const scrollToHeading = (heading) => {
  const element = document.getElementById(heading.id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

/**
 * 处理滚动事件（带节流）
 */
const handleScroll = () => {
  if (scrollTimer) return
  
  scrollTimer = requestAnimationFrame(() => {
    calculateProgress()
    scrollTimer = null
  })
}

/**
 * 生命周期 - 挂载
 */
onMounted(() => {
  // 初始计算
  setTimeout(calculateProgress, 100)
  
  // 添加滚动监听
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleScroll, { passive: true })
})

/**
 * 生命周期 - 卸载
 */
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleScroll)
  
  if (scrollTimer) {
    cancelAnimationFrame(scrollTimer)
  }
})
</script>

<style lang="scss" scoped>
.article-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 1.5rem;
  background: rgba(255, 245, 247, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 182, 193, 0.2);
  transform: translateY(-100%);
  transition: transform var(--moe-duration-normal) var(--moe-ease-smooth);
  
  &--visible {
    transform: translateY(0);
  }
  
  // 彩虹进度条
  &__bar {
    flex: 1;
    height: 6px;
    background: rgba(255, 182, 193, 0.2);
    border-radius: var(--moe-radius-full);
    overflow: hidden;
    position: relative;
  }
  
  &__fill {
    height: 100%;
    background: linear-gradient(
      90deg,
      #FFB6C1 0%,
      #E6E6FA 20%,
      #FFD700 40%,
      #98FB98 60%,
      #87CEEB 80%,
      #FFB6C1 100%
    );
    border-radius: var(--moe-radius-full);
    transition: width 0.1s linear;
    box-shadow: 0 0 10px rgba(255, 182, 193, 0.5);
  }
  
  // 章节导航
  &__chapters {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }
  
  &__chapter {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    cursor: pointer;
    transition: opacity var(--moe-duration-fast);
    
    &:hover {
      .article-progress__chapter-title {
        opacity: 1;
        max-width: 150px;
      }
    }
    
    &--active {
      .article-progress__chapter-dot {
        background: var(--moe-primary);
        transform: scale(1.3);
        box-shadow: 0 0 8px var(--moe-primary);
      }
    }
    
    &--passed {
      .article-progress__chapter-dot {
        background: var(--moe-primary-light);
      }
    }
  }
  
  &__chapter-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--moe-text-muted);
    transition: all var(--moe-duration-normal) var(--moe-ease-bounce);
    flex-shrink: 0;
  }
  
  &__chapter-title {
    font-size: 0.75rem;
    color: var(--moe-text-primary);
    max-width: 0;
    overflow: hidden;
    opacity: 0;
    white-space: nowrap;
    transition: all var(--moe-duration-normal);
  }
  
  // 百分比显示
  &__percent {
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--moe-primary-dark);
    min-width: 45px;
    text-align: right;
    font-family: var(--moe-font-mono);
  }
}

// 响应式调整
@media (max-width: 768px) {
  .article-progress {
    padding: 0.5rem 1rem;
    
    &__chapters {
      display: none;
    }
    
    &__percent {
      font-size: 0.75rem;
      min-width: 35px;
    }
  }
}
</style>
