/**
 * VuePress 客户端配置文件
 * 
 * 核心职责：
 * 1. 注册自定义布局组件，使其可在 Markdown 的 frontmatter 中使用
 * 2. 导入全局萌系样式系统
 * 3. 注册全局 UI 组件
 * 
 * 布局说明：
 * - Home: 萌系动漫首页，集成 Spline 3D、GSAP 动效、粒子系统
 * - Article: 文章列表页布局，展示所有博客文章
 * - Category: 分类页布局，展示分类标签和对应文章
 * - Tag: 标签页布局，展示标签云和对应文章
 * - Timeline: 时间线页布局，按时间顺序展示文章
 * 
 * 新增萌系组件：
 * - MoeButton: 萌系动画按钮
 * - MoeCard: 萌系浮动卡片
 * 
 * 设计模式：通过 defineClientConfig 声明式注册，VuePress 会自动处理组件加载
 * 
 * @author: yy
 * @date: 2026-04-11
 */
import { defineClientConfig } from 'vuepress/client'

// 博客布局导入
import Article from './layouts/Article.vue'
import Category from './layouts/Category.vue'
import Tag from './layouts/Tag.vue'
import Timeline from './layouts/Timeline.vue'
import Home from './layouts/Home.vue'
import ArticleDetail from './layouts/ArticleDetail.vue'

// 萌系 UI 组件导入
import MoeButton from './components/ui/MoeButton.vue'
import MoeCard from './components/ui/MoeCard.vue'

// 全局样式导入
import './styles/index.scss'

export default defineClientConfig({
  /**
   * 布局注册
   * 键名为布局标识，在 frontmatter 的 layout 字段中使用
   */
  layouts: {
    Home,          // layout: Home - 萌系动漫首页
    Article,       // layout: Article - 文章列表
    ArticleDetail, // layout: ArticleDetail - 文章详情页
    Category,      // layout: Category - 分类页面
    Tag,           // layout: Tag - 标签页面
    Timeline,      // layout: Timeline - 时间线页面
  },
  
  /**
   * 应用增强函数
   * 用于注册全局组件、添加全局指令等
   * 
   * @param {Object} params - 增强参数
   * @param {Object} params.app - Vue 应用实例
   * @param {Object} params.router - Vue Router 实例
   * @param {Object} params.siteData - 站点数据
   */
  enhance({ app, router, siteData }) {
    // 注册全局萌系 UI 组件
    // 这些组件可在任何 Markdown 文件或 Vue 组件中使用
    app.component('MoeButton', MoeButton)
    app.component('MoeCard', MoeCard)
    
    // 注册全局属性（可选）
    app.config.globalProperties.$moeTheme = {
      version: '1.0.0',
      name: 'Pastel Dream'
    }
    
    // 路由守卫示例：页面切换时的动画控制
    router.beforeEach((to, from, next) => {
      // 可以在这里添加页面切换动画逻辑
      next()
    })
    
    // 客户端挂载完成后的处理
    if (typeof window !== 'undefined') {
      // 添加萌系主题类名到 body
      document.body.classList.add('moe-theme')
      
      // 检测用户首选颜色方案
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
      if (prefersDark.matches) {
        document.documentElement.setAttribute('data-theme', 'dark')
      }
      
      // 监听颜色方案变化
      prefersDark.addEventListener('change', (e) => {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light')
      })
    }
  }
})
