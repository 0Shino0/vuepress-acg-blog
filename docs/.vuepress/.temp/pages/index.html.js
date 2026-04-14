import comp from "E:/Program/Code/demo/AI Demo/acg-blog/docs/.vuepress/.temp/pages/index.html.vue"
const data = JSON.parse("{\"path\":\"/\",\"title\":\"ACG Dream\",\"lang\":\"zh-CN\",\"frontmatter\":{\"layout\":\"Home\",\"title\":\"ACG Dream\",\"heroImage\":\"https://vuejs.press/images/hero.png\"},\"headers\":[],\"git\":{},\"filePathRelative\":\"README.md\",\"excerpt\":\"<!--\\n  萌系动漫博客首页\\n  \\n  使用自定义 Home 布局，集成：\\n  - WebGL 流体渐变背景\\n  - 樱花飘落粒子效果\\n  - Spline 3D 场景\\n  - GSAP ScrollTrigger 滚动动画\\n  - 萌系卡片组件\\n  \\n  @author: yy\\n  @date: 2026-04-11\\n-->\\n<h1>ACG Dream</h1>\\n<p>探索二次元世界的无限可能</p>\\n\"}")
export { comp, data }

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
