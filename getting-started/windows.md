---
prev:
  text: '快速开始'
  link: '/getting-started/'
next:
  text: 'Linux 环境部署'
  link: '/getting-started/linux'
---

# Windows 环境部署

在 Windows 平台玩 Eridanus 可是最舒服的体验啦！    
不管你是完全不想碰命令行的新手主人，还是喜欢用 VSCode 自己改代码的极客开发者，我都为你准备好了对应的上车路线哦~

---

## 启动前的防翻车预检（这三样东西装好没？）

慢着慢着！不管是直接用整合包还是自己拉源码跑，千~万~不要刚解压完就猴急地双击脚本哦！    
特别是手里拿着**云服务器、挂机宝、虚拟机或者精简版 Windows** 的主人，这些环境为了省体积经常被精简得空空如也，连底层的骨架都没搭好呢。    
请在真正开机前，先花两分钟把下面这三样打底神器确认好：

::: danger 极简环境特别提醒（云服务器 / 挂机宝 / 虚拟机必装！）
**微软 VC++ 运行库 (`VC_redist.x64.exe`)**：    
挂机宝、Windows Server、阿里云/腾讯云轻量服务器或者纯净虚拟机，系统刚开出来时**绝大多数都没有预装 Visual C++ 运行库**！    
如果不装，等会儿不管是整合包内置的 Python 环境还是第三方核心库（比如 numpy、torch、orjson 等底层 C++ 编译组件），都会在启动瞬间崩溃，直接弹窗报错或者在终端狂刷 `ImportError: DLL load failed while importing ... 找不到指定的模块`！    
- **救命直链**：赶紧戳微软官方链接下载：👉 **[微软官方 VC_redist.x64.exe 极速下载](https://aka.ms/vs/17/release/vc_redist.x64.exe)**    
- 下载后双击打开，一路点击“下一步”安装，几十秒搞定！装完不需要重启，直接就能避免一整晚莫名其妙的闪退抓狂~
:::

::: warning 协议与多媒体核心预检（Node.js 与 FFmpeg）
1. **Node.js（链接解析功能必须）**：
   - **安装方法**：在 PowerShell 终端敲一行命令安装：
     ```powershell
     winget install OpenJS.NodeJS.LTS
     ```
     或者去 **[Node.js 官方网站](https://nodejs.org/)** 下载安装 LTS 长期支持版。全都默认下一步，几十秒就装完啦，装完后新开一个终端敲 `node -v`，能看到版本号就妥啦！
2. **FFmpeg**：    
   Eridanus 的拟人语音合成（TTS 输出 Silk 格式语音）、群点歌、视频提取与转码，全部都靠系统里的 FFmpeg。没装的话，机器人发不出语音甚至会报 `ffmpeg not found`。    
   - **安装方法**：PowerShell 终端直接输入一行命令自动安装并配置环境变量：
     ```powershell
     winget install Gyan.FFmpeg
     ```
     装好后新开终端输入 `ffmpeg -version` 确认能打印出版本信息即可（想手动下载解压配置可参考 [进阶配置页](/getting-started/glidthelily)）。
:::

---

## 路线一：使用 Windows 整合包（强烈推荐新手！）

如果你只是想开箱即用，不想在电脑里装一堆 Python 版本或者折腾虚拟环境，直接用赖哥和团队准备的整合包就最稳妥啦！整合包里已经塞好了精简且纯净的 Python 运行环境、Git 工具、所有依赖包以及预置好的快捷脚本。

### 1. 下载与解压
1. 前往 **[Eridanus GitHub Releases](https://github.com/avilliai/Eridanus/releases)** 页面，或者加入交流群（`913122269` 或 `1050663831`）在群文件中下载最新的 Windows 整合包。
2. 将压缩包解压到你的硬盘中。

::: danger 路径避坑警告！
解压的目标路径 **尽量避免包含中文字符或空格**（例如不要放在 `D:\我的文档\新建文件夹\` 这种地方），建议解压到类似 `D:\Eridanus\` 这样干净简短的纯英文根目录下！
:::

### 2. 认识根目录下的快捷启动脚本
解压完成后，你会看到根目录下有几个 `.bat` 批处理脚本，它们的分工可清楚啦：

| 脚本名称 | 作用与使用场景 |
| :--- | :--- |
| **`启动脚本.bat`** | **日常启动首选**！一键激活内置环境并运行主程序，同时启动位于 `5007` 端口的 WebUI 后台。 |
| **`启动脚本2(循环重启).bat`** | **守护挂机模式**！如果机器人发生异常崩溃或遇到热更新退出，脚本会在 3 秒后自动拉起重启，适合长期挂机。 |
| **`更新脚本.bat`** | **一键无损更新**！自动从 Git 源拉取最新代码，并通过内置的 `tool.py` 智能迁移合并你的配置文件，API 密钥完全不会被覆盖！ |
| `一键部署脚本(整合包用户不要点).bat` | 这是给纯源码用户克隆后自动装依赖用的，整合包用户千~万~不~要~点它哦！ |

### 3. 配置 OneBot 协议端（以 SnowLuma 为例）
确认上面提到的 **Node.js** 已经装好后，我们来启动协议端：
1. 启动并扫码登录你的 **[SnowLuma](https://snowluma.github.io/zh/)** 或 NapCat。
2. 确保协议端里添加了 **正向 WebSocket 服务 (WebSocket Server)**：端口设为 `3001`，Token 留空。

这是 SnowLuma-Windows 版本解压后的目录结构：    
![snowluma目录结构](/onebot/img.png)

双击启动 `launcher.bat`，你将看到类似这样的日志输出（看，第一行就是用 node 启动的哦）：    
```log
C:\Users\Administrator\Downloads\SnowLuma-v1.14.22-win-x64>node ./index.mjs
(node:3564) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
22:20:27 INFO               [App] SnowLuma starting
22:20:27 INFO               [WebUI] ════════════════════════════════════════════════════════════════
22:20:27 INFO               [WebUI]   ★ WebUI 初始登录凭据 / Initial WebUI Credentials ★
22:20:27 INFO               [WebUI]   请立即登录并修改密码 —— 关闭程序后此密码无法找回。
22:20:27 INFO               [WebUI]   若跳过初始改密，下次启动将自动生成新的随机密码。
22:20:27 INFO               [WebUI]   Log in and change the password now; it will not be shown again.
22:20:27 INFO               [WebUI] ────────────────────────────────────────────────────────────────
22:20:27 INFO               [WebUI] initial credentials: user=admin password=470e5ed82a261b32
22:20:27 INFO               [WebUI] ════════════════════════════════════════════════════════════════
22:20:27 INFO               [WebUI] login rate-limit keyed by: socket peer (default)
22:20:27 INFO               [WebUI] awaiting EULA/PRIVACY consent before the panel unlocks
22:20:27 INFO               [WebUI] listening http://127.0.0.1:5099
```
注意 `initial credentials: user=admin password=470e5ed82a261b32`，其中 `password=` 后面的那一串就是 `webui初始密码`，赶紧记下来~     
然后浏览器打开 `http://127.0.0.1:5099`，输入刚才的密码，就能进到 SnowLuma WebUI 啦：    
![snowluma webui](/onebot/img_1.png)    
点击 `进程注入`，页面跳转后，点击 `加载`：
![snowluma webui](/onebot/img_3.png)     
然后点击左侧的 `节点配置`（要是点完页面啥也没有，随手刷新一下浏览器页面就好啦）：        
![snowluma webui](/onebot/img_4.png)    
找到 `ws服务端`，点击编辑，参考下图进行配置：    
![snowluma webui](/onebot/img_5.png)    
- 勾选 **启用**
- 端口填写 **3001**
- 路径填写 **/**
- 把默认的鉴权 Token 删除，保持 **留空**
- 点击 **保存修改**

其他 OneBot 实现也是完全一样的逻辑：3001 端口、正向 ws 服务端、空 Token。   

::: danger 安全性小提示
如果你打算将你的 `SnowLuma` 端口直接暴露到公网，我们强烈建议你设置一个专属 `token`，并在 Eridanus 的 `run/common_config/basic_config.yaml` 中，把 `ws_link` 改成 `ws://127.0.0.1:3001?token={你设置的鉴权token}`。    
如果你只是本机本地跑、或者根本没看懂这段话，放宽心保持空 Token 即可，省心又省事~
:::

### 4. 正式开机！
在确认 **打底三件套（VC_redist / Node.js / FFmpeg）** 都到位、且协议端已经正常登录并开启 3001 端口后：
1. 双击运行根目录下的 **`启动脚本.bat`**！
2. 看到控制台输出绿色的 `Connected to websocket` 之后，用浏览器打开 `http://127.0.0.1:5007` 就能看到现代化的 WebUI 管理后台啦~

---

## 路线二：从 Git 源码手动部署（适合开发者）

如果你想自己改源码、写插件或者随时向主分支贡献代码，手动部署也非常顺手：

### 1. 准备基础环境
- **VC++ 运行库**：若是新开的云服务器、挂机宝或精简环境，务必先安装 [VC_redist.x64.exe](https://aka.ms/vs/17/release/vc_redist.x64.exe)。
- **Node.js**：用于运行链接解析（`node -v`）。
- **FFmpeg**：用于语音合成与音视频处理（`winget install Gyan.FFmpeg`）。
- **Python 3.10 ~ 3.12**（官方最推荐 **Python 3.11**，安装时请务必勾选 `Add Python to PATH`）。
- **Git for Windows**：用于拉取仓库以及后续自动更新检测。

### 2. 克隆仓库并构建虚拟环境

按快捷键 `Win + R` 输入 `powershell` 打开终端，依次敲入以下指令：

```powershell
# 1. 克隆项目仓库
git clone --depth 1 https://github.com/avilliai/Eridanus.git
cd Eridanus

# 2. 创建纯净的虚拟环境并激活
python -m venv .venv
.\.venv\Scripts\activate

# 3. 升级 pip 并从国内高速镜像安装全部依赖
python -m pip install --upgrade pip
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
```

### 3. 检查基础配置并启动

在首次启动前，你可以先用文本编辑器打开 `run/common_config/basic_config.yaml`：
- 将 `master.id` 改成你自己的 QQ 号；
- 确认 `adapter.ws_client.ws_link` 是 `"ws://127.0.0.1:3001"`。

然后在终端中激活虚拟环境并运行：

```powershell
python main.py
```

终端刷刷刷滚过插件加载提示，并显示 WebUI 服务就绪后，你就已经成功连通机器人啦！    
