/**
 * VuePress 站点主配置文件
 * 
 * 核心配置职责：
 * 1. 站点基础信息（语言、标题、描述）- 萌系动漫博客主题
 * 2. 主题配置（导航栏、Logo 等）
 * 3. 博客插件配置（分类、标签、文章类型、排序等）
 * 4. 打包器配置（Vite）
 * 
 * 博客功能设计：
 * - 文章过滤：仅处理 posts/ 目录下文件
 * - 元数据提取：标题、作者、日期、分类、标签、摘要
 * - 分类系统：category（多对多）、tag（多对多）
 * - 文章类型：article（普通文章）、timeline（时间线）
 * - 排序规则：置顶优先，然后按日期倒序
 * 
 * 动效增强：
 * - 文章详情页使用 ArticleDetail 布局
 * - 集成 GSAP ScrollTrigger 滚动动画
 * - WebGL Shader 流体背景
 * - Rive 互动吉祥物
 * 
 * @author: yy
 * @date: 2026-04-11
 */
import { blogPlugin } from '@vuepress/plugin-blog'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'

export default defineUserConfig({
  // 站点语言设置
  lang: 'zh-CN',
  
  // 站点标题（显示在导航栏和浏览器标签）
  title: 'ACG Dream',
  
  // 站点描述（用于 SEO）
  description: '萌系动漫博客 - 探索二次元世界的无限可能，集成顶级动效技术 GSAP、Spline、Rive、WebGL Shader',

  // 主题配置：继承默认主题并进行扩展
  theme: defaultTheme({
    // 导航栏 Logo 图片 - 使用萌系风格
    logo: 'https://vuejs.press/images/hero.png',
    
    // 导航栏链接配置
    navbar: [
      {
        text: '🏠 首页',
        link: '/',
      },
      {
        text: '📝 文章',
        link: '/article/',
      },
      {
        text: '📂 分类',
        link: '/category/',
      },
      {
        text: '🏷️ 标签',
        link: '/tag/',
      },
      {
        text: '📅 时间线',
        link: '/timeline/',
      },
    ],
    
    // 侧边栏配置 - 文章详情页显示目录
    sidebar: {
      '/posts/': 'heading',
    },
    
    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com' },
    ],
    
    // 页脚版权
    footer: 'Made with 💕 by ACG Dream',
    copyright: '© 2024-2026 ACG Dream',
    
    // 显示编辑链接
    editLink: false,
    
    // 最后更新时间
    lastUpdated: true,
  }),

  // 插件配置：博客功能核心
  plugins: [
    blogPlugin({
      // 文章过滤规则：只处理 posts/ 目录下的 Markdown 文件
      filter: ({ filePathRelative }) =>
        filePathRelative ? filePathRelative.startsWith('posts/') : false,

      // 提取文章元数据，用于列表展示和排序
      getInfo: ({ frontmatter, title, data }) => ({
        title,
        author: frontmatter.author || 'ACG Dream',
        date: frontmatter.date || null,
        category: frontmatter.category || [],
        tag: frontmatter.tag || [],
        sticky: frontmatter.sticky || false,
        excerpt:
          typeof frontmatter.excerpt === 'string'
            ? frontmatter.excerpt
            : data?.excerpt || '',
      }),

      // 生成摘要（对未手动设置 excerpt 的文章）
      excerptFilter: ({ frontmatter }) =>
        !frontmatter.home &&
        frontmatter.excerpt !== false &&
        typeof frontmatter.excerpt !== 'string',

      // 分类配置：支持 category 和 tag 两种分类维度
      category: [
        {
          key: 'category',
          getter: (page) => page.frontmatter.category || [],
          layout: 'Category',
          itemLayout: 'Category',
          frontmatter: () => ({
            title: '📂 分类',
            sidebar: false,
          }),
          itemFrontmatter: (name) => ({
            title: `${name}`,
            sidebar: false,
          }),
        },
        {
          key: 'tag',
          getter: (page) => page.frontmatter.tag || [],
          layout: 'Tag',
          itemLayout: 'Tag',
          frontmatter: () => ({
            title: '🏷️ 标签',
            sidebar: false,
          }),
          itemFrontmatter: (name) => ({
            title: `${name}`,
            sidebar: false,
          }),
        },
      ],

      // 文章类型配置：定义不同的文章集合
      type: [
        {
          key: 'article',
          // 排除归档文章
          filter: (page) => !page.frontmatter.archive,
          layout: 'Article',
          frontmatter: () => ({
            title: '📝 全部文章',
            sidebar: false,
          }),
          // 排序逻辑：置顶优先，然后按日期倒序
          sorter: (pageA, pageB) => {
            if (pageA.frontmatter.sticky && pageB.frontmatter.sticky)
              return pageB.frontmatter.sticky - pageA.frontmatter.sticky

            if (pageA.frontmatter.sticky && !pageB.frontmatter.sticky) return -1

            if (!pageA.frontmatter.sticky && pageB.frontmatter.sticky) return 1

            if (!pageB.frontmatter.date) return 1
            if (!pageA.frontmatter.date) return -1

            return (
              new Date(pageB.frontmatter.date).getTime() -
              new Date(pageA.frontmatter.date).getTime()
            )
          },
        },
        {
          key: 'timeline',
          // 只有带日期的文章加入时间线
          filter: (page) => page.frontmatter.date instanceof Date,
          sorter: (pageA, pageB) =>
            new Date(pageB.frontmatter.date).getTime() -
            new Date(pageA.frontmatter.date).getTime(),
          layout: 'Timeline',
          frontmatter: () => ({
            title: '📅 时间线',
            sidebar: false,
          }),
        },
      ],
      
      // 开发模式启用热重载
      hotReload: true,
    }),
  ],

  // 打包器配置：使用 Vite
  bundler: viteBundler({
    viteOptions: {
      // 优化依赖
      optimizeDeps: {
        include: [
          'gsap',
          '@vueuse/motion',
          'three',
          '@rive-app/canvas',
          'lottie-web',
          '@splinetool/runtime'
        ]
      },
      // 构建优化
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              'effects': ['three', 'gsap', '@vueuse/motion'],
              'animation': ['@rive-app/canvas', 'lottie-web', '@splinetool/runtime']
            }
          }
        }
      }
    }
  }),
  
  // 站点头部配置
  head: [
    // 设置 viewport
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }],
    // 主题色
    ['meta', { name: 'theme-color', content: '#FFB6C1' }],
    // PWA 图标
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    // 预加载字体
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
  ],
})
