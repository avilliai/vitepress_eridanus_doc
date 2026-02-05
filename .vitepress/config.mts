import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/',
  title: "Eridanus",
  description: "异步机器人框架",
  themeConfig: {

    outline: {
      level: [2, 6], // 显示2-4级标
    },
    darkModeSwitchLabel: '深浅模式',
    logo: '/logo.ico',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: '快速开始', link: '/getting-started' },
      {
        text: '开发指南',
        items: [
          { text: '框架', link: '/framework/项目结构' },
          { text: 'sdk', link: '/sdk/start' },
        ]
      },
    ],
    sidebar: [
      {
        //分组标题1
        text: '快速开始', collapsed: false,
        items: [
          {
            text: '部署', items: [
              { text: '在开始之前', link: '/getting-started' },
              { text: 'windows快速部署', link: '/getting-started/windows' },
              { text: 'linux快速部署', link: '/getting-started/linux' },
              { text: '没苦硬吃', link: '/getting-started/glidthelily' },
            ]
          },
          {
            text: 'WebUI使用', items: [
              { text: '初次使用', link: "/configuration/webui/初次使用.md" },
              { text: 'WebUI介绍', link: "/configuration/webui/介绍.md" }
            ]
          }
        ],
      },
      {
        //分组标题2
        text: '功能及配置', collapsed: false,
        items: [
          { text: '须知', link: '/configuration/须知' },
          { text: '基础配置', link: '/configuration/基础配置' },
          {
            text: '核心功能', collapsed: true, items: [
              { text: 'ai对话', link: '/configuration/核心功能/ai对话' },
              { text: "语音合成", link: "/configuration/核心功能/文本转语音" },
              { text: "用户管理", link: "/configuration/核心功能/用户权限系统" },
              { text: "群组管理", link: "/configuration/核心功能/群组管理" },
              { text: "黑名单/白名单", link: "/configuration/核心功能/黑白名单" },
              { text: "对接business2api",link: "/configuration/核心功能/对接business2api" },

            ]
          },
          {
            text: "ai绘画", items: [
              { text: 'ai绘画', link: '/configuration/ai绘画/ai绘画' },
              { text: 'kaggle部署sd服务端', link: '/configuration/ai绘画/kaggle部署ai绘画' },
              { text: "danbooru", link: "/configuration/ai绘画/danbooru" },
              { text: "ai图片甄别", link: "/configuration/ai绘画/ai图片甄别" },
              { text: "nano banana", link: "/configuration/ai绘画/nano_banana" }
            ]
          },
          {
            text: "资源搜索", items: [
              { text: 'zlibrary', link: '/configuration/资源搜索/zlibrary' },
              { text: "asmr", link: "/configuration/资源搜索/asmr" },
              { text: "JMComic", link: "/configuration/资源搜索/jmcomic" },
              { text: "iwara", link: "/configuration/资源搜索/iwara" },
              { text: '搜图',link: '/configuration/资源搜索/搜图' }
            ]
          },
          {
            text: '媒体服务', items: [
              { text: '链接解析', link: "/configuration/媒体服务/链接解析" },
              { text: "视频下载", link: "/configuration/媒体服务/视频下载" },
              { text: 'b站动态订阅', link: "/configuration/媒体服务/bili动态订阅" },
              { text: 'bangumi查询', link: "/configuration/媒体服务/bangumi" },
              {text: '点歌', link: "/configuration/媒体服务/点歌" },
              {text: '随机asmr',link: "/configuration/媒体服务/随机asmr" }
            ]
          },
          {
            text: '游戏服务', items: [
              { text: 'steam', link: "/configuration/游戏服务/steam" },
              { text: '雀魂', link: "/configuration/游戏服务/雀魂助手" },
              { text: '碧蓝档案', link: "/configuration/游戏服务/碧蓝档案" },
              { text: '森空岛', link: "/configuration/游戏服务/森空岛" },
              { text: '绝区零', link: "/configuration/游戏服务/绝区零" }
            ]
          },
          {
            text: '群管', items: [
              { text: '角色检测撤回', link: "/configuration/群管/角色检测" },
              { text: '原版qq功能', link: "/configuration/群管/原版qq" },
              { text: '消息记录', link: "/configuration/群管/消息记录" },
              { text: '防自言自语插件', link: "/configuration/群管/防自言自语插件" }
            ]
          },
          {
            text: '娱乐功能', items: [
              { text: '蕾忍宗大学习', link: "/configuration/娱乐功能/蕾忍宗大学习" },
              { text: '五子棋', link: "/configuration/娱乐功能/五子棋" },
              {text: '伪造聊天记录', link: "/configuration/娱乐功能/伪造聊天记录" },
              {text: '制图功能', link: "/configuration/娱乐功能/制图功能" },
              {text: '天气查询',link: "/configuration/娱乐功能/天气查询" },
              {text: '娶群友',link: "/configuration/娱乐功能/娶群友" },
              {text: '涩图',link: "/configuration/娱乐功能/涩图" },
              {text: '轮盘赌与决斗',link: "/configuration/娱乐功能/轮盘赌" },
              {text: '运势与塔罗',link: "/configuration/娱乐功能/运势与塔罗" },
              {text: '🦌',link: "/configuration/娱乐功能/🦌" },
              {text: 'Grok视频生成',link: "/configuration/娱乐功能/Grok视频生成" },
              {text: '没人用的功能',link: "/configuration/娱乐功能/没人用的功能集合" }
            ]
          },
          {
            text: '系统功能', items: [
              { text: '定时任务', link: "/configuration/系统功能/定时任务" },
              { text: 'qq空间', link: "/configuration/系统功能/qq空间" },
              {text: '自定义回复', link: "/configuration/系统功能/自定义回复" },
              {text: 'ai插件编写', link: "/configuration/系统功能/ai插件编写" }
            ]
          },
        ],
      },
      {
        //分组标题3
        text: '从框架继续开发', collapsed: false,
        items: [
          { text: '项目结构', link: '/framework/项目结构' },
          { text: '第一个插件', link: '/framework/first_plugin' },
          { text: "事件与消息", link: "/framework/消息与事件" },
          { text: 'config对象', link: "/framework/config对象" },
          {
            text: '开发工具', items: [
              { text: 'utils', link: 'framework/framework_common/utils' },
              { text: 'RedisCacheManager', link: 'framework/framework_common/RedisCacheManager' },
              { text: '绘图框架', link: 'framework/framework_common/绘图框架' },
            ]
          },
        ],
      },
      {
        //分组标题2
        text: '从sdk开始开发', collapsed: false,
        items: [
          { text: 'sdk介绍', link: '/sdk/start' },
          { text: "第一个功能", link: "/sdk/第一个功能" },
          { text: "bot对象", link: "/sdk/bot对象" },
          { text: '事件', link: "/sdk/事件" },
          { text: '消息链', link: "/sdk/消息链" },
          { text: '消息组件', link: "/sdk/消息组件" }
        ],
      },
      {
        text: '常见问题', collapsed: false,
        items: [
          {
            text: '蠢问题',collapsed: true, items: [
              { text: '更新失败', link: '/issues/蠢问题/更新失败' },
            ]
          },
          {
            text: '好问题',collapsed: true, items: [
              { text: '为google cloud设置结算信息', link: '/issues/好问题/为google cloud设置结算信息.md' },
            ]
          },
        ],
      },
    ],
    search: {
      provider: 'local'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/avilliai/Eridanus' },
      { icon: '/qq.ico', link: 'https://qm.qq.com/q/hjhSSnlBDi' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: `Copyright © 2019-${new Date().getFullYear()} present Evan You`,
      // 自动更新时间
      //copyright: `Copyright © 2019-${new Date().getFullYear()} present Evan You`,
    },
  },
  head: [
    ['link', { rel: 'icon', href: '/logo.ico' }],
  ],
  sitemap: {
    hostname: 'https://github.com/avilliai/Eridanus',
  },

})
