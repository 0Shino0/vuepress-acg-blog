import comp from "E:/Program/Code/demo/AI Demo/acg-blog/docs/.vuepress/.temp/pages/article/index.html.vue"
const data = JSON.parse("{\"path\":\"/article/\",\"title\":\"📝 全部文章\",\"lang\":\"zh-CN\",\"frontmatter\":{\"title\":\"📝 全部文章\",\"sidebar\":false,\"blog\":{\"type\":\"type\",\"key\":\"article\"},\"layout\":\"Article\"},\"headers\":[],\"git\":{},\"filePathRelative\":null,\"excerpt\":\"\"}")
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
