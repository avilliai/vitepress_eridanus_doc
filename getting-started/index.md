# 快速开始 Eridanus

哈喽！欢迎来到 Eridanus 的世界~    
既然你点开了这份文档，那我就把整个 Eridanus 的架构和部署流程给你讲得明明白白，保证你不会在配置里迷路哦！    

## Eridanus 是怎么工作的？

在动手之前，先花一分钟搞懂我们的运行方式：    
Eridanus 是一个基于 Python 开发的 **机器人大脑（服务端/插件框架）**，负责思考 AI 对话、画图、管理定时任务和调用各种插件。    
而要让这个“大脑”真正在 QQ 里收发消息，还需要搭配一个 **OneBot v11 协议端（身体）** 来登录你的 QQ 小号。    

它们两个通过 **WebSocket** 牵手通信：    
1. **OneBot 协议端**收到群聊/私聊消息，通过 WebSocket 把事件推送给 Eridanus； <——它是websocket server       
2. **Eridanus** 处理完逻辑后，再把要发送的文字、语音、图片指令发回 OneBot 协议端。    <——它是websocket client

---

## 第一步：选择并部署 OneBot v11 协议端

目前我们 **首选推荐使用 [SnowLuma](https://snowluma.github.io/zh/)** 作为 OneBot v11 实现！    

::: tip 为什么首选 SnowLuma？    
- **原生高兼容**：对 OneBot v11 标准接口、合并转发消息、群精华、表情回应等扩展 API 支持极佳。    
- **轻量稳定**：资源占用低，配置直观，与 Eridanus 的 WebSocket 服务端/客户端模式均可无缝对接。    
- **官方文档**：直接访问 **[https://snowluma.github.io/zh/](https://snowluma.github.io/zh/)** 即可查看安装与登录指南。    
:::    

除了 SnowLuma 之外，你也可以使用其他任何兼容 OneBot v11 的框架，例如：    
- **[NapCatQQ](https://napneko.github.io/)**：基于 NTQQ 的无头 OneBot 协议端。    
- **[Lagrange.OneBot](https://lagrangedev.github.io/Lagrange.Doc/Lagrange.OneBot/)**：经典跨平台 OneBot 实现。    
- **[LLOneBot](https://llonebot.github.io/zh-CN/)**：基于 LiteLoaderQQNT 的插件方案。    

### OneBot 连接方式怎么配？

Eridanus 在`run/common_config/basic_config.yaml` 中 默认连接`ws://127.0.0.1:3001`）。    
因此最省心的连接方式是：    
1. 在 **SnowLuma**（或 NapCat / Lagrange）中新建一个 ** WebSocket服务端 (WebSocket server)** 连接；    
2. 这个服务端运行在：`3001` 端口，并且为了最省事，我们需要把token设置为空     
    

---

## 第二步：根据你的系统部署 Eridanus

选好 OneBot 协议端后，接下来就跟我一起把 Eridanus 本体跑起来吧：    

- **[🧴 Windows 环境部署（支持一键整合包 & 源码部署）](/getting-started/windows)**    
- **[🐧 Linux 服务器部署](/getting-started/linux)**    
- **[✨ 进阶配置：FFmpeg 语音/视频支持与 Playwright 浏览器渲染](/getting-started/glidthelily)**    
