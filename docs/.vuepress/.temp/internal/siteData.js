export const siteData = JSON.parse("{\"base\":\"/\",\"lang\":\"zh-CN\",\"title\":\"ACG Dream\",\"description\":\"萌系动漫博客 - 探索二次元世界的无限可能，集成顶级动效技术 GSAP、Spline、Rive、WebGL Shader\",\"head\":[[\"meta\",{\"name\":\"viewport\",\"content\":\"width=device-width,initial-scale=1,user-scalable=no\"}],[\"meta\",{\"name\":\"theme-color\",\"content\":\"#FFB6C1\"}],[\"link\",{\"rel\":\"icon\",\"href\":\"/favicon.ico\"}],[\"link\",{\"rel\":\"preconnect\",\"href\":\"https://fonts.googleapis.com\"}],[\"link\",{\"rel\":\"preconnect\",\"href\":\"https://fonts.gstatic.com\",\"crossorigin\":\"\"}]],\"locales\":{}}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateSiteData) {
    __VUE_HMR_RUNTIME__.updateSiteData(siteData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ siteData }) => {
    __VUE_HMR_RUNTIME__.updateSiteData(siteData)
  })
}
