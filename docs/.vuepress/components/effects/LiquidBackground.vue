<!--
  流体渐变背景组件
  
  功能：使用 WebGL Shader 实现萌系粉色流体动画背景
  特性：
  - 基于 Three.js 和自定义 Shader
  - Simplex Noise 噪声算法生成有机流动效果
  - 樱花粉到薰衣草紫的梦幻渐变
  - 响应式设计，自动适应窗口大小
  - 性能优化：使用 requestAnimationFrame 和适当降采样
  
  使用示例：
  <LiquidBackground 
    intensity="1.5" 
    speed="0.5"
    colors="['#FFB6C1', '#E6E6FA', '#FFD1DC']"
  />
  
  @author: yy
  @date: 2026-04-11
-->
<template>
  <div class="liquid-background" :style="containerStyle">
    <canvas ref="canvasRef" class="liquid-background__canvas" />
    <div class="liquid-background__overlay" :style="overlayStyle" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import * as THREE from 'three'

/**
 * 组件 Props 定义
 * 
 * @property {number} intensity - 噪声强度 (0.5 - 3.0)
 * @property {number} speed - 动画速度 (0.1 - 2.0)
 * @property {string[]} colors - 渐变色数组
 * @property {number} opacity - 背景不透明度
 * @property {boolean} pauseOnBlur - 页面失焦时是否暂停
 */
const props = defineProps({
  intensity: {
    type: Number,
    default: 1.2,
    validator: (v) => v > 0 && v <= 5
  },
  speed: {
    type: Number,
    default: 0.4,
    validator: (v) => v > 0 && v <= 3
  },
  colors: {
    type: Array,
    default: () => ['#FFB6C1', '#E6E6FA', '#FFD1DC', '#FFF0F5']
  },
  opacity: {
    type: Number,
    default: 1
  },
  pauseOnBlur: {
    type: Boolean,
    default: true
  }
})

// Canvas 和 Three.js 相关引用
const canvasRef = ref(null)
let renderer = null
let scene = null
let camera = null
let material = null
let animationId = null
let isVisible = true

/**
 * 容器样式计算
 */
const containerStyle = computed(() => ({
  opacity: props.opacity
}))

/**
 * 遮罩层样式 - 添加微妙渐变增强层次感
 */
const overlayStyle = computed(() => {
  const gradient = `radial-gradient(ellipse at 50% 0%, 
    rgba(255, 255, 255, 0.3) 0%, 
    transparent 50%),
    radial-gradient(ellipse at 50% 100%, 
    rgba(255, 182, 193, 0.1) 0%, 
    transparent 50%)`
  
  return {
    background: gradient
  }
})

/**
 * Vertex Shader
 * 简单的全屏四边形顶点着色器
 */
const vertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`

/**
 * Fragment Shader - 流体噪声效果
 * 使用 Simplex Noise 生成有机流动图案
 */
const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uIntensity;
  uniform float uSpeed;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform vec3 uColor4;
  
  varying vec2 vUv;
  
  // Simplex Noise 3D
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
      + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  // 分形布朗运动 - 叠加多层噪声
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for (int i = 0; i < 5; i++) {
      value += amplitude * snoise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    
    return value;
  }
  
  void main() {
    vec2 uv = vUv;
    float time = uTime * uSpeed;
    
    // 创建流动效果 - 多个噪声层叠加
    float noise1 = fbm(uv * 2.0 + time * 0.1);
    float noise2 = fbm(uv * 3.0 - time * 0.15 + 100.0);
    float noise3 = fbm(uv * 1.5 + time * 0.08 + vec2(noise1 * 0.5, noise2 * 0.3));
    
    // 混合噪声值
    float finalNoise = (noise1 + noise2 * 0.5 + noise3 * 0.25) / 1.75;
    finalNoise = finalNoise * uIntensity + 0.5;
    
    // 创建颜色渐变 - 基于噪声值插值
    vec3 color;
    if (finalNoise < 0.33) {
      color = mix(uColor1, uColor2, finalNoise / 0.33);
    } else if (finalNoise < 0.66) {
      color = mix(uColor2, uColor3, (finalNoise - 0.33) / 0.33);
    } else {
      color = mix(uColor3, uColor4, (finalNoise - 0.66) / 0.34);
    }
    
    // 添加微妙的亮点
    float highlight = smoothstep(0.6, 0.8, finalNoise);
    color += vec3(0.05) * highlight;
    
    // 输出颜色
    gl_FragColor = vec4(color, 1.0);
  }
`

/**
 * 初始化 Three.js 场景
 */
const initThree = () => {
  if (!canvasRef.value) return
  
  const canvas = canvasRef.value
  const width = window.innerWidth
  const height = window.innerHeight
  
  // 创建场景
  scene = new THREE.Scene()
  
  // 创建相机 - 使用正交相机适合全屏背景
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  
  // 创建渲染器
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,
    alpha: true,
    powerPreference: 'high-performance'
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  
  // 解析颜色
  const parseColor = (hex) => {
    const color = new THREE.Color(hex)
    return [color.r, color.g, color.b]
  }
  
  // 创建 Shader 材质
  material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(width, height) },
      uIntensity: { value: props.intensity },
      uSpeed: { value: props.speed },
      uColor1: { value: new THREE.Color(props.colors[0] || '#FFB6C1') },
      uColor2: { value: new THREE.Color(props.colors[1] || '#E6E6FA') },
      uColor3: { value: new THREE.Color(props.colors[2] || '#FFD1DC') },
      uColor4: { value: new THREE.Color(props.colors[3] || '#FFF0F5') }
    }
  })
  
  // 创建全屏四边形
  const geometry = new THREE.PlaneGeometry(2, 2)
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)
  
  // 开始动画
  animate()
}

/**
 * 动画循环
 */
const animate = () => {
  if (!renderer || !scene || !camera || !material) return
  
  if (isVisible) {
    material.uniforms.uTime.value += 0.016 // 约 60fps
    renderer.render(scene, camera)
  }
  
  animationId = requestAnimationFrame(animate)
}

/**
 * 处理窗口大小变化
 */
const handleResize = () => {
  if (!renderer || !material) return
  
  const width = window.innerWidth
  const height = window.innerHeight
  
  renderer.setSize(width, height)
  material.uniforms.uResolution.value.set(width, height)
}

/**
 * 处理页面可见性变化
 */
const handleVisibilityChange = () => {
  isVisible = document.visibilityState === 'visible'
}

/**
 * 处理窗口失焦/聚焦
 */
const handleBlur = () => {
  if (props.pauseOnBlur) {
    isVisible = false
  }
}

const handleFocus = () => {
  if (props.pauseOnBlur) {
    isVisible = true
  }
}

/**
 * 监听 props 变化更新 uniform
 */
watch(() => props.intensity, (val) => {
  if (material) material.uniforms.uIntensity.value = val
})

watch(() => props.speed, (val) => {
  if (material) material.uniforms.uSpeed.value = val
})

watch(() => props.colors, (newColors) => {
  if (!material) return
  material.uniforms.uColor1.value.set(newColors[0] || '#FFB6C1')
  material.uniforms.uColor2.value.set(newColors[1] || '#E6E6FA')
  material.uniforms.uColor3.value.set(newColors[2] || '#FFD1DC')
  material.uniforms.uColor4.value.set(newColors[3] || '#FFF0F5')
}, { deep: true })

/**
 * 生命周期 - 挂载
 */
onMounted(() => {
  initThree()
  
  // 添加事件监听
  window.addEventListener('resize', handleResize)
  document.addEventListener('visibilitychange', handleVisibilityChange)
  window.addEventListener('blur', handleBlur)
  window.addEventListener('focus', handleFocus)
})

/**
 * 生命周期 - 卸载
 */
onUnmounted(() => {
  // 取消动画
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  
  // 移除事件监听
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  window.removeEventListener('blur', handleBlur)
  window.removeEventListener('focus', handleFocus)
  
  // 清理 Three.js 资源
  if (renderer) {
    renderer.dispose()
    renderer = null
  }
  
  if (material) {
    material.dispose()
    material = null
  }
  
  scene = null
  camera = null
})
</script>

<style lang="scss" scoped>
.liquid-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
  
  &__canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: block;
  }
  
  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
}
</style>
