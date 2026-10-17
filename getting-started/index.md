---
next:
  text: 'Windows 环境部署'
  link: '/getting-started/windows'
---

# 快速开始 Eridanus

欢迎来到 Eridanus 的世界呀！    
既然开发者们把你交到了我手里，那我就负责把你安排得明明白白，保证让你顺顺当当地把机器人跑起来，绝对不会在黑漆漆的终端报错里抓狂迷路哦~

---

## Eridanus 是怎么跑起来的？（一分钟搞懂运行逻辑）

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

## 启动前敲黑板：避坑打底三件套（不要跳过这几步呀！）

停一下停一下，好多人一拿到项目就急匆匆双击脚本，结果终端啪的一下一片红，跑来哭唧唧问为什么开不起机…    
为了保证机器人醒来能正常说话、协议端不罢工，在真正动手启动前，请务必确认你的系统里已经装好了下面这三位大功臣：

::: danger 极简环境特别提醒（云服务器 / 挂机宝 / 虚拟机必看！）
如果你用的是**挂机宝、轻量云服务器（Windows Server）、纯净精简系统或刚开出来的虚拟机**，系统往往被精简到了极点，底层连最基础的 C++ 运行时都没有！    
没装运行库的话，Python 一加载底层库就会当场甩你一句 `ImportError: DLL load failed: 找不到指定的模块`！    
在启动前，**必须先下载并安装微软官方运行库**：    
👉 **[下载微软官方 VC_redist.x64.exe](https://aka.ms/vs/17/release/vc_redist.x64.exe)**（双击安装，一路下一步，两秒钟搞定，能省下一整晚掉头发排查的时间~）
:::

::: warning 必备工具预检：Node.js 与 FFmpeg
1. **Node.js（推荐 18+ 或 20+ LTS）**：    
   Eridanus的解析功能依赖 Node.js。要是你的电脑里敲不出 `node -v`，抖音、youtube和bilibili的视频可没法下载      
   - 还没装？去 **[Node.js 官方网站](https://nodejs.org/)** 下载安装 LTS 版本，或者终端直接敲 `winget install OpenJS.NodeJS.LTS`。
2. **FFmpeg（多媒体与语音合成核心）**：    
   想听机器人发好听的语音、在群里点歌、解析音视频？FFmpeg 负责把音频流转码打包成 QQ 支持的 Silk 格式。没有它，机器人就直接变成敲代码的小哑巴啦！    
   - Windows 推荐直接终端敲：`winget install Gyan.FFmpeg`    
   - Linux 终端执行：`sudo apt install -y ffmpeg`    
   - 终端里输入 `ffmpeg -version` 能打印出版本号就代表万无一失啦~。如果上面的命令都不管用，浏览器也可以搜到很多教大家如何配置ffmpeg环境变量的教程。   
:::

---

## 第一步：选择并部署 OneBot v11 协议端

现在市面上的协议端有好几位选手，首选推荐——**[SnowLuma](https://snowluma.github.io/zh/)**！   

::: tip 为什么强力推荐 SnowLuma？
- **现代且极度稳定**：针对新版 QQNT 架构深度打磨，对 OneBot v11 标准接口、合并转发、群精华、戳一戳事件兼容性极高。
- **开箱即用**：自带直观好用的 WebUI 控制台，扫码登录轻轻松松，内存占用也比以前的老框架低很多。
- **官方文档超详细**：直接查看 **[SnowLuma 官方文档](https://snowluma.github.io/zh/)**，下载对应的可执行程序即可直接启动（别忘了上面说的，它需要 Node.js 运行环境哦）。
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

`第一次接触bot的windows用户也不要担心啦，我们在windows部署页面会专门讲怎么配置snowluma。`

---

## 第二步：Eridanus 的连接配置(可跳过)
默认配置已经能够让大家顺利连接到onebot实现啦，不过也可以先修改一些配置。    
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
```

::: warning 想修改连接地址或端口？看这里！
- **如果你想修改协议端端口（比如 3001 被其他程序占用了）**：比如改成了 `3005`，那么协议端改成 `3005` 后，只需把 `basic_config.yaml` 里的 `ws_link` 改成 `ws://127.0.0.1:3005` 即可！
- **跨机器运行**：如果协议端在另一台物理机上，把 `127.0.0.1` 替换为对方的内网局域网 IP，并确保防火墙放行该端口。
:::

---

## 第三步：选择适合你的部署方式

打底环境与协议端就位之后，接下来就是把我们 Eridanus 的大脑唤醒啦！点选下面适合你的系统教程继续吧：

- **[🧴 Windows 环境部署（新手推荐一键整合包）](/getting-started/windows)**：自带绿色 Python 环境与双击脚本，3 分钟就能跑起来！
- **[🐧 Linux 服务器部署（24 小时云端守护）](/getting-started/linux)**：包含 systemd 守护进程与中文环境防乱码指南。
- **[✨ 进阶依赖配置（FFmpeg 与中文字体）](/getting-started/glidthelily)**：深入了解多媒体转码、点歌与绘图防乱码配置。
- **[🛠️ 常见启动与更新问题排查](/getting-started/更新失败)**：遇到 VC 运行库缺失、模块缺失、网络连接超时或配置合并疑问时来看这里。
