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

::: tip 持久化运行(建议)
bot必须要一直开着才可以在群里收发消息，如果想要自己的机器人7*24h在线，建议购买云服务器或者挂机宝   
- [阿里云](https://www.aliyun.com/) 服务器 2h2g/99/年 续费同价
- [腾讯云](https://cloud.tencent.com) 服务器 新用户38-68不等,1h2g/2h2g
- 京东云(没有关注)
- 华为云(没有关注)
- 火山云(没有关注)

相比于挂机宝，云服务器有独立的公网ip，更加安全可靠。但是，机器人往往并不需要一个公网ip，因此我们推荐更加便宜的挂机宝
- [mcbbs.ucyy.cn](https://mcbbs.ucyy.cn/aff/INDDSEDQ) 2h2g/5.5元/月  
其他同配置挂机宝大致也是同样的价格，自己找就行。     
2h2g对于部署和使用Eridanus来说已经绰绰有余了。    
在windows设备部署Eridanus时，系统版本需要满足`win10及以上`或`windows server 2019及以上`
:::


## 路线一：使用 Windows 整合包

如果你只是想开箱即用，不想在电脑里装一堆 Python 版本或者折腾虚拟环境，直接用整合包就最稳妥啦！整合包里已经塞好了精简且纯净的 Python 运行环境、Git 工具、所有依赖包以及预置好的快捷脚本。

### 1. 下载与解压
1. 前往 **[Eridanus GitHub Releases](https://github.com/avilliai/Eridanus/releases)** 页面，或者加入交流群（`913122269` 或 `1050663831`）在群文件中下载最新的 Windows 整合包。
2. 将压缩包解压到你的硬盘中。

::: danger 路径避坑警告！
解压的目标路径 **尽量避免包含中文字符或空格**（例如不要放在 `D:\我的文档\新建文件夹\` 这种地方），建议解压到类似 `D:\Eridanus\` 这样干净简短的纯英文根目录下！
:::
### 2. 启动 `部署引导程序.exe`
一键部署完成后根目录会出现Eridanus目录，点进去即可看到`启动脚本.bat`。   
### 3. 配置 OneBot 协议端（以 SnowLuma 为例）
在Eridanus准备完成后，我们来启动协议端：
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
在确认协议端已经正常登录并开启 3001 端口后：
1. 双击运行根目录下的 **`启动脚本.bat`**！
2. 看到控制台输出绿色的 `Connected to websocket` 之后，用浏览器打开 `http://127.0.0.1:5007` 就能看到Eridanus的 WebUI 管理后台啦~ (初始账号密码都是`eridanus`)

下一步： [配置ai对话](/configuration/AI对话与语音/新版AI对话_MaiReply) 

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
