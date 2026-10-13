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
Linux 绝对是最稳、最省资源的选择！下面我就以主流的 **Ubuntu 22.04 LTS / Debian 12** 为例，带主人一步步搭好坚固的运行堡垒~

---

## 1. 安装系统依赖与中文字体

很多云服务器默认是最小化安装，不仅没有音视频转码工具，甚至连中文字体都没有！    
如果不装中文字体，等机器人使用 manshuo_draw 绘图框架生成 B 站动态卡片、签到面板或者图形化菜单时，文字全部会变成“口口口”方块豆腐块哦！

请在终端执行以下命令装好全部底层依赖：

```bash
sudo apt update && sudo apt install -y \
    git curl wget ffmpeg \
    python3 python3-venv python3-pip \
    fonts-noto-cjk fonts-wqy-microhei fonts-wqy-zenhei \
    libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 \
    libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 \
    libgbm1 libasound2
```

---

## 2. 部署 OneBot v11 协议端

在 Linux 服务器上，推荐选用 Docker 容器或者独立二进制方式运行协议端：
- **[SnowLuma](https://snowluma.github.io/zh/)**：下载对应 Linux 架构的二进制包运行，在自带的 Web 面板上扫码即可。
- **[NapCatQQ (Docker / Shell)](https://napneko.github.io/)**：如果习惯 Docker，NapCat 提供了成熟的一键脚本与镜像。

无论选哪个，请在协议端配置好 **正向 WebSocket 服务 (WebSocket Server)**：
- **监听端口**：`3001`
- **监听地址**：`127.0.0.1`（若与 Eridanus 运行在同一宿主机/网络栈下）
- **Token**：留空

---

## 3. 克隆源码并搭建虚拟环境

推荐将代码存放在 `/opt/Eridanus` 或你的普通用户目录：

```bash
# 1. 克隆官方仓库
git clone --depth 1 https://github.com/avilliai/Eridanus.git
cd Eridanus

# 2. 创建并进入专属虚拟环境
python3 -m venv .venv
source .venv/bin/activate

# 3. 安装依赖包
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

看到控制台出现欢迎 Banner 并成功连上 `ws://127.0.0.1:3001` 且无致命红字后，按 `Ctrl + C` 退出前台，接下来我们配置后台服务！

---

## 5. 配置 systemd 系统守护进程（开机自启与崩溃自愈）

为了保证服务器重启后机器人能自动苏醒，并且崩溃时能自动爬起来继续干活，我们使用 Linux 标准的 `systemd` 服务：

创建文件 `/etc/systemd/system/eridanus.service`：

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
上面的配置假设你的项目放在 `/opt/Eridanus`，如果放在了 `/home/ubuntu/Eridanus`，记得把 `WorkingDirectory` 和 `ExecStart` 路径同步替换掉哦~
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

Eridanus 自带了配置无损合并脚本 `tool.py`。更新代码时不需要手忙脚乱地到处备份配置，执行：

```bash
cd /opt/Eridanus
source .venv/bin/activate
git pull
python tool.py
sudo systemctl restart eridanus
```

脚本会自动检测新版本新增的字段并无损补充进你的配置文件，同时将你的原始配置安全归档到 `.bak` 文件中！
