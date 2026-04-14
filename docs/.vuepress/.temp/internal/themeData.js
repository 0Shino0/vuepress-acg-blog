export const themeData = JSON.parse("{\"logo\":\"https://vuejs.press/images/hero.png\",\"navbar\":[{\"text\":\"🏠 首页\",\"link\":\"/\"},{\"text\":\"📝 文章\",\"link\":\"/article/\"},{\"text\":\"📂 分类\",\"link\":\"/category/\"},{\"text\":\"🏷️ 标签\",\"link\":\"/tag/\"},{\"text\":\"📅 时间线\",\"link\":\"/timeline/\"}],\"sidebar\":{\"/posts/\":\"heading\"},\"socialLinks\":[{\"icon\":\"github\",\"link\":\"https://github.com\"}],\"footer\":\"Made with 💕 by ACG Dream\",\"copyright\":\"© 2024-2026 ACG Dream\",\"editLink\":false,\"lastUpdated\":true,\"locales\":{\"/\":{\"selectLanguageName\":\"English\"}},\"colorMode\":\"auto\",\"colorModeSwitch\":true,\"repo\":null,\"selectLanguageText\":\"Languages\",\"selectLanguageAriaLabel\":\"Select language\",\"sidebarDepth\":2,\"editLinkText\":\"Edit this page\",\"contributors\":true,\"contributorsText\":\"Contributors\",\"notFound\":[\"There's nothing here.\",\"How did we get here?\",\"That's a Four-Oh-Four.\",\"Looks like we've got some broken links.\"],\"backToHome\":\"Take me home\",\"openInNewWindow\":\"open in new window\",\"toggleColorMode\":\"toggle color mode\",\"toggleSidebar\":\"toggle sidebar\"}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateThemeData) {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ themeData }) => {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  })
}
