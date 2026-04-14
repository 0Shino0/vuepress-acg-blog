<!--
  爱心粒子爆炸组件
  
  功能：点击时触发爱心粒子爆炸效果
  特性：
  - 从点击位置发射多个爱心粒子
  - 粒子带重力、旋转和淡出效果
  - 多种爱心颜色和大小变化
  - 高性能 Canvas 渲染
  
  使用示例：
  <button @click="heartExplosion.explode($event)">
    点赞
  </button>
  <ParticleHeart ref="heartExplosion" />
  
  @author: yy
  @date: 2026-04-11
-->
<template>
  <canvas
    ref="canvasRef"
    class="particle-heart"
    :class="{ 'particle-heart--active': isActive }"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 组件暴露的方法
 */
defineExpose({
  explode
})

// Canvas 引用和上下文
const canvasRef = ref(null)
let ctx = null
let animationId = null

// 状态
const isActive = ref(false)

// 粒子数组
let particles = []

/**
 * 爱心粒子类
 */
class HeartParticle {
  constructor(x, y) {
    this.x = x
    this.y = y
    
    // 随机发射角度和速度
    const angle = (Math.random() * Math.PI * 2)
    const speed = Math.random() * 8 + 4
    this.vx = Math.cos(angle) * speed
    this.vy = Math.sin(angle) * speed - 5 // 向上偏移
    
    // 物理属性
    this.gravity = 0.3
    this.friction = 0.98
    
    // 外观属性
    this.size = Math.random() * 15 + 10
    this.rotation = Math.random() * Math.PI * 2
    this.rotationSpeed = (Math.random() - 0.5) * 0.2
    
    // 颜色
    const colors = [
      '#FF6B9D', // 热粉
      '#FF8FAB', // 浅粉
      '#FFC2D1', // 淡粉
      '#FF1744', // 深粉
      '#E91E63', // 玫红
      '#FF4081', // 粉红
      '#F50057', // 亮粉
      '#C51162', // 暗粉
    ]
    this.color = colors[Math.floor(Math.random() * colors.length)]
    
    // 生命周期
    this.life = 1
    this.decay = Math.random() * 0.02 + 0.015
    
    // 摇摆效果
    this.sway = Math.random() * 0.5
    this.swayOffset = Math.random() * Math.PI * 2
  }
  
  /**
   * 更新粒子状态
   */
  update() {
    // 应用物理
    this.vx *= this.friction
    this.vy *= this.friction
    this.vy += this.gravity
    
    // 添加摇摆
    this.vx += Math.sin(this.swayOffset) * this.sway
    this.swayOffset += 0.1
    
    // 更新位置
    this.x += this.vx
    this.y += this.vy
    
    // 更新旋转
    this.rotation += this.rotationSpeed
    
    // 衰减生命
    this.life -= this.decay
  }
  
  /**
   * 绘制爱心
   * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
   */
  draw(ctx) {
    if (this.life <= 0) return
    
    ctx.save()
    ctx.globalAlpha = this.life
    ctx.translate(this.x, this.y)
    ctx.rotate(this.rotation)
    ctx.fillStyle = this.color
    
    // 绘制爱心形状
    const s = this.size
    ctx.beginPath()
    ctx.moveTo(0, s * 0.3)
    ctx.bezierCurveTo(-s * 0.5, -s * 0.2, -s, s * 0.2, 0, s)
    ctx.bezierCurveTo(s, s * 0.2, s * 0.5, -s * 0.2, 0, s * 0.3)
    ctx.closePath()
    ctx.fill()
    
    // 添加高光
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.beginPath()
    ctx.ellipse(-s * 0.2, -s * 0.1, s * 0.15, s * 0.08, -0.5, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.restore()
  }
  
  /**
   * 检查是否存活
   */
  isAlive() {
    return this.life > 0
  }
}

/**
 * 初始化 Canvas
 */
const initCanvas = () => {
  if (!canvasRef.value) return
  
  const canvas = canvasRef.value
  ctx = canvas.getContext('2d')
  
  // 设置画布大小为全屏
  resizeCanvas()
  
  // 监听窗口大小变化
  window.addEventListener('resize', resizeCanvas)
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
 * 触发爆炸效果
 * @param {MouseEvent|{x:number,y:number}} event - 鼠标事件或位置对象
 * @param {number} count - 粒子数量
 */
function explode(event, count = 15) {
  if (!canvasRef.value || !ctx) {
    initCanvas()
  }
  
  // 获取点击位置
  let x, y
  if (event.clientX !== undefined) {
    x = event.clientX
    y = event.clientY
  } else {
    x = event.x || window.innerWidth / 2
    y = event.y || window.innerHeight / 2
  }
  
  // 创建粒子
  for (let i = 0; i < count; i++) {
    particles.push(new HeartParticle(x, y))
  }
  
  // 激活动画
  isActive.value = true
  
  // 开始动画（如果还没开始）
  if (!animationId) {
    animate()
  }
}

/**
 * 动画循环
 */
const animate = () => {
  if (!ctx || !canvasRef.value) return
  
  const canvas = canvasRef.value
  
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  // 更新和绘制所有粒子
  particles = particles.filter(particle => {
    particle.update()
    particle.draw(ctx)
    return particle.isAlive()
  })
  
  // 如果没有粒子了，停止动画
  if (particles.length === 0) {
    isActive.value = false
    animationId = null
    return
  }
  
  // 继续动画
  animationId = requestAnimationFrame(animate)
}

/**
 * 生命周期 - 挂载
 */
onMounted(() => {
  initCanvas()
})

/**
 * 生命周期 - 卸载
 */
onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  
  window.removeEventListener('resize', resizeCanvas)
  particles = []
})
</script>

<style lang="scss" scoped>
.particle-heart {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  
  &--active {
    // 激活时的样式（如果有需要）
  }
}
</style>
