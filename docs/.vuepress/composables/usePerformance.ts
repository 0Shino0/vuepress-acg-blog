/**
 * 性能优化工具组合式函数
 * 
 * 提供 WebGL 懒加载、移动端动效降级、性能监控等功能
 * 
 * @author: yy
 * @date: 2026-04-11
 */

import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 检测设备性能等级
 * @returns 'high' | 'medium' | 'low'
 */
export function useDevicePerformance() {
  const performanceLevel = ref<'high' | 'medium' | 'low'>('medium')
  
  onMounted(() => {
    // 检测硬件并发数
    const hardwareConcurrency = navigator.hardwareConcurrency || 4
    
    // 检测设备内存（如果可用）
    const deviceMemory = (navigator as any).deviceMemory || 4
    
    // 检测是否为移动设备
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
    
    // 检测是否开启减少动画
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    // 综合判断性能等级
    if (prefersReducedMotion || (isMobile && hardwareConcurrency <= 4)) {
      performanceLevel.value = 'low'
    } else if (hardwareConcurrency >= 8 && deviceMemory >= 8 && !isMobile) {
      performanceLevel.value = 'high'
    } else {
      performanceLevel.value = 'medium'
    }
  })
  
  return { performanceLevel }
}

/**
 * WebGL 懒加载
 * 当元素进入视口才初始化 WebGL
 */
export function useWebGLLazyLoad(
  targetRef: Ref<HTMLElement | null>,
  onIntersect: () => void
) {
  const isVisible = ref(false)
  let observer: IntersectionObserver | null = null
  
  onMounted(() => {
    if (!targetRef.value) return
    
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true
            onIntersect()
            // 只触发一次
            observer?.disconnect()
          }
        })
      },
      {
        rootMargin: '100px',
        threshold: 0.1
      }
    )
    
    observer.observe(targetRef.value)
  })
  
  onUnmounted(() => {
    observer?.disconnect()
  })
  
  return { isVisible }
}

/**
 * 移动端检测
 */
export function useIsMobile() {
  const isMobile = ref(false)
  
  onMounted(() => {
    const checkMobile = () => {
      isMobile.value = window.innerWidth <= 768 || 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    onUnmounted(() => {
      window.removeEventListener('resize', checkMobile)
    })
  })
  
  return { isMobile }
}

/**
 * 减少动画偏好检测
 */
export function useReducedMotion() {
  const prefersReducedMotion = ref(false)
  
  onMounted(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotion.value = mediaQuery.matches
    
    const handler = (e: MediaQueryListEvent) => {
      prefersReducedMotion.value = e.matches
    }
    
    mediaQuery.addEventListener('change', handler)
    
    onUnmounted(() => {
      mediaQuery.removeEventListener('change', handler)
    })
  })
  
  return { prefersReducedMotion }
}

/**
 * FPS 监控
 * 用于检测页面性能
 */
export function useFPSMonitor() {
  const fps = ref(60)
  const isLowFPS = ref(false)
  
  let frameCount = 0
  let lastTime = performance.now()
  let rafId: number | null = null
  
  const measureFPS = () => {
    frameCount++
    const currentTime = performance.now()
    
    if (currentTime - lastTime >= 1000) {
      fps.value = frameCount
      frameCount = 0
      lastTime = currentTime
      
      // 如果 FPS 低于 30，标记为低性能
      isLowFPS.value = fps.value < 30
    }
    
    rafId = requestAnimationFrame(measureFPS)
  }
  
  onMounted(() => {
    rafId = requestAnimationFrame(measureFPS)
  })
  
  onUnmounted(() => {
    if (rafId) cancelAnimationFrame(rafId)
  })
  
  return { fps, isLowFPS }
}

/**
 * 防抖函数
 */
export function useDebounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
) {
  let timer: NodeJS.Timeout | null = null
  
  const debouncedFn = (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
  
  const cancel = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }
  
  return { debouncedFn, cancel }
}

/**
 * 节流函数
 */
export function useThrottle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
) {
  let inThrottle = false
  
  const throttledFn = (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
  
  return { throttledFn }
}

/**
 * 资源预加载
 */
export function usePreload() {
  const preloadImage = (src: string) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve()
      img.onerror = reject
      img.src = src
    })
  }
  
  const prefetchComponent = (componentPath: string) => {
    // 使用动态导入预加载组件
    return import(/* @vite-ignore */ componentPath)
  }
  
  return { preloadImage, prefetchComponent }
}

export default {
  useDevicePerformance,
  useWebGLLazyLoad,
  useIsMobile,
  useReducedMotion,
  useFPSMonitor,
  useDebounce,
  useThrottle,
  usePreload
}
