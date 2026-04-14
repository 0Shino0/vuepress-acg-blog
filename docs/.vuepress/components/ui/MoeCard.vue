<!--
  萌系卡片组件
  
  功能：通用卡片容器，带有可爱的悬浮动效
  特性：
  - 浮动动画效果
  - Hover 缩放与阴影变化
  - 可选的装饰角标
  - 支持自定义内容区域
  
  使用示例：
  <MoeCard float hover-scale>
    <template #header>标题</template>
    <template #default>内容</template>
    <template #footer>底部</template>
  </MoeCard>
  
  @author: yy
  @date: 2026-04-11
-->
<template>
  <div
    ref="cardRef"
    :class="cardClasses"
    :style="cardStyle"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- 装饰角标 -->
    <div v-if="badge" class="moe-card__badge" :class="`moe-card__badge--${badgeType}`">
      {{ badge }}
    </div>
    
    <!-- 顶部区域 -->
    <div v-if="$slots.header || title" class="moe-card__header">
      <slot name="header">
        <h3 v-if="title" class="moe-card__title">{{ title }}</h3>
      </slot>
    </div>
    
    <!-- 内容区域 -->
    <div class="moe-card__body">
      <slot />
    </div>
    
    <!-- 底部区域 -->
    <div v-if="$slots.footer" class="moe-card__footer">
      <slot name="footer" />
    </div>
    
    <!-- 背景装饰 -->
    <div class="moe-card__glow" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMotion } from '@vueuse/motion'

/**
 * 卡片组件 Props 定义
 * 
 * @property {string} title - 卡片标题
 * @property {string} badge - 角标文字
 * @property {string} badgeType - 角标类型
 * @property {boolean} float - 是否启用浮动动画
 * @property {boolean} hoverScale - Hover 时是否缩放
 * @property {boolean} glow - 是否启用光晕效果
 * @property {string} variant - 卡片变体样式
 * @property {number} floatIntensity - 浮动强度 (1-3)
 */
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  badge: {
    type: String,
    default: ''
  },
  badgeType: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'accent', 'success', 'warning'].includes(value)
  },
  float: {
    type: Boolean,
    default: false
  },
  hoverScale: {
    type: Boolean,
    default: true
  },
  glow: {
    type: Boolean,
    default: true
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'flat', 'outlined', 'elevated'].includes(value)
  },
  floatIntensity: {
    type: Number,
    default: 1,
    validator: (value) => value >= 1 && value <= 3
  }
})

// 卡片 DOM 引用
const cardRef = ref(null)

// 是否正在 hover
const isHovered = ref(false)

/**
 * 使用 Motion One 添加动效
 */
const { variant: motionVariant } = useMotion(cardRef, {
  initial: { 
    scale: 1, 
    y: 0,
    rotateX: 0,
    rotateY: 0
  },
  hovered: { 
    scale: props.hoverScale ? 1.03 : 1, 
    y: -8,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20
    }
  }
})

/**
 * 计算卡片类名
 */
const cardClasses = computed(() => ({
  'moe-card': true,
  [`moe-card--${props.variant}`]: true,
  'moe-card--float': props.float,
  'moe-card--hover': props.hoverScale,
  'moe-card--glow': props.glow,
  'moe-card--hovered': isHovered.value,
  [`moe-card--float-${props.floatIntensity}`]: props.float
}))

/**
 * 计算卡片样式
 * 浮动动画使用 CSS 变量控制强度
 */
const cardStyle = computed(() => {
  const styles = {}
  
  if (props.float) {
    const intensity = props.floatIntensity
    styles['--float-amount'] = `${10 * intensity}px`
    styles['--float-duration'] = `${3 / intensity}s`
  }
  
  return styles
})

/**
 * 鼠标进入处理
 */
const handleMouseEnter = () => {
  isHovered.value = true
  motionVariant.value = 'hovered'
}

/**
 * 鼠标离开处理
 */
const handleMouseLeave = () => {
  isHovered.value = false
  motionVariant.value = 'initial'
}
</script>

<style lang="scss" scoped>
.moe-card {
  position: relative;
  background: var(--moe-bg-tertiary);
  border-radius: var(--moe-radius-lg);
  overflow: hidden;
  transition: all var(--moe-duration-normal) var(--moe-ease-smooth);
  
  // 变体样式 - 默认
  &--default {
    box-shadow: var(--moe-shadow-md);
    border: 1px solid rgba(255, 182, 193, 0.1);
    
    &:hover {
      box-shadow: var(--moe-shadow-hover);
      border-color: rgba(255, 182, 193, 0.3);
    }
  }
  
  // 变体样式 - 扁平
  &--flat {
    box-shadow: none;
    border: 1px solid rgba(255, 182, 193, 0.2);
    
    &:hover {
      background: var(--moe-bg-secondary);
    }
  }
  
  // 变体样式 - 轮廓
  &--outlined {
    background: transparent;
    box-shadow: none;
    border: 2px solid var(--moe-primary-light);
    
    &:hover {
      background: var(--moe-primary-soft);
      border-color: var(--moe-primary);
    }
  }
  
  // 变体样式 - 强调
  &--elevated {
    box-shadow: var(--moe-shadow-lg);
    border: none;
    
    &:hover {
      box-shadow: var(--moe-shadow-xl);
      transform: translateY(-12px);
    }
  }
  
  // 浮动动画
  &--float {
    animation: card-float var(--float-duration, 3s) ease-in-out infinite;
    
    &:hover {
      animation-play-state: paused;
    }
  }
  
  &--float-1 {
    --float-amount: 10px;
  }
  
  &--float-2 {
    --float-amount: 15px;
  }
  
  &--float-3 {
    --float-amount: 20px;
  }
  
  // 光晕效果
  &--glow {
    .moe-card__glow {
      position: absolute;
      inset: -1px;
      background: radial-gradient(
        ellipse at center,
        rgba(255, 182, 193, 0.15) 0%,
        transparent 70%
      );
      opacity: 0;
      transition: opacity var(--moe-duration-slow);
      pointer-events: none;
      z-index: 0;
      border-radius: inherit;
    }
    
    &:hover .moe-card__glow {
      opacity: 1;
    }
  }
  
  // 角标
  &__badge {
    position: absolute;
    top: -8px;
    right: 16px;
    padding: 4px 12px;
    font-size: var(--moe-text-xs);
    font-weight: 700;
    border-radius: var(--moe-radius-full);
    z-index: 10;
    box-shadow: var(--moe-shadow-sm);
    animation: badge-bounce 2s ease-in-out infinite;
    
    &--primary {
      background: var(--moe-gradient-primary);
      color: var(--moe-text-light);
    }
    
    &--secondary {
      background: var(--moe-gradient-secondary);
      color: var(--moe-text-primary);
    }
    
    &--accent {
      background: linear-gradient(135deg, #FFD700 0%, #FFA07A 100%);
      color: var(--moe-text-primary);
    }
    
    &--success {
      background: linear-gradient(135deg, #90EE90 0%, #98FB98 100%);
      color: var(--moe-text-primary);
    }
    
    &--warning {
      background: linear-gradient(135deg, #FFD93D 0%, #FFA07A 100%);
      color: var(--moe-text-primary);
    }
  }
  
  // 头部区域
  &__header {
    padding: var(--moe-space-lg);
    border-bottom: 1px solid rgba(255, 182, 193, 0.1);
  }
  
  &__title {
    font-family: var(--moe-font-display);
    font-size: var(--moe-text-xl);
    color: var(--moe-text-primary);
    margin: 0;
    font-weight: 400;
  }
  
  // 内容区域
  &__body {
    padding: var(--moe-space-lg);
    position: relative;
    z-index: 1;
  }
  
  // 底部区域
  &__footer {
    padding: var(--moe-space-md) var(--moe-space-lg);
    border-top: 1px solid rgba(255, 182, 193, 0.1);
    background: rgba(255, 245, 247, 0.5);
  }
}

// 浮动动画关键帧
@keyframes card-float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(var(--float-amount, 10px));
  }
}

// 角标弹跳动画
@keyframes badge-bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}
</style>
