---
next:    
  text: 'Linux 环境部署'    
  link: '/getting-started/linux'    
---

# Windows 环境部署

在 Windows 上部署 Eridanus，你有两条路可以选：    
如果你不想折腾 Python 环境，直接用 **开箱即用的一键整合包** 就好；如果你是开发者或想随时跟进 Git 最新分支，也可以选择 **源码手动部署**~    

---

## 方式一：使用 Windows 一键整合包（最推荐新手）

我们已经把 Python 运行环境、Git、常用依赖和启动/更新脚本都打包好啦！    

1. **下载与解压**    
   - 前往 [Eridanus Releases 页面](https://github.com/avilliai/Eridanus/releases) 或开发群（`913122269`）群文件下载最新整合包。    
   - 解压到任意**不含中文和空格**的路径下。    
2. **认识根目录下的 `.bat` 快捷脚本**    
   - `启动Eridanus.bat`：直接启动 Eridanus 主程序与 WebUI（默认监听 `http://127.0.0.1:5007`）。    
   - `更新Eridanus.bat`：一键拉取远程仓库最新代码，并自动调用 `tool.py` 无损合并你的本地 `yaml` 配置文件（绝不会弄丢你的 API Key 和开关设置！）。    
   - `强制更新Eridanus.bat`：当本地代码冲突时，先备份你的 YAML 配置、强制对齐远程最新代码，再自动还原并合并配置。    
   - `环境补全.bat`：当新版本增加了 Python 第三方库时，双击它即可自动补齐 `requirements.txt` 依赖。    
3. **配置 OneBot 协议端**    
   - 启动 **[SnowLuma](https://snowluma.github.io/zh/)** 或 NapCatQQ，将反向 WebSocket 地址指向 `ws://127.0.0.1:5007`。    
   - 双击 `启动Eridanus.bat`，浏览器打开 `http://127.0.0.1:5007` 即可进入 WebUI 后台！    

---

## 方式二：从 Git 源码手动部署

如果你喜欢自己掌控 Python 虚拟环境，按下面几步走就行：    

### 1. 准备基础环境
- **Python 3.10 ~ 3.12**（推荐 **Python 3.11**，安装时勾选 `Add Python to PATH`）    
- **Git**（用于拉取仓库以及 `git_update_notifier` 插件检测更新）    

### 2. 克隆仓库并安装依赖

打开终端（PowerShell 或 CMD），执行：    

```powershell
# 1. 克隆 Eridanus 仓库
git clone https://github.com/AOrbitron/Eridanus.git
cd Eridanus

# 2. (推荐) 创建并激活虚拟环境
python -m venv .venv
.\.venv\Scripts\activate

# 3. 安装项目依赖
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple

# 4. 安装 Playwright Chromium 内核 (用于网页截图、B站动态、菜单与卡片渲染)
playwright install chromium
```

### 3. 启动 Eridanus

```powershell
python main.py
```

首次启动时，Eridanus 会自动扫描 `run/` 目录下的所有插件，并在 `5007` 端口启动 WebUI 服务器。    
接下来请阅读 **[进阶配置（FFmpeg 与 Playwright）](/getting-started/glidthelily)** 或直接进入 **[WebUI 初次使用](/configuration/webui/初次使用)** 吧！    


![OneBot 协议端配置与连接流程](/onebot/1.png)    
