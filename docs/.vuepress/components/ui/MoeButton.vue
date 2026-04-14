<!--
  萌系按钮组件
  
  功能：提供多种风格的萌系动画按钮
  特性：
  - 弹性悬浮效果
  - 点击波纹动画
  - 加载状态动画
  - 多种主题变体 (primary, secondary, accent, ghost)
  
  使用示例：
  <MoeButton variant="primary" size="md" @click="handleClick">
    点击我
  </MoeButton>
  
  @author: yy
  @date: 2026-04-11
-->
<template>
  <button
    ref="buttonRef"
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- 波纹效果容器 -->
    <span class="moe-button__ripple-container">
      <span
        v-for="ripple in ripples"
        :key="ripple.id"
        class="moe-button__ripple"
        :style="ripple.style"
      />
    </span>
    
    <!-- 加载动画 -->
    <span v-if="loading" class="moe-button__loader">
      <span class="moe-button__loader-dot" />
      <span class="moe-button__loader-dot" />
      <span class="moe-button__loader-dot" />
    </span>
    
    <!-- 按钮内容 -->
    <span :class="['moe-button__content', { 'moe-button__content--hidden': loading }]">
      <slot />
    </span>
    
    <!-- 装饰元素 -->
    <span class="moe-button__decoration" />
  </button>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMotion } from '@vueuse/motion'

/**
 * 按钮组件 Props 定义
 * 
 * @property {string} variant - 按钮主题变体
 * @property {string} size - 按钮尺寸
 * @property {boolean} disabled - 是否禁用
 * @property {boolean} loading - 是否加载中
 * @property {boolean} block - 是否块级显示
 * @property {boolean} rounded - 是否完全圆角
 */
const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'accent', 'ghost', 'gradient'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  block: {
    type: Boolean,
    default: false
  },
  rounded: {
    type: Boolean,
    default: false
  }
})

/**
 * 按钮事件定义
 */
const emit = defineEmits(['click'])

// 按钮 DOM 引用
const buttonRef = ref(null)

// 波纹动画状态
const ripples = ref([])
let rippleId = 0

/**
 * 使用 Motion One 添加悬浮动画
 * 弹跳曲线营造可爱效果
 */
const { variant: motionVariant } = useMotion(buttonRef, {
  initial: { scale: 1, y: 0 },
  hovered: { 
    scale: 1.05, 
    y: -2,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 17
    }
  },
  tapped: { 
    scale: 0.95,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 17
    }
  }
})

/**
 * 计算按钮类名
 * 根据 props 组合不同的样式类
 */
const buttonClasses = computed(() => ({
  'moe-button': true,
  [`moe-button--${props.variant}`]: true,
  [`moe-button--${props.size}`]: true,
  'moe-button--block': props.block,
  'moe-button--rounded': props.rounded,
  'moe-button--disabled': props.disabled || props.loading,
  'moe-button--loading': props.loading
}))

/**
 * 处理点击事件
 * 触发波纹动画并发射 click 事件
 * 
 * @param {MouseEvent} event - 鼠标事件对象
 */
const handleClick = (event) => {
  if (props.disabled || props.loading) return
  
  // 创建波纹效果
  createRipple(event)
  
  // 发射点击事件
  emit('click', event)
}

/**
 * 创建点击波纹动画
 * 从点击位置扩散的圆形波纹
 * 
 * @param {MouseEvent} event - 鼠标事件对象
 */
const createRipple = (event) => {
  const button = buttonRef.value
  const rect = button.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  const id = rippleId++
  const size = Math.max(rect.width, rect.height) * 2
  
  ripples.value.push({
    id,
    style: {
      left: `${x - size / 2}px`,
      top: `${y - size / 2}px`,
      width: `${size}px`,
      height: `${size}px`
    }
  })
  
  // 动画结束后移除波纹
  setTimeout(() => {
    const index = ripples.value.findIndex(r => r.id === id)
    if (index > -1) {
      ripples.value.splice(index, 1)
    }
  }, 600)
}

/**
 * 鼠标进入时的处理
 * 触发 Motion 悬浮动画
 */
const handleMouseEnter = () => {
  if (!props.disabled && !props.loading) {
    motionVariant.value = 'hovered'
  }
}

/**
 * 鼠标离开时的处理
 * 恢复初始状态
 */
const handleMouseLeave = () => {
  motionVariant.value = 'initial'
}
</script>

<style lang="scss" scoped>
// 基础按钮样式
.moe-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: var(--moe-font-primary);
  font-weight: 600;
  cursor: pointer;
  border: none;
  outline: none;
  overflow: hidden;
  transition: all var(--moe-duration-normal) var(--moe-ease-smooth);
  
  // 尺寸变体
  &--sm {
    padding: 8px 16px;
    font-size: var(--moe-text-sm);
    border-radius: var(--moe-radius-sm);
  }
  
  &--md {
    padding: 12px 24px;
    font-size: var(--moe-text-base);
    border-radius: var(--moe-radius-md);
  }
  
  &--lg {
    padding: 16px 32px;
    font-size: var(--moe-text-lg);
    border-radius: var(--moe-radius-lg);
  }
  
  // 完全圆角
  &--rounded {
    border-radius: var(--moe-radius-full);
  }
  
  // 块级按钮
  &--block {
    display: flex;
    width: 100%;
  }
  
  // 主题变体 - Primary (樱花粉)
  &--primary {
    background: var(--moe-gradient-primary);
    color: var(--moe-text-light);
    box-shadow: var(--moe-shadow-md);
    
    &:hover:not(:disabled) {
      box-shadow: var(--moe-shadow-hover);
      filter: brightness(1.05);
    }
    
    &:active:not(:disabled) {
      transform: scale(0.98);
    }
    
    .moe-button__ripple {
      background: rgba(255, 255, 255, 0.4);
    }
  }
  
  // 主题变体 - Secondary (薰衣草紫)
  &--secondary {
    background: var(--moe-gradient-secondary);
    color: var(--moe-text-primary);
    box-shadow: var(--moe-shadow-sm);
    
    &:hover:not(:disabled) {
      box-shadow: var(--moe-shadow-md);
      background: linear-gradient(135deg, #F0E6FF 0%, #FFE4E9 100%);
    }
    
    .moe-button__ripple {
      background: rgba(255, 182, 193, 0.3);
    }
  }
  
  // 主题变体 - Accent (阳光金)
  &--accent {
    background: linear-gradient(135deg, #FFD700 0%, #FFA07A 100%);
    color: var(--moe-text-primary);
    box-shadow: 0 4px 16px rgba(255, 215, 0, 0.3);
    
    &:hover:not(:disabled) {
      box-shadow: 0 8px 32px rgba(255, 215, 0, 0.4);
      filter: brightness(1.05);
    }
    
    .moe-button__ripple {
      background: rgba(255, 255, 255, 0.4);
    }
  }
  
  // 主题变体 - Ghost (幽灵按钮)
  &--ghost {
    background: transparent;
    color: var(--moe-text-primary);
    border: 2px solid var(--moe-primary-light);
    
    &:hover:not(:disabled) {
      background: var(--moe-primary-soft);
      border-color: var(--moe-primary);
    }
    
    .moe-button__ripple {
      background: rgba(255, 182, 193, 0.2);
    }
  }
  
  // 主题变体 - Gradient (糖果渐变)
  &--gradient {
    background: var(--moe-gradient-candy);
    color: var(--moe-text-light);
    box-shadow: var(--moe-shadow-md);
    
    &:hover:not(:disabled) {
      box-shadow: var(--moe-shadow-hover);
      filter: brightness(1.05);
    }
    
    .moe-button__ripple {
      background: rgba(255, 255, 255, 0.4);
    }
  }
  
  // 禁用状态
  &--disabled {
    cursor: not-allowed;
    opacity: 0.6;
    filter: grayscale(0.3);
  }
  
  // 加载状态
  &--loading {
    cursor: wait;
  }
}

// 波纹容器
.moe-button__ripple-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  border-radius: inherit;
}

// 波纹元素
.moe-button__ripple {
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  animation: ripple-effect 0.6s ease-out;
  pointer-events: none;
}

@keyframes ripple-effect {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

// 加载动画
.moe-button__loader {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.moe-button__loader-dot {
  width: 6px;
  height: 6px;
  background: currentColor;
  border-radius: 50%;
  animation: loader-bounce 1.4s ease-in-out infinite both;
  
  &:nth-child(1) {
    animation-delay: -0.32s;
  }
  
  &:nth-child(2) {
    animation-delay: -0.16s;
  }
}

@keyframes loader-bounce {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

// 按钮内容
.moe-button__content {
  display: flex;
  align-items: center;
  gap: 8px;
  
  &--hidden {
    opacity: 0;
  }
}

// 装饰元素 - 微妙的光晕效果
.moe-button__decoration {
  position: absolute;
  inset: -2px;
  background: linear-gradient(135deg, 
    rgba(255, 182, 193, 0.2) 0%, 
    rgba(255, 255, 255, 0) 50%, 
    rgba(230, 230, 250, 0.2) 100%
  );
  border-radius: inherit;
  opacity: 0;
  transition: opacity var(--moe-duration-normal);
  pointer-events: none;
  z-index: -1;
}

.moe-button:hover .moe-button__decoration {
  opacity: 1;
}
</style>
