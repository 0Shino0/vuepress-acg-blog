export const categoriesMap = JSON.parse("{\"category\":{\"/\":{\"path\":\"/category/\",\"map\":{\"History\":{\"path\":\"/category/history/\",\"indexes\":[0,1]},\"Category A\":{\"path\":\"/category/category-a/\",\"indexes\":[2,3,4,5,6,7,8,9,10,11,12,13]},\"Category B\":{\"path\":\"/category/category-b/\",\"indexes\":[2,3,4,5,6,7,8,10,11,12]},\"技术分享\":{\"path\":\"/category/%E6%8A%80%E6%9C%AF%E5%88%86%E4%BA%AB/\",\"indexes\":[14]},\"动漫杂谈\":{\"path\":\"/category/%E5%8A%A8%E6%BC%AB%E6%9D%82%E8%B0%88/\",\"indexes\":[14]},\"Category C\":{\"path\":\"/category/category-c/\",\"indexes\":[15,16]}}}},\"tag\":{\"/\":{\"path\":\"/tag/\",\"map\":{\"WWI\":{\"path\":\"/tag/wwi/\",\"indexes\":[1]},\"WWII\":{\"path\":\"/tag/wwii/\",\"indexes\":[0]},\"tag A\":{\"path\":\"/tag/tag-a/\",\"indexes\":[5,6,7,8,9,13]},\"tag B\":{\"path\":\"/tag/tag-b/\",\"indexes\":[5,6,7,8,9,13]},\"tag C\":{\"path\":\"/tag/tag-c/\",\"indexes\":[2,3,4,10,11,12]},\"tag D\":{\"path\":\"/tag/tag-d/\",\"indexes\":[2,3,4,10,11,12]},\"VuePress\":{\"path\":\"/tag/vuepress/\",\"indexes\":[14]},\"GSAP\":{\"path\":\"/tag/gsap/\",\"indexes\":[14]},\"WebGL\":{\"path\":\"/tag/webgl/\",\"indexes\":[14]},\"萌系设计\":{\"path\":\"/tag/%E8%90%8C%E7%B3%BB%E8%AE%BE%E8%AE%A1/\",\"indexes\":[14]},\"tag E\":{\"path\":\"/tag/tag-e/\",\"indexes\":[15,16]}}}}}");

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
  if (__VUE_HMR_RUNTIME__.updateBlogCategory)
    __VUE_HMR_RUNTIME__.updateBlogCategory(categoriesMap);
}

if (import.meta.hot)
  import.meta.hot.accept(({ categoriesMap }) => {
    __VUE_HMR_RUNTIME__.updateBlogCategory(categoriesMap);
  });

