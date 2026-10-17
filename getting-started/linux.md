---
prev:
  text: 'Windows 环境部署'
  link: '/getting-started/windows'
next:
  text: '进阶环境配置'
  link: '/getting-started/glidthelily'
---

# Linux 服务器部署

想把 Bot 丢在云服务器、工控机或者家用 NAS 上，实现全年无休 24 小时陪伴群友？    
Linux 绝对是最稳、最省资源的选择啦！下面我就以主流的 **Ubuntu 22.04 LTS / Debian 12** 为例，带主人一步步搭好坚固的运行堡垒~

---

## 1. 安装系统底层依赖与打底工具（极简云服务器必看）

(把下巴抵在抱枕上) 很多云服务器刚开出来的时候是极简最小化系统，空荡荡的什么都没有。不仅缺了音视频转码工具，连 Node.js、中文字体甚至基本的 C++ 编译环境都被剔除了…    
- 要是没有 **Node.js**，视频解析功能就要受影响啦；
- 要是没有 **FFmpeg**，机器人就无法合成 Silk 格式语音，在群里彻底变哑巴；
- 要是没有 **中文字体**，等机器人绘图生成 B 站动态卡片、签到面板或者图形化菜单时，所有的汉字都会变成一堆难看的“口口口”方块豆腐块！

别偷懒，在终端里直接执行下面这一长串命令，一口气装好全部底层依赖：

```bash
sudo apt update && sudo apt install -y \
    git curl wget ffmpeg \
    nodejs npm \
    build-essential libffi-dev \
    python3 python3-venv python3-pip \
    fonts-noto-cjk fonts-wqy-microhei fonts-wqy-zenhei \
    libcairo2 libjpeg-dev zlib1g-dev
```

装完顺手验证一下打底两件套：
```bash
node -v
ffmpeg -version
```
只要能正常吐出版本号，地基就算打得稳稳当当啦！

::: tip Node.js 版本提示
如果你的发行版仓库里默认的 node 版本太老（低于 v18），建议使用 NodeSource 脚本安装更新的 LTS 版本：
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```
:::

---

## 2. 部署 OneBot v11 协议端

在 Linux 服务器上，推荐选用独立二进制或者 Docker 容器方式运行协议端：
- **[SnowLuma](https://snowluma.github.io/zh/)**：下载对应 Linux 架构的二进制包运行，通过自带的 Web 面板扫码即可登录（依赖刚才装好的 Node 环境）。
- **[NapCatQQ (Docker / Shell)](https://napneko.github.io/)**：如果习惯 Docker，NapCat 提供了成熟的一键脚本与镜像。

无论选哪个，请在协议端配置好 **正向 WebSocket 服务 (WebSocket Server)**：
- **监听端口**：`3001`
- **监听地址**：`127.0.0.1`（若与 Eridanus 运行在同一宿主机/网络栈下）
- **Token**：留空即可

---

## 3. 克隆源码并搭建虚拟环境

推荐将代码存放在 `/opt/Eridanus` 或你的普通用户主目录：

```bash
# 1. 克隆官方仓库
git clone --depth 1 https://github.com/avilliai/Eridanus.git
cd Eridanus

# 2. 创建并进入专属虚拟环境
python3 -m venv .venv
source .venv/bin/activate

# 3. 安装依赖包（使用清华镜像高速下载）
pip install --upgrade pip
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
```

---

## 4. 修改管理员配置与测试运行

编辑配置文件 `run/common_config/basic_config.yaml`：

```bash
nano run/common_config/basic_config.yaml
```

找到 `master` 节点，把 `id` 改成你自己的管理员 QQ 号：
```yaml
master:
  name: "管理员"
  id: 1840094972   # 改成你的管理员QQ
```

先在前台测试运行一次，看看能不能顺利连上协议端：

```bash
source .venv/bin/activate
python main.py
```

看到控制台出现欢迎 Banner 并成功连上 `ws://127.0.0.1:3001` 且无致命红字报错后，按 `Ctrl + C` 退出前台，接下来我们给它配置 24 小时后台守护！

---

## 5. 配置 systemd 系统守护进程（开机自启与崩溃自愈）

为了保证服务器重启后机器人能自动苏醒，并且遇到网络抖动或崩溃时能自动爬起来继续干活，我们使用 Linux 标准的 `systemd` 服务：

创建并编辑文件 `/etc/systemd/system/eridanus.service`：

```ini
[Unit]
Description=Eridanus Bot Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/Eridanus
ExecStart=/opt/Eridanus/.venv/bin/python /opt/Eridanus/main.py
Restart=always
RestartSec=5
Environment="PYTHONIOENCODING=utf-8"
Environment="LANG=C.UTF-8"

[Install]
WantedBy=multi-user.target
```

::: tip 路径记得对号入座哦！
上面的配置假设你的项目放在了 `/opt/Eridanus`，如果放在了 `/home/ubuntu/Eridanus`，记得把 `WorkingDirectory` 和 `ExecStart` 路径同步替换成你的实际路径哦~
:::

加载并启动守护进程：

```bash
# 重载系统守护进程
sudo systemctl daemon-reload

# 设置开机自启并立刻启动
sudo systemctl enable --now eridanus

# 查看实时运行日志
sudo journalctl -u eridanus -f -o cat
```

---

## 6. Linux 下如何平滑更新？

Eridanus 自带了配置无损合并脚本 `tool.py`。更新代码时不需要手忙脚乱地到处备份配置，直接执行：

```bash
cd /opt/Eridanus
source .venv/bin/activate
git pull
python tool.py
sudo systemctl restart eridanus
```

脚本会自动检测新版本新增的字段并无损补充进你的配置文件，同时将你的原始配置安全归档到 `.bak` 文件中，省心极啦！
