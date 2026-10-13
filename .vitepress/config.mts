import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/',
  title: "Eridanus",
  description: "基于 OneBot v11 的高扩展智能聊天机器人",
  themeConfig: {
    outline: {
      level: [2, 6],
    },
    darkModeSwitchLabel: '深浅模式',
    logo: '/logo.ico',
    nav: [
      { text: '首页', link: '/' },
      { text: '快速开始', link: '/getting-started/' },
      { text: '功能与配置', link: '/configuration/须知' },
      {
        text: '开发指南',
        items: [
          { text: '框架开发', link: '/framework/项目结构' },
          { text: 'SDK 开发', link: '/sdk/start' },
        ]
      },
      { text: '常见问题', link: '/issues/蠢问题/更新失败' },
    ],
    sidebar: [
      {
        text: '快速开始',
        collapsed: false,
        items: [
          {
            text: '部署指引',
            items: [
              { text: '在开始之前', link: '/getting-started/' },
              { text: 'Windows 快速部署', link: '/getting-started/windows' },
              { text: 'Linux 快速部署', link: '/getting-started/linux' },
              { text: 'OneBot 协议与适配器 (SnowLuma 首选)', link: '/getting-started/glidthelily' },
            ]
          },
          {
            text: 'WebUI 控制面板',
            items: [
              { text: 'WebUI 介绍', link: '/configuration/webui/介绍' },
              { text: '初次使用与面板配置', link: '/configuration/webui/初次使用' },
            ]
          }
        ],
      },
      {
        text: '功能与配置指南',
        collapsed: false,
        items: [
          {
            text: '基础系统与安全',
            items: [
              { text: '配置须知', link: '/configuration/须知' },
              { text: '核心基础配置 (YAML)', link: '/configuration/基础配置' },
              { text: '用户与权限系统', link: '/configuration/基础系统/用户与权限系统' },
              { text: '黑白名单与群管安全', link: '/configuration/基础系统/黑白名单与群管' },
            ]
          },
          {
            text: 'AI 对话与语音交互',
            collapsed: false,
            items: [
              { text: '新版 AI 对话 (MaiReply)', link: '/configuration/AI对话与语音/新版AI对话_MaiReply' },
              { text: '经典 AI 对话 (Legacy)', link: '/configuration/AI对话与语音/经典AI对话' },
              { text: '文本转语音 (TTS)', link: '/configuration/AI对话与语音/文本转语音_TTS' },
              { text: 'Live2D 桌宠与网页形象', link: '/configuration/AI对话与语音/Live2D桌宠与网页形象' },
              { text: 'CLI 编程与运维助手', link: '/configuration/AI对话与语音/CLI编程助手' },
            ]
          },
          {
            text: 'AI 创作工坊',
            collapsed: false,
            items: [
              { text: 'NovelAI 与 SD 绘图', link: '/configuration/AI创作工坊/NovelAI与SD绘画' },
              { text: 'NanoBanana 与 Qwen 智能改图', link: '/configuration/AI创作工坊/NanoBanana与Qwen改图' },
              { text: 'GPTImage2 生图与九宫格表情包', link: '/configuration/AI创作工坊/GPTImage2生图与九宫格表情包' },
              { text: 'Suno 音乐生成与 AI 鉴图', link: '/configuration/AI创作工坊/Suno音乐生成与AI鉴图' },
            ]
          },
          {
            text: 'ACG 与游戏助手',
            collapsed: false,
            items: [
              { text: 'Steam 视奸与游戏查询', link: '/configuration/ACG与游戏助手/Steam视奸与游戏查询' },
              { text: '雀魂战绩卡', link: '/configuration/ACG与游戏助手/雀魂战绩卡' },
              { text: '森空岛与明日方舟', link: '/configuration/ACG与游戏助手/森空岛与明日方舟' },
              { text: '米游社与绝区零', link: '/configuration/ACG与游戏助手/米游社与绝区零' },
              { text: 'Bangumi 番剧与 Galgame', link: '/configuration/ACG与游戏助手/Bangumi番剧与Galgame' },
            ]
          },
          {
            text: '媒体与资源收集',
            collapsed: false,
            items: [
              { text: 'B站动态解析与媒体下载', link: '/configuration/媒体与资源收集/B站动态解析与媒体下载' },
              { text: 'JM 漫画与绅士资源', link: '/configuration/媒体与资源收集/JM漫画与绅士资源' },
              { text: 'ASMR 音声与 ZLibrary', link: '/configuration/媒体与资源收集/ASMR音声与ZLibrary' },
              { text: 'Iwara 与 Telegram 贴纸', link: '/configuration/媒体与资源收集/Iwara与Telegram贴纸' },
            ]
          },
          {
            text: '群聊娱乐与制图',
            collapsed: false,
            items: [
              { text: '运势塔罗与日常功能', link: '/configuration/群聊娱乐与制图/运势塔罗与日常功能' },
              { text: '表情包与奥义图制作', link: '/configuration/群聊娱乐与制图/表情包与奥义图制作' },
              { text: '娶群友与戒鹿管理', link: '/configuration/群聊娱乐与制图/娶群友与戒鹿管理' },
              { text: '轮盘赌与井字棋对战', link: '/configuration/群聊娱乐与制图/轮盘赌与井字棋对战' },
              { text: '伪造转发与发言统计', link: '/configuration/群聊娱乐与制图/伪造转发与发言统计' },
            ]
          },
          {
            text: '自动化与系统任务',
            collapsed: false,
            items: [
              { text: '跨时区动态定时任务', link: '/configuration/自动化与系统任务/跨时区动态定时任务' },
              { text: '自定义词库回复', link: '/configuration/自动化与系统任务/自定义词库回复' },
              { text: 'QQ 空间自动冲浪', link: '/configuration/自动化与系统任务/QQ空间自动冲浪' },
              { text: 'Git 更新监控与提醒', link: '/configuration/自动化与系统任务/Git更新监控与提醒' },
            ]
          },
        ],
      },
      {
        text: '从框架继续开发',
        collapsed: false,
        items: [
          { text: '项目结构', link: '/framework/项目结构' },
          { text: '第一个插件', link: '/framework/first_plugin' },
          { text: '事件与消息', link: '/framework/消息与事件' },
          { text: 'config 对象', link: '/framework/config对象' },
          {
            text: '开发工具库',
            items: [
              { text: '框架通用工具 (utils)', link: '/framework/framework_common/utils' },
              { text: 'Redis 缓存管理器', link: '/framework/framework_common/RedisCacheManager' },
              { text: '绘图框架', link: '/framework/framework_common/绘图框架' },
            ]
          },
          { text: 'ComfyUI 接入实战', link: '/framework/comfyui接入实战' },
        ],
      },
      {
        text: '从 SDK 开始开发',
        collapsed: false,
        items: [
          { text: 'SDK 介绍', link: '/sdk/start' },
          { text: '第一个功能', link: '/sdk/第一个功能' },
          { text: 'Bot 对象', link: '/sdk/bot对象' },
          { text: '事件系统', link: '/sdk/事件' },
          { text: '消息链', link: '/sdk/消息链' },
          { text: '消息组件', link: '/sdk/消息组件' },
        ],
      },
      {
        text: '常见问题与排查',
        collapsed: true,
        items: [
          { text: '更新失败与依赖冲突', link: '/issues/蠢问题/更新失败' },
          { text: '为 Google Cloud 设置结算信息', link: '/issues/好问题/为google cloud设置结算信息' },
        ],
      },
    ],
    search: {
      provider: 'local',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/avilliai/Eridanus' },
      { icon: '/qq.ico', link: 'https://qm.qq.com/q/hjhSSnlBDi' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: `Copyright © 2019-${new Date().getFullYear()} Eridanus Project`,
    },
  },
  head: [
    ['link', { rel: 'icon', href: '/logo.ico' }],
  ],
  sitemap: {
    hostname: 'https://github.com/avilliai/Eridanus',
  },
})
