<!--
  粒子系统组件
  
  功能：实现樱花飘落、星星闪烁等氛围粒子效果
  特性：
  - 多种粒子类型 (樱花、星星、爱心、泡泡)
  - 可配置粒子数量、大小、速度
  - 鼠标交互：粒子会轻微避开鼠标
  - 性能优化：对象池复用粒子对象
  
  使用示例：
  <ParticleField 
    type="sakura"
    :count="50"
    :speed="0.5"
    interactive
  />
  
  @author: yy
  @date: 2026-04-11
-->
<template>
  <canvas
    ref="canvasRef"
    class="particle-field"
    :class="`particle-field--${type}`"
    :style="canvasStyle"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

/**
 * 组件 Props 定义
 * 
 * @property {string} type - 粒子类型 (sakura, star, heart, bubble, snow)
 * @property {number} count - 粒子数量
 * @property {number} speed - 下落速度系数
 * @property {boolean} interactive - 是否启用鼠标交互
 * @property {number} opacity - 整体不透明度
 * @property {string} blendMode - Canvas 混合模式
 */
const props = defineProps({
  type: {
    type: String,
    default: 'sakura',
    validator: (v) => ['sakura', 'star', 'heart', 'bubble', 'snow'].includes(v)
  },
  count: {
    type: Number,
    default: 40,
    validator: (v) => v > 0 && v <= 200
  },
  speed: {
    type: Number,
    default: 1,
    validator: (v) => v > 0 && v <= 5
  },
  interactive: {
    type: Boolean,
    default: false
  },
  opacity: {
    type: Number,
    default: 0.8
  },
  blendMode: {
    type: String,
    default: 'source-over'
  }
})

// Canvas 引用和上下文
const canvasRef = ref(null)
let ctx = null
let animationId = null
let particles = []
let mouse = { x: -1000, y: -1000 }
let isVisible = true

/**
 * Canvas 样式
 */
const canvasStyle = computed(() => ({
  opacity: props.opacity
}))

/**
 * 粒子类定义
 */
class Particle {
  constructor(canvasWidth, canvasHeight) {
    this.reset(canvasWidth, canvasHeight, true)
  }
  
  /**
   * 重置粒子状态
   * @param {number} w - 画布宽度
   * @param {number} h - 画布高度
   * @param {boolean} initial - 是否为初始放置
   */
  reset(w, h, initial = false) {
    this.x = Math.random() * w
    this.y = initial ? Math.random() * h : -50
    this.size = this.getRandomSize()
    this.speedY = (Math.random() * 0.5 + 0.5) * props.speed
    this.speedX = (Math.random() - 0.5) * 0.5 * props.speed
    this.rotation = Math.random() * 360
    this.rotationSpeed = (Math.random() - 0.5) * 2
    this.opacity = Math.random() * 0.5 + 0.3
    this.sway = Math.random() * 20 + 10
    this.swayOffset = Math.random() * Math.PI * 2
    
    // 类型特定属性
    if (props.type === 'sakura') {
      this.color = this.getSakuraColor()
    } else if (props.type === 'star') {
      this.color = this.getStarColor()
      this.twinkleSpeed = Math.random() * 0.05 + 0.02
      this.twinklePhase = Math.random() * Math.PI * 2
    } else if (props.type === 'heart') {
      this.color = this.getHeartColor()
    } else if (props.type === 'bubble') {
      this.color = 'rgba(255, 255, 255, 0.3)'
    } else if (props.type === 'snow') {
      this.color = 'rgba(255, 255, 255, 0.8)'
    }
  }
  
  /**
   * 获取樱花颜色
   */
  getSakuraColor() {
    const colors = [
      'rgba(255, 182, 193, 0.8)', // 樱花粉
      'rgba(255, 192, 203, 0.8)', // 浅粉
      'rgba(255, 209, 220, 0.8)', // 淡粉
      'rgba(255, 228, 225, 0.7)',  // 玫瑰粉
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }
  
  /**
   * 获取星星颜色
   */
  getStarColor() {
    const colors = [
      '#FFD700', // 金色
      '#FFA500', // 橙色
      '#FF69B4', // 热粉
      '#E6E6FA', // 薰衣草
      '#FFFFFF', // 白色
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }
  
  /**
   * 获取爱心颜色
   */
  getHeartColor() {
    const colors = [
      'rgba(255, 105, 180, 0.8)', // 热粉
      'rgba(255, 20, 147, 0.8)',  // 深粉
      'rgba(255, 182, 193, 0.8)', // 浅粉
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }
  
  /**
   * 获取随机大小
   */
  getRandomSize() {
    const baseSizes = {
      sakura: { min: 8, max: 20 },
      star: { min: 3, max: 8 },
      heart: { min: 10, max: 18 },
      bubble: { min: 5, max: 15 },
      snow: { min: 2, max: 6 }
    }
    const { min, max } = baseSizes[props.type]
    return Math.random() * (max - min) + min
  }
  
  /**
   * 更新粒子位置
   * @param {number} w - 画布宽度
   * @param {number} h - 画布高度
   * @param {number} time - 当前时间
   */
  update(w, h, time) {
    // 摇摆运动
    this.x += this.speedX + Math.sin(time * 0.001 + this.swayOffset) * 0.5
    this.y += this.speedY
    this.rotation += this.rotationSpeed
    
    // 鼠标交互 - 粒子避开鼠标
    if (props.interactive) {
      const dx = this.x - mouse.x
      const dy = this.y - mouse.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      
      if (dist < 100) {
        const force = (100 - dist) / 100
        this.x += (dx / dist) * force * 2
        this.y += (dy / dist) * force * 2
      }
    }
    
    // 闪烁效果 (仅星星)
    if (props.type === 'star') {
      this.twinklePhase += this.twinkleSpeed
      this.currentOpacity = this.opacity * (0.5 + Math.sin(this.twinklePhase) * 0.5)
    } else {
      this.currentOpacity = this.opacity
    }
    
    // 边界检查 - 超出底部重置
    if (this.y > h + 50) {
      this.reset(w, h)
    }
    
    // 水平边界 - 循环
    if (this.x < -50) this.x = w + 50
    if (this.x > w + 50) this.x = -50
  }
  
  /**
   * 绘制粒子
   * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
   */
  draw(ctx) {
    ctx.save()
    ctx.globalAlpha = this.currentOpacity
    ctx.translate(this.x, this.y)
    ctx.rotate((this.rotation * Math.PI) / 180)
    
    switch (props.type) {
      case 'sakura':
        this.drawSakura(ctx)
        break
      case 'star':
        this.drawStar(ctx)
        break
      case 'heart':
        this.drawHeart(ctx)
        break
      case 'bubble':
        this.drawBubble(ctx)
        break
      case 'snow':
        this.drawSnow(ctx)
        break
    }
    
    ctx.restore()
  }
  
  /**
   * 绘制樱花花瓣
   */
  drawSakura(ctx) {
    ctx.fillStyle = this.color
    ctx.beginPath()
    
    // 绘制5瓣樱花形状
    for (let i = 0; i < 5; i++) {
      const angle = (i * 72 * Math.PI) / 180
      const x = Math.cos(angle) * this.size
      const y = Math.sin(angle) * this.size * 0.6
      
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.quadraticCurveTo(0, 0, x, y)
      }
    }
    
    ctx.closePath()
    ctx.fill()
    
    // 添加花心
    ctx.fillStyle = 'rgba(255, 228, 196, 0.6)'
    ctx.beginPath()
    ctx.arc(0, 0, this.size * 0.2, 0, Math.PI * 2)
    ctx.fill()
  }
  
  /**
   * 绘制星星
   */
  drawStar(ctx) {
    ctx.fillStyle = this.color
    ctx.beginPath()
    
    for (let i = 0; i < 5; i++) {
      const outerAngle = ((i * 72 - 90) * Math.PI) / 180
      const innerAngle = (((i * 72 + 36) - 90) * Math.PI) / 180
      
      const outerX = Math.cos(outerAngle) * this.size
      const outerY = Math.sin(outerAngle) * this.size
      const innerX = Math.cos(innerAngle) * (this.size * 0.4)
      const innerY = Math.sin(innerAngle) * (this.size * 0.4)
      
      if (i === 0) {
        ctx.moveTo(outerX, outerY)
      } else {
        ctx.lineTo(outerX, outerY)
      }
      ctx.lineTo(innerX, innerY)
    }
    
    ctx.closePath()
    ctx.fill()
    
    // 添加光晕
    ctx.shadowColor = this.color
    ctx.shadowBlur = 10
  }
  
  /**
   * 绘制爱心
   */
  drawHeart(ctx) {
    ctx.fillStyle = this.color
    ctx.beginPath()
    
    const size = this.size
    ctx.moveTo(0, size * 0.3)
    ctx.bezierCurveTo(-size * 0.5, -size * 0.2, -size, size * 0.2, 0, size)
    ctx.bezierCurveTo(size, size * 0.2, size * 0.5, -size * 0.2, 0, size * 0.3)
    
    ctx.closePath()
    ctx.fill()
  }
  
  /**
   * 绘制泡泡
   */
  drawBubble(ctx) {
    // 泡泡本体
    const gradient = ctx.createRadialGradient(
      -this.size * 0.3, -this.size * 0.3, 0,
      0, 0, this.size
    )
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)')
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)')
    
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(0, 0, this.size, 0, Math.PI * 2)
    ctx.fill()
    
    // 泡泡边框
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
    ctx.lineWidth = 1
    ctx.stroke()
    
    // 高光
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.beginPath()
    ctx.ellipse(-this.size * 0.3, -this.size * 0.3, this.size * 0.2, this.size * 0.1, -0.5, 0, Math.PI * 2)
    ctx.fill()
  }
  
  /**
   * 绘制雪花
   */
  drawSnow(ctx) {
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(0, 0, this.size, 0, Math.PI * 2)
    ctx.fill()
  }
}

/**
 * 初始化粒子系统
 */
const initParticles = () => {
  if (!canvasRef.value) return
  
  const canvas = canvasRef.value
  ctx = canvas.getContext('2d')
  
  // 设置画布大小
  resizeCanvas()
  
  // 创建粒子
  particles = []
  for (let i = 0; i < props.count; i++) {
    particles.push(new Particle(canvas.width, canvas.height))
  }
  
  // 开始动画
  animate()
}

/**
 * 调整画布大小
 */
const resizeCanvas = () => {
  if (!canvasRef.value) return
  
  const canvas = canvasRef.value
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

/**
 * 动画循环
 */
const animate = (time = 0) => {
  if (!ctx || !canvasRef.value) return
  
  const canvas = canvasRef.value
  
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.globalCompositeOperation = props.blendMode
  
  // 更新和绘制所有粒子
  particles.forEach(particle => {
    particle.update(canvas.width, canvas.height, time)
    particle.draw(ctx)
  })
  
  animationId = requestAnimationFrame(animate)
}

/**
 * 鼠标移动处理
 */
const handleMouseMove = (e) => {
  if (!props.interactive) return
  mouse.x = e.clientX
  mouse.y = e.clientY
}

/**
 * 窗口大小变化处理
 */
const handleResize = () => {
  resizeCanvas()
}

/**
 * 生命周期 - 挂载
 */
onMounted(() => {
  initParticles()
  
  // 添加事件监听
  window.addEventListener('resize', handleResize)
  if (props.interactive) {
    window.addEventListener('mousemove', handleMouseMove)
  }
})

/**
 * 生命周期 - 卸载
 */
onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('mousemove', handleMouseMove)
  
  particles = []
  ctx = null
})
</script>

<style lang="scss" scoped>
.particle-field {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}
</style>
