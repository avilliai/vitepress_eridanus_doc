import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Eridanus",
  description: "全能型多模态二次元 QQ 机器人框架与文档",
  head: [
    ['link', { rel: 'icon', href: '/logo.ico' }]
  ],
  themeConfig: {
    logo: '/logo.ico',
    nav: [
      { text: '首页', link: '/' },
      { text: '新手部署', link: '/getting-started/' },
      { text: '功能手册', link: '/configuration/基础配置' },
      { text: 'WebUI 控制台', link: '/configuration/webui/介绍' },
      { text: '框架开发 SDK', link: '/sdk/start' }
    ],

    sidebar: {
      '/getting-started/': [
        {
          text: '🚀 新手起步',
          items: [
            { text: '快速开始导览', link: '/getting-started/' },
            { text: 'Windows 环境部署', link: '/getting-started/windows' },
            { text: 'Linux 环境部署', link: '/getting-started/linux' },
            { text: '锦上添花 (扩展工具配置)', link: '/getting-started/glidthelily' },
            { text: '常见启动与更新问题排查', link: '/getting-started/更新失败' }
          ]
        }
      ],
      '/configuration/': [
        {
          text: '⚙️ 核心配置与基础系统',
          items: [
            { text: '基础配置中心', link: '/configuration/基础配置' },
            { text: '部署须知与安全提示', link: '/configuration/须知' },
            { text: '用户注册与鉴权管理', link: '/configuration/基础系统/用户与权限系统' },
            { text: '黑白名单与群管控制', link: '/configuration/基础系统/黑白名单与群管' }
          ]
        },
        {
          text: '🤖 AI 对话与人设语音',
          items: [
            { text: '新版人格对话 (MaiReply)', link: '/configuration/AI对话与语音/新版AI对话_MaiReply' },
            { text: '经典模式 AI 对话', link: '/configuration/AI对话与语音/经典AI对话' },
            { text: '个性化语音合成 (TTS)', link: '/configuration/AI对话与语音/文本转语音_TTS' },
            { text: 'Live2D 桌面宠物与形象', link: '/configuration/AI对话与语音/Live2D桌宠与网页形象' },
            { text: 'CLI 自动化终端助手', link: '/configuration/AI对话与语音/CLI编程助手' }
          ]
        },
        {
          text: '🎨 AI 创作工坊',
          items: [
            { text: 'GPT-Image2 图像生成与编辑', link: '/configuration/AI创作工坊/GPTImage2图像生成与编辑' },
            { text: '九宫格表情包制作', link: '/configuration/AI创作工坊/九宫格表情包制作' },
            { text: 'NovelAI 与 SD 专业绘图', link: '/configuration/AI创作工坊/NovelAI与SD绘画' },
            { text: 'NanoBanana 与视觉改图', link: '/configuration/AI创作工坊/NanoBanana与Qwen改图' },
            { text: 'Suno 音乐创作', link: '/configuration/AI创作工坊/Suno音乐生成' },
            { text: 'AI 图片甄别检测', link: '/configuration/AI创作工坊/AI图甄别' }
          ]
        },
        {
          text: '🎮 ACG 与游戏助手',
          items: [
            { text: 'Steam 视奸与游戏查询', link: '/configuration/ACG与游戏助手/Steam视奸与游戏查询' },
            { text: '森空岛与明日方舟 (含Epic限免)', link: '/configuration/ACG与游戏助手/森空岛与明日方舟' },
            { text: '米游社全家桶与绝区零', link: '/configuration/ACG与游戏助手/米游社与绝区零' },
            { text: '雀魂战绩卡查询', link: '/configuration/ACG与游戏助手/雀魂战绩卡' },
            { text: 'Bangumi 番剧与 Galgame 库', link: '/configuration/ACG与游戏助手/Bangumi番剧与Galgame' }
          ]
        },
        {
          text: '🎉 群聊娱乐与制图',
          items: [
            { text: '娶群友与后宫管理', link: '/configuration/群聊娱乐与制图/娶群友与后宫管理' },
            { text: '戒鹿打卡与排行榜', link: '/configuration/群聊娱乐与制图/戒鹿打卡与排行榜' },
            { text: '表情包与奥义图制作', link: '/configuration/群聊娱乐与制图/表情包与奥义图制作' },
            { text: '俄罗斯轮盘赌决斗', link: '/configuration/群聊娱乐与制图/俄罗斯轮盘赌决斗' },
            { text: '井字棋对战', link: '/configuration/群聊娱乐与制图/井字棋对战' },
            { text: '运势、塔罗与日常功能', link: '/configuration/群聊娱乐与制图/运势塔罗与日常功能' },
            { text: '伪造转发与发言统计', link: '/configuration/群聊娱乐与制图/伪造转发与发言统计' }
          ]
        },
        {
          text: '📦 媒体与资源收集',
          items: [
            { text: 'ASMR 音声检索与试听', link: '/configuration/媒体与资源收集/ASMR音声检索' },
            { text: 'Z-Library 图书检索与下载', link: '/configuration/媒体与资源收集/ZLibrary图书检索' },
            { text: 'B站动态解析与媒体下载', link: '/configuration/媒体与资源收集/B站动态解析与媒体下载' },
            { text: 'Iwara 视频解析与下载', link: '/configuration/媒体与资源收集/Iwara视频解析' },
            { text: 'Telegram 贴纸包转存与下载', link: '/configuration/媒体与资源收集/Telegram贴纸转存' },
            { text: 'JM 漫画与绅士资源', link: '/configuration/媒体与资源收集/JM漫画与绅士资源' }
          ]
        },
        {
          text: '⏰ 自动化与系统任务',
          items: [
            { text: '跨时区动态定时任务', link: '/configuration/自动化与系统任务/跨时区动态定时任务' },
            { text: 'Git 远程更新监控与提醒', link: '/configuration/自动化与系统任务/Git更新监控与提醒' },
            { text: 'QQ 空间自动冲浪', link: '/configuration/自动化与系统任务/QQ空间自动冲浪' },
            { text: '自定义词库与快捷回复', link: '/configuration/自动化与系统任务/自定义词库回复' }
          ]
        },
        {
          text: '🖥️ WebUI 控制台',
          items: [
            { text: 'WebUI 概述与核心功能', link: '/configuration/webui/介绍' },
            { text: '初次使用与面板配置', link: '/configuration/webui/初次使用' }
          ]
        }
      ],
      '/sdk/': [
        {
          text: '🛠️ Eridanus 开发者 SDK',
          items: [
            { text: 'SDK 架构概览', link: '/sdk/start' },
            { text: 'Bot 核心对象与 API', link: '/sdk/bot对象' },
            { text: '事件系统与处理器', link: '/sdk/事件' },
            { text: '消息链与构建', link: '/sdk/消息链' },
            { text: '消息组件全解', link: '/sdk/消息组件' },
            { text: '编写你的第一个插件', link: '/sdk/第一个功能' }
          ]
        },
        {
          text: '🧱 框架深入与公共服务',
          items: [
            { text: '项目架构与目录拓扑', link: '/framework/项目结构' },
            { text: 'Config 配置管理对象', link: '/framework/config对象' },
            { text: '公共工具库 (framework_common)', link: '/framework/framework_common/utils' },
            { text: '生命周期与元事件流', link: '/framework/生命周期与事件' },
            { text: '高级插件工程实践', link: '/framework/first_plugin' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/AOrbitron/Eridanus' }
    ]
  }
})
