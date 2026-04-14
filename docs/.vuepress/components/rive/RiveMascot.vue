<!--
  Rive 吉祥物互动组件
  
  功能：展示可交互的萌系 Rive 动画角色
  特性：
  - 点击切换不同表情状态
  - 鼠标跟随视线
  - 悬停时的可爱反应动画
  - 支持多种角色状态（idle, happy, surprised, sleepy）
  
  使用示例：
  <RiveMascot 
    src="/rive/mascot.riv"
    :state-machines="['State Machine 1']"
    @click="handleMascotClick"
  />
  
  @author: yy
  @date: 2026-04-11
-->
<template>
  <div 
    ref="containerRef"
    class="rive-mascot"
    :class="{
      'rive-mascot--hovered': isHovered,
      [`rive-mascot--state-${currentState}`]: true
    }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @click="handleClick"
  >
    <!-- Rive Canvas -->
    <canvas 
      ref="canvasRef"
      class="rive-mascot__canvas"
      :width="size"
      :height="size"
    />
    
    <!-- 状态指示器 -->
    <div class="rive-mascot__status">
      <span class="rive-mascot__status-dot" :class="`rive-mascot__status-dot--${currentState}`" />
      <span class="rive-mascot__status-text">{{ statusText }}</span>
    </div>
    
    <!-- 交互提示 -->
    <div v-if="showHint" class="rive-mascot__hint">
      <span>✨ 点击我！</span>
    </div>
    
    <!-- 装饰气泡 -->
    <div 
      v-for="(bubble, index) in bubbles"
      :key="bubble.id"
      class="rive-mascot__bubble"
      :style="bubble.style"
    >
      {{ bubble.emoji }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { Rive, Layout, Fit, Alignment } from '@rive-app/canvas'

/**
 * 组件 Props 定义
 * 
 * @property {string} src - Rive 文件路径
 * @property {string[]} stateMachines - 状态机名称列表
 * @property {number} size - 画布尺寸
 * @property {boolean} autoplay - 是否自动播放
 * @property {string} initialState - 初始状态
 */
const props = defineProps({
  src: {
    type: String,
    default: '/rive/mascot.riv'
  },
  stateMachines: {
    type: Array,
    default: () => ['State Machine 1']
  },
  size: {
    type: Number,
    default: 200
  },
  autoplay: {
    type: Boolean,
    default: true
  },
  initialState: {
    type: String,
    default: 'idle'
  }
})

/**
 * 组件事件定义
 */
const emit = defineEmits(['stateChange', 'click'])

// DOM 引用
const containerRef = ref(null)
const canvasRef = ref(null)

// Rive 实例
let riveInstance = null
let stateMachineInstance = null

// 状态
const currentState = ref(props.initialState)
const isHovered = ref(false)
const showHint = ref(true)

// 气泡动画
const bubbles = ref([])
let bubbleId = 0

/**
 * 状态文本映射
 */
const statusText = computed(() => {
  const texts = {
    idle: '休息中...',
    happy: '很开心！',
    surprised: '哇！',
    sleepy: '困困了',
    excited: '超兴奋！',
    love: '喜欢你~'
  }
  return texts[currentState.value] || 'Hello!'
})

/**
 * 状态列表
 */
const states = ['idle', 'happy', 'surprised', 'sleepy', 'excited', 'love']

/**
 * 初始化 Rive
 */
const initRive = async () => {
  if (!canvasRef.value) return
  
  try {
    // 创建 Rive 实例
    riveInstance = new Rive({
      src: props.src,
      canvas: canvasRef.value,
      layout: new Layout({
        fit: Fit.Contain,
        alignment: Alignment.Center
      }),
      autoplay: props.autoplay,
      stateMachines: props.stateMachines,
      onLoad: () => {
        // 获取状态机实例
        if (props.stateMachines.length > 0) {
          stateMachineInstance = riveInstance.stateMachineInstances(props.stateMachines[0])
        }
        
        // 调整画布大小
        riveInstance.resizeDrawingSurfaceToCanvas()
      }
    })
  } catch (error) {
    console.log('Rive 加载失败，使用备用动画:', error)
    // 使用 CSS 动画作为备用
    initFallbackAnimation()
  }
}

/**
 * 备用 CSS 动画
 */
const initFallbackAnimation = () => {
  // 如果没有 Rive 文件，显示一个可爱的 CSS 动画表情
  const canvas = canvasRef.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  // 绘制简单的萌系表情
  const drawMascot = () => {
    ctx.clearRect(0, 0, props.size, props.size)
    
    const centerX = props.size / 2
    const centerY = props.size / 2
    const radius = props.size * 0.4
    
    // 脸部
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.fillStyle = '#FFE4E9'
    ctx.fill()
    ctx.strokeStyle = '#FFB6C1'
    ctx.lineWidth = 3
    ctx.stroke()
    
    // 眼睛
    const eyeOffset = radius * 0.3
    const eyeY = centerY - radius * 0.1
    
    // 左眼
    ctx.beginPath()
    ctx.arc(centerX - eyeOffset, eyeY, 8, 0, Math.PI * 2)
    ctx.fillStyle = '#5D4E6D'
    ctx.fill()
    
    // 右眼
    ctx.beginPath()
    ctx.arc(centerX + eyeOffset, eyeY, 8, 0, Math.PI * 2)
    ctx.fillStyle = '#5D4E6D'
    ctx.fill()
    
    // 腮红
    ctx.beginPath()
    ctx.arc(centerX - radius * 0.5, centerY + radius * 0.2, 12, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255, 182, 193, 0.4)'
    ctx.fill()
    
    ctx.beginPath()
    ctx.arc(centerX + radius * 0.5, centerY + radius * 0.2, 12, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255, 182, 193, 0.4)'
    ctx.fill()
    
    // 嘴巴（根据状态变化）
    ctx.beginPath()
    if (currentState.value === 'happy' || currentState.value === 'excited' || currentState.value === 'love') {
      // 开心笑容
      ctx.arc(centerX, centerY + radius * 0.15, radius * 0.25, 0, Math.PI)
    } else if (currentState.value === 'surprised') {
      // 惊讶 O 型嘴
      ctx.ellipse(centerX, centerY + radius * 0.2, 10, 15, 0, 0, Math.PI * 2)
    } else if (currentState.value === 'sleepy') {
      // 困倦嘴
      ctx.moveTo(centerX - 10, centerY + radius * 0.25)
      ctx.quadraticCurveTo(centerX, centerY + radius * 0.3, centerX + 10, centerY + radius * 0.25)
    } else {
      // 默认微笑
      ctx.arc(centerX, centerY + radius * 0.15, radius * 0.2, 0.2, Math.PI - 0.2)
    }
    ctx.strokeStyle = '#5D4E6D'
    ctx.lineWidth = 3
    ctx.stroke()
  }
  
  // 初始绘制
  drawMascot()
  
  // 状态变化时重绘
  watch(currentState, drawMascot)
  
  // 添加眨眼动画
  let blinkInterval = setInterval(() => {
    // 短暂闭眼效果
    const eyeOffset = radius * 0.3
    const eyeY = centerY - radius * 0.1
    
    ctx.fillStyle = '#FFE4E9'
    ctx.fillRect(centerX - eyeOffset - 10, eyeY - 10, 20, 20)
    ctx.fillRect(centerX + eyeOffset - 10, eyeY - 10, 20, 20)
    
    // 闭眼线条
    ctx.beginPath()
    ctx.moveTo(centerX - eyeOffset - 8, eyeY)
    ctx.quadraticCurveTo(centerX - eyeOffset, eyeY + 5, centerX - eyeOffset + 8, eyeY)
    ctx.moveTo(centerX + eyeOffset - 8, eyeY)
    ctx.quadraticCurveTo(centerX + eyeOffset, eyeY + 5, centerX + eyeOffset + 8, eyeY)
    ctx.strokeStyle = '#5D4E6D'
    ctx.lineWidth = 2
    ctx.stroke()
    
    // 150ms 后恢复
    setTimeout(drawMascot, 150)
  }, 4000)
  
  // 清理函数
  onUnmounted(() => {
    clearInterval(blinkInterval)
  })
}

/**
 * 切换状态
 */
const changeState = (newState) => {
  currentState.value = newState
  emit('stateChange', newState)
  
  // 触发状态机输入（如果有）
  if (stateMachineInstance) {
    const inputs = stateMachineInstance.inputs
    const triggerInput = inputs.find(input => input.name === newState)
    if (triggerInput) {
      triggerInput.fire()
    }
  }
  
  // 创建气泡效果
  createBubble()
}

/**
 * 创建气泡效果
 */
const createBubble = () => {
  const emojis = {
    idle: ['💤', '😌'],
    happy: ['😊', '🌸', '✨'],
    surprised: ['😮', '❗', '🌟'],
    sleepy: ['😴', '💤', '🌙'],
    excited: ['🎉', '✨', '💖', '🌈'],
    love: ['💖', '💕', '😍', '💗']
  }
  
  const stateEmojis = emojis[currentState.value] || ['✨']
  const emoji = stateEmojis[Math.floor(Math.random() * stateEmojis.length)]
  
  const id = bubbleId++
  const bubble = {
    id,
    emoji,
    style: {
      left: `${20 + Math.random() * 60}%`,
      animationDuration: `${1 + Math.random()}s`
    }
  }
  
  bubbles.value.push(bubble)
  
  // 动画结束后移除
  setTimeout(() => {
    const index = bubbles.value.findIndex(b => b.id === id)
    if (index > -1) {
      bubbles.value.splice(index, 1)
    }
  }, 2000)
}

/**
 * 切换到下一个状态
 */
const nextState = () => {
  const currentIndex = states.indexOf(currentState.value)
  const nextIndex = (currentIndex + 1) % states.length
  changeState(states[nextIndex])
}

/**
 * 处理鼠标进入
 */
const handleMouseEnter = () => {
  isHovered.value = true
  showHint.value = false
  
  // 如果 Rive 实例存在，触发悬停状态
  if (riveInstance) {
    riveInstance.play()
  }
}

/**
 * 处理鼠标离开
 */
const handleMouseLeave = () => {
  isHovered.value = false
  
  // 如果 Rive 实例存在，暂停或减速
  if (riveInstance && currentState.value === 'idle') {
    // 保持播放或根据需求调整
  }
}

/**
 * 处理点击
 */
const handleClick = () => {
  nextState()
  emit('click', currentState.value)
}

/**
 * 生命周期 - 挂载
 */
onMounted(() => {
  // 延迟初始化确保 DOM 就绪
  setTimeout(initRive, 100)
  
  // 5秒后隐藏提示
  setTimeout(() => {
    showHint.value = false
  }, 5000)
})

/**
 * 生命周期 - 卸载
 */
onUnmounted(() => {
  if (riveInstance) {
    riveInstance.cleanup()
    riveInstance = null
  }
})

/**
 * 暴露方法
 */
defineExpose({
  changeState,
  nextState
})
</script>

<style lang="scss" scoped>
.rive-mascot {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  
  // 悬浮效果
  &:hover {
    .rive-mascot__canvas {
      transform: scale(1.05);
    }
  }
  
  &--hovered {
    .rive-mascot__canvas {
      filter: drop-shadow(0 8px 24px rgba(255, 182, 193, 0.4));
    }
  }
  
  // 各状态的特效
  &--state-happy {
    .rive-mascot__canvas {
      animation: happy-bounce 0.5s ease-in-out;
    }
  }
  
  &--state-excited {
    .rive-mascot__canvas {
      animation: excited-shake 0.5s ease-in-out;
    }
  }
  
  &--state-love {
    .rive-mascot__canvas {
      animation: love-pulse 1s ease-in-out;
    }
  }
  
  &__canvas {
    border-radius: 50%;
    transition: transform var(--moe-duration-normal) var(--moe-ease-bounce),
                filter var(--moe-duration-normal);
  }
  
  &__status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.75rem;
    background: var(--moe-bg-tertiary);
    border-radius: var(--moe-radius-full);
    box-shadow: var(--moe-shadow-sm);
  }
  
  &__status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    
    &--idle {
      background: #90EE90;
      animation: dot-pulse 2s ease-in-out infinite;
    }
    
    &--happy,
    &--excited,
    &--love {
      background: var(--moe-primary);
      animation: dot-pulse 0.5s ease-in-out infinite;
    }
    
    &--surprised {
      background: var(--moe-accent);
    }
    
    &--sleepy {
      background: var(--moe-secondary-dark);
      animation: dot-pulse 3s ease-in-out infinite;
    }
  }
  
  &__status-text {
    font-size: var(--moe-text-xs);
    color: var(--moe-text-secondary);
    font-weight: 500;
  }
  
  &__hint {
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.25rem 0.75rem;
    background: var(--moe-gradient-primary);
    color: var(--moe-text-light);
    border-radius: var(--moe-radius-md);
    font-size: var(--moe-text-xs);
    font-weight: 600;
    white-space: nowrap;
    animation: hint-bounce 1s ease-in-out infinite;
    box-shadow: var(--moe-shadow-md);
    
    &::after {
      content: '';
      position: absolute;
      bottom: -6px;
      left: 50%;
      transform: translateX(-50%);
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 6px solid var(--moe-primary);
    }
  }
  
  &__bubble {
    position: absolute;
    font-size: 1.5rem;
    animation: bubble-float 2s ease-out forwards;
    pointer-events: none;
  }
}

// 动画关键帧
@keyframes happy-bounce {
  0%, 100% {
    transform: scale(1) translateY(0);
  }
  50% {
    transform: scale(1.1) translateY(-10px);
  }
}

@keyframes excited-shake {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-10deg);
  }
  75% {
    transform: rotate(10deg);
  }
}

@keyframes love-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
}

@keyframes dot-pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.8);
  }
}

@keyframes hint-bounce {
  0%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(-5px);
  }
}

@keyframes bubble-float {
  0% {
    opacity: 1;
    transform: translateY(0) scale(0.5);
  }
  100% {
    opacity: 0;
    transform: translateY(-100px) scale(1.2);
  }
}
</style>
