---
next:
  text: 'Windows 环境部署'
  link: '/getting-started/windows'
---

# 快速开始 Eridanus

欢迎来到 Eridanus 的世界呀！    
既然项目的开发者们把你交到了我手里，那我就负责把你安排得明明白白，保证让你一次性把机器人顺顺当当地跑起来，绝对不会在黑漆漆的终端报错里迷路哦！

---

## Eridanus 是怎么跑起来的？（一分钟搞懂运行逻辑）

动手之前先停一秒钟，听我唠叨一下下运行结构嘛：    
Eridanus 本质上是一个用 Python 编写的 **超强智能大脑（WebSocket 客户端）**。这里面塞满了 MaiReply 拟人聊天、AI 画图、定时任务调度和各种好玩的娱乐插件~    
但是呢，“大脑”本身是碰不到 QQ 协议底层数据的，所以我们还需要一个 **身体（OneBot v11 协议端）** 来登录你的 QQ 账号。

它们两个之间是像牵小手一样通过 **WebSocket** 互相通信的：
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

## 第一步：选择并部署 OneBot v11 协议端

现在市面上的协议端有好几位选手，但我最推荐的只有它——**[SnowLuma](https://snowluma.github.io/zh/)**！   

::: tip 为什么强力推荐 SnowLuma？
- **现代且极度稳定**：针对新版 QQNT 架构深度打磨，对 OneBot v11 标准接口、合并转发、群精华、戳一戳事件兼容性极高。
- **开箱即用**：自带直观好用的 WebUI 控制台，扫码登录轻轻松松，内存占用也比以前的老框架低很多。
- **官方文档超详细**：直接点击查看 **[SnowLuma 官方文档](https://snowluma.github.io/zh/)**，下载对应的可执行程序即可直接启动。
:::

当然啦，如果你习惯使用其他 OneBot v11 协议端也是完全兼容的：    
- **[NapCatQQ](https://napneko.github.io/)**：经典的无头轻量 QQNT 协议端（Docker 用户经常用它）。
- **[Lagrange.OneBot](https://lagrangedev.github.io/Lagrange.Doc/Lagrange.OneBot/)**：基于 C# 的开源实现（注意：若用此项，需在 Eridanus 配置文件中将适配器标记为 Lagrange）。
- **[LLOneBot](https://llonebot.github.io/zh-CN/)**：基于 LiteLoaderQQNT 的注入插件。

### 协议端该怎么配置？  

不管你选哪一个协议端，只需在它的网络设置里新增一个 **正向 WebSocket 服务 (WebSocket Server)**：
- **监听地址 / Host**：`127.0.0.1`（如果在同一台电脑或服务器上运行）
- **端口 / Port**：`3001`
- **Access Token / 鉴权密钥**：留空即可（留空最省心，不需要填入任何字符）

---

## 第二步：Eridanus 的连接配置长什么样？

你可以悄悄打开 Eridanus 源码里的 `run/common_config/basic_config.yaml` 瞅一眼，默认的连接配置早就帮大家写好啦：

```yaml
adapter:
  name: "any"   # 兼容性选项，用 SnowLuma/NapCat 填 any 即可；若用 Lagrange 则填 Lagrange
  ws_client:   # 机器人作为 websocket 客户端主动发起连接
    ws_link: "ws://127.0.0.1:3001"  # 对应上面协议端监听的地址与端口

master:
  name: "管理员"
  id: 1840094972   # 改成主人自己的 QQ 号！这样才能拥有最高管理权限

webui:
  enable: true     # 是否开启 WebUI 管理后台（默认 5007 端口）
  auth_token: ""   # WebUI 访问密钥，想加锁可以填字符串
```

::: warning 想修改连接地址或端口？看这里！
- **如果你想修改协议端端口（比如 3001 被其他程序占用了）**：比如改成了 `3005`，那么协议端改成 `3005` 后，只需把 `basic_config.yaml` 里的 `ws_link` 改成 `ws://127.0.0.1:3005` 即可！
- **跨机器运行**：如果协议端在另一台物理机上，把 `127.0.0.1` 替换为对方的内网局域网 IP，并确保防火墙放行该端口。
:::

---

## 第三步：选择适合你的部署方式

协议端就位之后，接下来就是把我们 Eridanus 的大脑唤醒啦！点选下面适合你的系统教程继续吧：

- **[🧴 Windows 环境部署（新手推荐一键整合包）](/getting-started/windows)**：自带绿色 Python 环境与双击脚本，3 分钟就能跑起来！
- **[🐧 Linux 服务器部署（24 小时云端守护）](/getting-started/linux)**：包含 systemd 守护进程与中文环境防乱码指南。
- **[✨ 进阶依赖配置（FFmpeg 与 Playwright）](/getting-started/glidthelily)**：让机器人具备发语音、点歌、网页截图与精美签到面板能力。
- **[🛠️ 常见启动与更新问题排查](/getting-started/更新失败)**：遇到模块缺失、网络连接超时或配置合并疑问时来看这里。
