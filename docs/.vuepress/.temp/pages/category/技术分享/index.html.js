import comp from "E:/Program/Code/demo/AI Demo/acg-blog/docs/.vuepress/.temp/pages/category/技术分享/index.html.vue"
const data = JSON.parse("{\"path\":\"/category/%E6%8A%80%E6%9C%AF%E5%88%86%E4%BA%AB/\",\"title\":\"技术分享\",\"lang\":\"zh-CN\",\"frontmatter\":{\"title\":\"技术分享\",\"sidebar\":false,\"blog\":{\"type\":\"category\",\"name\":\"技术分享\",\"key\":\"category\"},\"layout\":\"Category\"},\"headers\":[],\"git\":{},\"filePathRelative\":null,\"excerpt\":\"\"}")
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
