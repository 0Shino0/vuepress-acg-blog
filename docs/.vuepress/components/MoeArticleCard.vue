<!--
  萌系文章卡片组件
  
  功能：展示单篇文章的卡片，带有可爱的动效和交互
  特性：
  - 浮动动画效果
  - Hover 时的缩放和阴影变化
  - Shader 扭曲效果（在封面图上）
  - 分类标签和日期显示
  
  使用示例：
  <MoeArticleCard 
    :article="articleData" 
    :index="0"
    @click="handleClick"
  />
  
  @author: yy
  @date: 2026-04-11
-->
<template>
  <article
    ref="cardRef"
    class="moe-article-card"
    :class="cardClasses"
    :style="cardStyle"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- 封面图区域 -->
    <div class="moe-article-card__cover">
      <div 
        ref="coverImageRef"
        class="moe-article-card__image-wrapper"
        :style="imageStyle"
      >
        <img 
          v-if="coverImage"
          :src="coverImage" 
          :alt="articleTitle"
          class="moe-article-card__image"
          loading="lazy"
        />
        <div v-else class="moe-article-card__placeholder">
          <span class="moe-article-card__placeholder-icon">🌸</span>
        </div>
        
        <!-- Hover 时的 Shader 扭曲层 -->
        <canvas 
          v-show="isHovered"
          ref="shaderCanvas"
          class="moe-article-card__shader"
        />
      </div>
      
      <!-- 置顶标记 -->
      <div v-if="isSticky" class="moe-article-card__sticky-badge">
        <span>📌 置顶</span>
      </div>
    </div>
    
    <!-- 内容区域 -->
    <div class="moe-article-card__content">
      <!-- 分类标签 -->
      <div class="moe-article-card__tags">
        <span 
          v-for="tag in displayTags" 
          :key="tag"
          class="moe-article-card__tag"
        >
          {{ tag }}
        </span>
      </div>
      
      <!-- 标题 -->
      <h3 class="moe-article-card__title">
        {{ articleTitle }}
      </h3>
      
      <!-- 摘要 -->
      <p class="moe-article-card__excerpt">
        {{ excerpt }}
      </p>
      
      <!-- 元信息 -->
      <div class="moe-article-card__meta">
        <span class="moe-article-card__date">
          <span class="moe-article-card__icon">📅</span>
          {{ formattedDate }}
        </span>
        <span v-if="author" class="moe-article-card__author">
          <span class="moe-article-card__icon">✍️</span>
          {{ author }}
        </span>
      </div>
    </div>
    
    <!-- 装饰元素 -->
    <div class="moe-article-card__decoration" />
    <div class="moe-article-card__glow" />
  </article>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useMotion } from '@vueuse/motion'

/**
 * 组件 Props 定义
 * 
 * @property {Object} article - 文章数据对象
 * @property {number} index - 卡片索引（用于交错动画延迟）
 */
const props = defineProps({
  article: {
    type: Object,
    required: true,
    validator: (value) => {
      return value.info && value.path
    }
  },
  index: {
    type: Number,
    default: 0
  }
})

/**
 * 组件事件定义
 */
const emit = defineEmits(['click'])

// DOM 引用
const cardRef = ref(null)
const coverImageRef = ref(null)
const shaderCanvas = ref(null)

// 状态
const isHovered = ref(false)

/**
 * 使用 Motion One 添加悬浮动效
 */
const { variant: motionVariant } = useMotion(cardRef, {
  initial: { 
    scale: 1, 
    y: 0,
    rotateY: 0
  },
  hovered: { 
    scale: 1.03, 
    y: -8,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20
    }
  },
  tapped: {
    scale: 0.98,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 17
    }
  }
})

/**
 * 计算卡片类名
 */
const cardClasses = computed(() => ({
  'moe-article-card--hovered': isHovered.value,
  'moe-article-card--sticky': isSticky.value
}))

/**
 * 计算卡片样式 - 交错动画延迟
 */
const cardStyle = computed(() => ({
  '--delay': `${props.index * 0.1}s`
}))

/**
 * 封面图片样式
 */
const imageStyle = computed(() => {
  if (!isHovered.value) return {}
  
  // Hover 时添加微妙的扭曲效果
  return {
    transform: 'scale(1.1)',
    filter: 'saturate(1.1)'
  }
})

/**
 * 解析文章数据
 */
const articleInfo = computed(() => props.article.info || {})

const articleTitle = computed(() => articleInfo.value.title || '无标题')

const excerpt = computed(() => {
  const text = articleInfo.value.excerpt || ''
  // 去除 HTML 标签
  const plainText = text.replace(/<[^>]*>/g, '')
  // 截取前 80 字符
  return plainText.length > 80 
    ? plainText.slice(0, 80) + '...' 
    : plainText || '暂无摘要...'
})

const coverImage = computed(() => {
  // 尝试从文章数据中提取图片
  const excerpt = articleInfo.value.excerpt || ''
  const imgMatch = excerpt.match(/<img[^>]+src=["']([^"']+)["']/i)
  return imgMatch ? imgMatch[1] : null
})

const displayTags = computed(() => {
  const categories = articleInfo.value.category || []
  const tags = articleInfo.value.tag || []
  return [...categories, ...tags].slice(0, 3)
})

const formattedDate = computed(() => {
  const date = articleInfo.value.date
  if (!date) return '未知日期'
  
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
})

const author = computed(() => articleInfo.value.author || '')

const isSticky = computed(() => {
  // 检查文章是否有 sticky 属性
  return articleInfo.value.sticky || false
})

/**
 * 鼠标进入处理
 */
const handleMouseEnter = () => {
  isHovered.value = true
  motionVariant.value = 'hovered'
  
  // 启动 Shader 效果
  if (shaderCanvas.value && coverImage.value) {
    initShaderEffect()
  }
}

/**
 * 鼠标离开处理
 */
const handleMouseLeave = () => {
  isHovered.value = false
  motionVariant.value = 'initial'
  
  // 停止 Shader
  stopShaderEffect()
}

/**
 * 点击处理
 */
const handleClick = () => {
  emit('click')
}

// Shader 动画相关
let shaderCtx = null
let shaderAnimationId = null

/**
 * 初始化简单的 Canvas 扭曲效果
 * 使用正弦波模拟水波纹
 */
const initShaderEffect = () => {
  if (!shaderCanvas.value || !coverImageRef.value) return
  
  const canvas = shaderCanvas.value
  const wrapper = coverImageRef.value
  const rect = wrapper.getBoundingClientRect()
  
  canvas.width = rect.width
  canvas.height = rect.height
  
  shaderCtx = canvas.getContext('2d')
  
  let time = 0
  
  const animate = () => {
    if (!shaderCtx || !isHovered.value) return
    
    time += 0.05
    
    // 清除画布
    shaderCtx.clearRect(0, 0, canvas.width, canvas.height)
    
    // 绘制波纹效果
    shaderCtx.save()
    
    // 使用正弦波创建波纹
    for (let y = 0; y < canvas.height; y += 4) {
      const offsetX = Math.sin((y + time * 50) * 0.02) * 3
      
      shaderCtx.beginPath()
      shaderCtx.moveTo(0, y)
      shaderCtx.lineTo(canvas.width, y + offsetX)
      
      // 渐变颜色
      const gradient = shaderCtx.createLinearGradient(0, y, canvas.width, y)
      gradient.addColorStop(0, `rgba(255, 182, 193, ${0.1 + Math.sin(time) * 0.05})`)
      gradient.addColorStop(0.5, `rgba(230, 230, 250, ${0.15 + Math.cos(time) * 0.05})`)
      gradient.addColorStop(1, `rgba(255, 182, 193, ${0.1 + Math.sin(time) * 0.05})`)
      
      shaderCtx.strokeStyle = gradient
      shaderCtx.lineWidth = 2
      shaderCtx.stroke()
    }
    
    shaderCtx.restore()
    
    shaderAnimationId = requestAnimationFrame(animate)
  }
  
  animate()
}

/**
 * 停止 Shader 效果
 */
const stopShaderEffect = () => {
  if (shaderAnimationId) {
    cancelAnimationFrame(shaderAnimationId)
    shaderAnimationId = null
  }
  
  if (shaderCtx && shaderCanvas.value) {
    shaderCtx.clearRect(0, 0, shaderCanvas.value.width, shaderCanvas.value.height)
  }
}

/**
 * 生命周期 - 卸载
 */
onUnmounted(() => {
  stopShaderEffect()
})
</script>

<style lang="scss" scoped>
.moe-article-card {
  position: relative;
  background: var(--moe-bg-tertiary);
  border-radius: var(--moe-radius-lg);
  overflow: hidden;
  cursor: pointer;
  box-shadow: var(--moe-shadow-md);
  transition: all var(--moe-duration-normal) var(--moe-ease-smooth);
  animation-delay: var(--delay, 0s);
  
  &:hover {
    box-shadow: var(--moe-shadow-hover);
  }
  
  &--sticky {
    .moe-article-card__sticky-badge {
      display: flex;
    }
  }
  
  // 装饰元素
  &__decoration {
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(255, 182, 193, 0.03) 0%,
      transparent 50%
    );
    opacity: 0;
    transition: opacity var(--moe-duration-slow);
    pointer-events: none;
  }
  
  &:hover &__decoration {
    opacity: 1;
  }
  
  // 光晕效果
  &__glow {
    position: absolute;
    inset: -2px;
    background: linear-gradient(
      135deg,
      rgba(255, 182, 193, 0.3) 0%,
      rgba(230, 230, 250, 0.3) 50%,
      rgba(255, 182, 193, 0.3) 100%
    );
    border-radius: calc(var(--moe-radius-lg) + 2px);
    opacity: 0;
    transition: opacity var(--moe-duration-normal);
    z-index: -1;
    filter: blur(8px);
  }
  
  &:hover &__glow {
    opacity: 0.6;
    animation: glow-pulse 2s ease-in-out infinite;
  }
  
  // 封面图区域
  &__cover {
    position: relative;
    aspect-ratio: 16 / 10;
    overflow: hidden;
  }
  
  &__image-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform var(--moe-duration-slow) var(--moe-ease-smooth);
    overflow: hidden;
  }
  
  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--moe-duration-slow) var(--moe-ease-smooth);
  }
  
  &:hover &__image {
    transform: scale(1.1);
  }
  
  &__placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--moe-gradient-primary);
  }
  
  &__placeholder-icon {
    font-size: 4rem;
    animation: float-icon 3s ease-in-out infinite;
  }
  
  // Shader 扭曲层
  &__shader {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    mix-blend-mode: overlay;
  }
  
  // 置顶标记
  &__sticky-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    display: none;
    align-items: center;
    gap: 4px;
    padding: 4px 12px;
    background: var(--moe-gradient-primary);
    color: var(--moe-text-light);
    font-size: var(--moe-text-xs);
    font-weight: 700;
    border-radius: var(--moe-radius-full);
    box-shadow: var(--moe-shadow-sm);
    z-index: 2;
  }
  
  // 内容区域
  &__content {
    padding: var(--moe-space-lg);
  }
  
  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--moe-space-sm);
    margin-bottom: var(--moe-space-md);
  }
  
  &__tag {
    display: inline-flex;
    padding: 4px 10px;
    background: var(--moe-primary-soft);
    color: var(--moe-primary-dark);
    font-size: var(--moe-text-xs);
    font-weight: 600;
    border-radius: var(--moe-radius-full);
    transition: all var(--moe-duration-fast);
    
    &:hover {
      background: var(--moe-primary);
      color: var(--moe-text-light);
    }
  }
  
  &__title {
    font-family: var(--moe-font-primary);
    font-size: var(--moe-text-lg);
    font-weight: 700;
    color: var(--moe-text-primary);
    margin: 0 0 var(--moe-space-sm);
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    transition: color var(--moe-duration-fast);
  }
  
  &:hover &__title {
    color: var(--moe-primary-dark);
  }
  
  &__excerpt {
    font-size: var(--moe-text-sm);
    color: var(--moe-text-secondary);
    line-height: 1.6;
    margin: 0 0 var(--moe-space-md);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  // 元信息
  &__meta {
    display: flex;
    align-items: center;
    gap: var(--moe-space-md);
    font-size: var(--moe-text-xs);
    color: var(--moe-text-muted);
  }
  
  &__date,
  &__author {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  &__icon {
    font-size: 0.875rem;
  }
}

// 动画关键帧
@keyframes float-icon {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(5deg);
  }
}

@keyframes glow-pulse {
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.7;
  }
}
</style>
