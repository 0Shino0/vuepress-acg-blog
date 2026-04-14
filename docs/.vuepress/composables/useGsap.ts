/**
 * GSAP 动画组合式函数
 * 
 * 提供常用的 GSAP 动画封装，包括：
 * - 文字弹跳入场动画
 * - 滚动触发显现
 * - 打字机效果
 * - 数字滚动动画
 * 
 * @author: yy
 * @date: 2026-04-11
 */

import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// 注册 ScrollTrigger 插件
gsap.registerPlugin(ScrollTrigger)

/**
 * 文字弹跳入场动画
 * 适用于标题、标语等文字元素
 * 
 * @param elementRef - 目标元素引用
 * @param options - 动画配置选项
 * @returns 动画控制方法
 * 
 * @example
 * const { animate, reset } = useBounceText(titleRef, {
 *   duration: 0.8,
 *   stagger: 0.1,
 *   y: 50
 * })
 */
export function useBounceText(
  elementRef: Ref<HTMLElement | null>,
  options: {
    duration?: number
    stagger?: number
    y?: number
    scale?: number
    delay?: number
  } = {}
) {
  const {
    duration = 0.8,
    stagger = 0.05,
    y = 50,
    scale = 0.8,
    delay = 0
  } = options

  const triggers: ScrollTrigger[] = []

  /**
   * 执行动画
   */
  const animate = () => {
    if (!elementRef.value) return

    const element = elementRef.value
    const text = element.textContent || ''
    
    // 将文字拆分为单个字符
    element.innerHTML = text
      .split('')
      .map(char => 
        char === ' ' 
          ? '<span class="char">&nbsp;</span>' 
          : `<span class="char">${char}</span>`
      )
      .join('')

    const chars = element.querySelectorAll('.char')

    // 设置初始状态
    gsap.set(chars, {
      opacity: 0,
      y,
      scale,
      rotateX: -90
    })

    // 执行弹跳入场动画
    const tl = gsap.timeline({ delay })
    
    tl.to(chars, {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      duration,
      stagger,
      ease: 'back.out(1.7)',
      onComplete: () => {
        // 清理临时样式
        element.innerHTML = text
      }
    })

    return tl
  }

  /**
   * 重置状态
   */
  const reset = () => {
    if (!elementRef.value) return
    
    const chars = elementRef.value.querySelectorAll('.char')
    gsap.set(chars, { opacity: 1, y: 0, scale: 1, rotateX: 0 })
  }

  /**
   * 清理资源
   */
  const dispose = () => {
    triggers.forEach(trigger => trigger.kill())
    triggers.length = 0
  }

  onUnmounted(dispose)

  return { animate, reset, dispose }
}

/**
 * 打字机效果
 * 
 * @param elementRef - 目标元素引用
 * @param text - 要显示的完整文本
 * @param options - 配置选项
 * @returns 动画控制方法
 */
export function useTypewriter(
  elementRef: Ref<HTMLElement | null>,
  text: string,
  options: {
    speed?: number
    cursor?: boolean
    cursorChar?: string
    delay?: number
  } = {}
) {
  const {
    speed = 50,
    cursor = true,
    cursorChar = '|',
    delay = 0
  } = options

  let currentText = ''
  let charIndex = 0
  let timeoutId: NodeJS.Timeout | null = null

  /**
   * 开始打字动画
   */
  const start = () => {
    if (!elementRef.value) return

    // 添加光标样式
    if (cursor) {
      elementRef.value.classList.add('typewriter-cursor')
    }

    const typeNext = () => {
      if (charIndex < text.length) {
        currentText += text.charAt(charIndex)
        if (elementRef.value) {
          elementRef.value.textContent = currentText + (cursor ? cursorChar : '')
        }
        charIndex++
        timeoutId = setTimeout(typeNext, speed)
      } else {
        // 打字完成，闪烁光标
        if (cursor && elementRef.value) {
          blinkCursor()
        }
      }
    }

    setTimeout(typeNext, delay)
  }

  /**
   * 光标闪烁
   */
  const blinkCursor = () => {
    if (!elementRef.value || !cursor) return

    let visible = true
    const blink = () => {
      if (elementRef.value) {
        elementRef.value.textContent = currentText + (visible ? cursorChar : '')
        visible = !visible
        timeoutId = setTimeout(blink, 530)
      }
    }
    blink()
  }

  /**
   * 立即停止
   */
  const stop = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  /**
   * 重置
   */
  const reset = () => {
    stop()
    currentText = ''
    charIndex = 0
    if (elementRef.value) {
      elementRef.value.textContent = ''
    }
  }

  /**
   * 完整显示（跳过动画）
   */
  const complete = () => {
    stop()
    currentText = text
    if (elementRef.value) {
      elementRef.value.textContent = text
    }
  }

  onUnmounted(stop)

  return { start, stop, reset, complete }
}

/**
 * 滚动触发显现动画
 * 
 * @param elementRef - 目标元素引用
 * @param options - 动画配置
 * @returns ScrollTrigger 实例
 */
export function useScrollReveal(
  elementRef: Ref<HTMLElement | null>,
  options: {
    y?: number
    x?: number
    opacity?: number
    scale?: number
    duration?: number
    delay?: number
    start?: string
    markers?: boolean
    once?: boolean
  } = {}
) {
  const {
    y = 50,
    x = 0,
    opacity = 0,
    scale = 1,
    duration = 0.8,
    delay = 0,
    start = 'top 80%',
    markers = false,
    once = true
  } = options

  let trigger: ScrollTrigger | null = null

  onMounted(() => {
    if (!elementRef.value) return

    // 设置初始状态
    gsap.set(elementRef.value, {
      y,
      x,
      opacity,
      scale
    })

    // 创建滚动触发
    trigger = ScrollTrigger.create({
      trigger: elementRef.value,
      start,
      markers,
      once,
      onEnter: () => {
        gsap.to(elementRef.value, {
          y: 0,
          x: 0,
          opacity: 1,
          scale: 1,
          duration,
          delay,
          ease: 'power3.out'
        })
      }
    })
  })

  onUnmounted(() => {
    if (trigger) {
      trigger.kill()
    }
  })

  return { trigger }
}

/**
 * 列表交错入场动画
 * 适用于卡片列表、网格等
 * 
 * @param containerRef - 容器元素引用
 * @param itemSelector - 子元素选择器
 * @param options - 动画配置
 */
export function useStaggerReveal(
  containerRef: Ref<HTMLElement | null>,
  itemSelector: string,
  options: {
    y?: number
    opacity?: number
    scale?: number
    duration?: number
    stagger?: number
    start?: string
  } = {}
) {
  const {
    y = 60,
    opacity = 0,
    scale = 0.9,
    duration = 0.6,
    stagger = 0.1,
    start = 'top 80%'
  } = options

  let trigger: ScrollTrigger | null = null

  onMounted(() => {
    if (!containerRef.value) return

    const items = containerRef.value.querySelectorAll(itemSelector)
    
    if (items.length === 0) return

    // 设置初始状态
    gsap.set(items, { y, opacity, scale })

    // 创建滚动触发
    trigger = ScrollTrigger.create({
      trigger: containerRef.value,
      start,
      once: true,
      onEnter: () => {
        gsap.to(items, {
          y: 0,
          opacity: 1,
          scale: 1,
          duration,
          stagger,
          ease: 'back.out(1.4)'
        })
      }
    })
  })

  onUnmounted(() => {
    if (trigger) {
      trigger.kill()
    }
  })

  return { trigger }
}

/**
 * 数字滚动动画
 * 
 * @param elementRef - 目标元素引用
 * @param targetValue - 目标数值
 * @param options - 动画配置
 * @returns 动画控制方法
 */
export function useCountUp(
  elementRef: Ref<HTMLElement | null>,
  targetValue: number,
  options: {
    duration?: number
    delay?: number
    suffix?: string
    prefix?: string
  } = {}
) {
  const {
    duration = 2,
    delay = 0,
    suffix = '',
    prefix = ''
  } = options

  let obj = { value: 0 }
  let tween: gsap.core.Tween | null = null

  /**
   * 开始计数动画
   */
  const start = () => {
    if (!elementRef.value) return

    tween = gsap.to(obj, {
      value: targetValue,
      duration,
      delay,
      ease: 'power2.out',
      onUpdate: () => {
        if (elementRef.value) {
          elementRef.value.textContent = 
            prefix + Math.round(obj.value).toLocaleString() + suffix
        }
      }
    })
  }

  /**
   * 重置
   */
  const reset = () => {
    if (tween) {
      tween.kill()
    }
    obj.value = 0
    if (elementRef.value) {
      elementRef.value.textContent = prefix + '0' + suffix
    }
  }

  onUnmounted(() => {
    if (tween) tween.kill()
  })

  return { start, reset }
}

/**
 * 视差滚动效果
 * 
 * @param elementRef - 目标元素引用
 * @param speed - 视差速度 (0.1 - 1.0)
 */
export function useParallax(
  elementRef: Ref<HTMLElement | null>,
  speed: number = 0.3
) {
  let trigger: ScrollTrigger | null = null

  onMounted(() => {
    if (!elementRef.value) return

    trigger = ScrollTrigger.create({
      trigger: elementRef.value,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        if (elementRef.value) {
          const yMove = self.progress * 100 * speed
          gsap.set(elementRef.value, { y: yMove })
        }
      }
    })
  })

  onUnmounted(() => {
    if (trigger) trigger.kill()
  })

  return { trigger }
}

export default {
  useBounceText,
  useTypewriter,
  useScrollReveal,
  useStaggerReveal,
  useCountUp,
  useParallax
}
