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

## 路线一：使用 Windows 整合包（强烈推荐新手！）

如果你只是想开箱即用，不想在电脑里装一堆 Python 版本或者折腾虚拟环境，直接用赖哥和团队准备的整合包就最稳妥啦！整合包里已经塞好了精简且纯净的 Python 运行环境、Git 工具、所有依赖包以及预置好的快捷脚本。

### 1. 下载与解压
1. 前往 **[Eridanus GitHub Releases](https://github.com/avilliai/Eridanus/releases)** 页面，或者加入交流群（`913122269`或`1050663831`）在群文件中下载最新的 Windows 一键整合包压缩文件。
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
### 3. 配置onebot实现
1. 启动并扫码登录你的 **[SnowLuma](https://snowluma.github.io/zh/)** 或 NapCat。
2. 确保协议端里添加了 **WebSocket 服务端 (WebSocket Server)**：端口设为 `3001`，Token 留空。

我们以snowluma为例，这是snowluma-windows版本解压后的项目资产    
![snowluma目录结构](/onebot/img.png)
双击启动launcher.bat，你将看到这样的日志    
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
注意`initial credentials: user=admin password=470e5ed82a261b32`，其中`password=`后面的那一串就是`webui初始密码`，记下它     
然后浏览器打开`http://127.0.0.1:5099`，输入刚才的`webui初始密码`，即可进入snowluma webui    
![snowluma webui](/onebot/img_1.png)    
点击`进程注入`，页面会跳转，点击`加载`
![snowluma webui](/onebot/img_3.png)     
然后点击左边的`节点配置`，有时候点完节点配置页面还是啥也没有，此时需要`刷新一下页面`。        
![snowluma webui](/onebot/img_4.png)    
找到`ws服务端`，点击编辑，参考下图配置即可    
![snowluma webui](/onebot/img_5.png)    
- 勾选启用
- 端口是3001
- 路径是/
- 把默认的鉴权Token删除，留空
- 点击保存修改

其他onebot实现也是一样，3001，ws服务端，空token。   
::: danger 安全性警告
当然，如果你要将你的`snowluma`暴露到公网的话，我们强烈建议你设置一个`token`，此时需要修改`Eridanus`的`basic_config.yaml`，把原来的`ws://127.0.0.1:3001`改成`ws://127.0.0.1:3001?token={你设置的鉴权token}`    
如果你根本不知道这段话在说什么，那请放心，保持空token即可，这样可以省去额外配置Eridanus的麻烦。
:::

### 4. 开机！
3. 双击运行 `启动脚本.bat`！
4. 看到控制台输出绿色的 `Connected to websocket` 之后，用浏览器打开 `http://127.0.0.1:5007` 就能看到现代化的 WebUI 管理后台啦~



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
接下来记得前往 **[进阶配置（FFmpeg）](/getting-started/glidthelily)** 把语音转码和浏览器截图装好哦~
