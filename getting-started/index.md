---
next:
  text: 'Windows 环境部署'
  link: '/getting-started/windows'
---

# 快速开始 Eridanus

欢迎来到 Eridanus 的世界呀！    
既然开发者们把你交到了我手里，那我就负责把你安排得明明白白，保证让你顺顺当当地把机器人跑起来，绝对不会在黑漆漆的终端报错里抓狂迷路哦~

---

## Eridanus 是怎么跑起来的？

动手之前先停一秒钟，听我唠叨一下下运行结构嘛：    
Eridanus 本质上是一个用 Python 编写的 **超强智能大脑（WebSocket 客户端）**，里面塞满了人格聊天、AI 画图、定时任务调度和各种好玩的娱乐插件~    
但是呢，“大脑”本身是碰不到 QQ 协议底层数据的，所以我们还需要一个 **身体（OneBot v11 协议端）** 来登录你的 QQ 账号。

它们两个之间就像牵小手一样，通过 **WebSocket** 互相通信：
1. **OneBot 协议端**（比如 SnowLuma）登录 QQ，充当 **WebSocket 服务端 (WebSocket Server)**，在本地监听端口（默认推荐 `3001`）。     
2. **Eridanus** 启动后，充当 **WebSocket 客户端 (WebSocket Client)**，主动连接 `ws://127.0.0.1:3001`。      
3. 当群里有人发消息或者戳一戳时，协议端就会把事件推给 Eridanus，“大脑”飞速思考完毕后，再把要发送的文字、语音或图片通过同一个连接发回给协议端送出！

```
+-------------------+        WebSocket 连接        +-------------------+
|  OneBot 协议端     | <=========================> |  Eridanus 本体    |
| (如 SnowLuma)     |    ws://127.0.0.1:3001      |  (Python 智能大脑) |
| [WebSocket Server]|                             | [WebSocket Client]|
+-------------------+                             +-------------------+
         ^                                                  ^
         | 收发 QQ 消息                                      | 调度各种插件 / AI 思考
         v                                                  v
     QQ 服务器                                          你的群聊与好友
```

---


# 选择你的部署方式

选择好协议端之后，接下来就是把我们 Eridanus 的大脑唤醒啦！点选下面适合你的系统教程继续吧：

- **[🧴 Windows 环境部署（新手推荐一键整合包）](/getting-started/windows)**：自带绿色 Python 环境与双击脚本，3 分钟就能跑起来！
- **[🐧 Linux 服务器部署（24 小时云端守护）](/getting-started/linux)**：包含 systemd 守护进程与中文环境防乱码指南。
- **[✨ 进阶依赖配置（FFmpeg 与中文字体）](/getting-started/glidthelily)**：深入了解多媒体转码、点歌与绘图防乱码配置。
- **[🛠️ 常见启动与更新问题排查](/getting-started/更新失败)**：遇到 VC 运行库缺失、模块缺失、网络连接超时或配置合并疑问时来看这里。
