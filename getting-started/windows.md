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

## 路线一：使用 Windows 一键整合包（强烈推荐新手！）

如果你只是想开箱即用，不想在电脑里装一堆 Python 版本或者折腾虚拟环境，直接用赖哥和团队准备的整合包就最稳妥啦！整合包里已经塞好了精简且纯净的 Python 运行环境、Git 工具、所有依赖包以及预置好的快捷脚本。

### 1. 下载与解压
1. 前往 **[Eridanus GitHub Releases](https://github.com/avilliai/Eridanus/releases)** 页面，或者加入交流群（`913122269`）在群文件中下载最新的 Windows 一键整合包压缩文件。
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

### 3. 连接 OneBot 协议端与开机！
1. 启动并扫码登录你的 **[SnowLuma](https://snowluma.github.io/zh/)** 或 NapCat。
2. 确保协议端里添加了 **WebSocket 服务端 (WebSocket Server)**：端口设为 `3001`，Token 留空。
3. 双击运行 `启动脚本.bat`！
4. 看到控制台输出绿色的 `Connected to websocket` 之后，用浏览器打开 `http://127.0.0.1:5007` 就能看到现代化的 WebUI 管理后台啦~

![OneBot 协议端配置与连接流程](/onebot/1.png)

---

## 路线二：从 Git 源码手动部署（适合开发者）

如果你想自己改源码、写插件或者随时向主分支贡献代码，手动部署也非常顺手：

### 1. 准备基础环境
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
接下来记得前往 **[进阶配置（FFmpeg与Playwright）](/getting-started/glidthelily)** 把语音转码和浏览器截图装好哦~
