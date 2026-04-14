import comp from "E:/Program/Code/demo/AI Demo/acg-blog/docs/.vuepress/.temp/pages/category/category-a/index.html.vue"
const data = JSON.parse("{\"path\":\"/category/category-a/\",\"title\":\"Category A\",\"lang\":\"zh-CN\",\"frontmatter\":{\"title\":\"Category A\",\"sidebar\":false,\"blog\":{\"type\":\"category\",\"name\":\"Category A\",\"key\":\"category\"},\"layout\":\"Category\"},\"headers\":[],\"git\":{},\"filePathRelative\":null,\"excerpt\":\"\"}")
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
