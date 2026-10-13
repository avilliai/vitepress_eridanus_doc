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
            { text: '用户注册与个人资产', link: '/configuration/基础系统/用户注册与个人资产' },
            { text: '权限管理与角色体系', link: '/configuration/基础系统/权限管理与角色体系' },
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
            { text: 'GPT-Image2 绘画工坊', link: '/configuration/AI创作工坊/GPTImage2绘画工坊' },
            { text: '九宫格表情包制作', link: '/configuration/AI创作工坊/九宫格表情包制作' },
            { text: 'NovelAI 专业绘画 (NAI3/NAI4)', link: '/configuration/AI创作工坊/NovelAI绘画' },
            { text: 'Stable Diffusion 专业绘图', link: '/configuration/AI创作工坊/StableDiffusion绘画' },
            { text: 'Gemini Nano-Banana 改图', link: '/configuration/AI创作工坊/NanoBanana图像编辑' },
            { text: 'Qwen 通义万相自然语言生图', link: '/configuration/AI创作工坊/Qwen自然语言生图' },
            { text: 'Suno 音乐创作', link: '/configuration/AI创作工坊/Suno音乐生成' },
            { text: 'AI 图片甄别检测', link: '/configuration/AI创作工坊/AI图甄别' }
          ]
        },
        {
          text: '🎮 ACG 与游戏助手',
          items: [
            { text: 'Bangumi 番剧与 ACG 检索', link: '/configuration/ACG与游戏助手/Bangumi番剧查询' },
            { text: 'Galgame 资料库与推荐', link: '/configuration/ACG与游戏助手/Galgame资料查询' },
            { text: '蔚蓝档案游戏助手 (Blue Archive)', link: '/configuration/ACG与游戏助手/蔚蓝档案游戏助手' },
            { text: '二次元角色识别与以图识番', link: '/configuration/ACG与游戏助手/角色识别与以图识番' },
            { text: 'Steam 好友动态视奸', link: '/configuration/ACG与游戏助手/Steam好友动态视奸' },
            { text: 'Steam 游戏资料与史低查询', link: '/configuration/ACG与游戏助手/Steam游戏资料与史低查询' },
            { text: 'Epic 喜加一周免监控', link: '/configuration/ACG与游戏助手/Epic喜加一周免' },
            { text: '森空岛明日方舟助手', link: '/configuration/ACG与游戏助手/森空岛明日方舟助手' },
            { text: '米游社全家桶签到助手', link: '/configuration/ACG与游戏助手/米游社助手' },
            { text: '绝区零游戏助手', link: '/configuration/ACG与游戏助手/绝区零游戏助手' },
            { text: '雀魂战绩卡查询', link: '/configuration/ACG与游戏助手/雀魂战绩卡' }
          ]
        },
        {
          text: '🎉 群聊娱乐与制图',
          items: [
            { text: '消息伪造转发 (聊天记录生成器)', link: '/configuration/群聊娱乐与制图/消息伪造转发' },
            { text: '群发言统计与水群排行榜', link: '/configuration/群聊娱乐与制图/群发言统计排行榜' },
            { text: '海量表情包制作', link: '/configuration/群聊娱乐与制图/海量表情包制作' },
            { text: '二次元奥义图制作', link: '/configuration/群聊娱乐与制图/二次元奥义图制作' },
            { text: 'Emoji 表情合成 (Emojimix)', link: '/configuration/群聊娱乐与制图/Emoji表情合成' },
            { text: '娶群友互动系统 (后宫管理)', link: '/configuration/群聊娱乐与制图/娶群友互动系统' },
            { text: '戒鹿打卡助手', link: '/configuration/群聊娱乐与制图/戒鹿打卡助手' },
            { text: '俄罗斯轮盘赌决斗', link: '/configuration/群聊娱乐与制图/俄罗斯轮盘赌决斗' },
            { text: '井字棋对战', link: '/configuration/群聊娱乐与制图/井字棋对战' },
            { text: '运势与多主题塔罗', link: '/configuration/群聊娱乐与制图/运势与多主题塔罗' },
            { text: '日常实用工具箱 (天气/点歌/搜图)', link: '/configuration/群聊娱乐与制图/日常实用工具箱' }
          ]
        },
        {
          text: '📦 媒体与资源收集',
          items: [
            { text: 'ASMR 音声检索与试听', link: '/configuration/媒体与资源收集/ASMR音声检索' },
            { text: 'Z-Library 图书检索与下载', link: '/configuration/媒体与资源收集/ZLibrary图书检索' },
            { text: 'B站 UP主动态监听与推送', link: '/configuration/媒体与资源收集/B站UP主动态监听' },
            { text: '全网音视频多平台下载', link: '/configuration/媒体与资源收集/全网音视频多平台下载' },
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
