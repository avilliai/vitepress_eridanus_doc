---
prev:    
  text: 'Windows 环境部署'    
  link: '/getting-started/windows'    
next:    
  text: '进阶环境配置'    
  link: '/getting-started/glidthelily'    
---

# Linux 服务器部署

想把 Bot 部署在云服务器或 NAS 上 24 小时不间断陪伴群友？Linux 绝对是最稳的选择！    
下面以 **Ubuntu 22.04 / Debian 12** 为例，带你一步到位部署 Eridanus~    

---

## 1. 安装系统基础包与中文字体

Linux 服务器默认往往没有中文字体和 `ffmpeg`，如果不装字体，Playwright 渲染出来的菜单、B站动态和签到卡片会变成方块“豆腐块”哦！    

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

在 Linux 上，同样推荐使用 **[SnowLuma](https://snowluma.github.io/zh/)** 或 **NapCatQQ (Docker / Shell)**：    
- 按照 [SnowLuma 官方文档](https://snowluma.github.io/zh/) 启动实例并扫码登录；    
- 配置 **反向 WebSocket (WebSocket Client)** 连接到 `ws://127.0.0.1:5007`。    

---

## 3. 拉取 Eridanus 并配置虚拟环境

```bash
# 1. 克隆仓库
git clone https://github.com/AOrbitron/Eridanus.git
cd Eridanus

# 2. 创建并激活虚拟环境
python3 -m venv .venv
source .venv/bin/activate

# 3. 安装 Python 依赖
pip install --upgrade pip
pip install -r requirements.txt

# 4. 安装 Playwright Chromium 及系统依赖
playwright install chromium
playwright install-deps chromium
```

---

## 4. 启动与后台守护进程 (systemd)

先在前台测试运行一次，确认没有报错：    

```bash
source .venv/bin/activate
python main.py
```

测试正常后，可以创建 `/etc/systemd/system/eridanus.service` 让它开机自启、崩溃自动重启：    

```ini
[Unit]
Description=Eridanus Bot Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/Eridanus
ExecStart=/root/Eridanus/.venv/bin/python /root/Eridanus/main.py
Restart=always
RestartSec=5
Environment="PYTHONIOENCODING=utf-8"

[Install]
WantedBy=multi-user.target
```

启用并查看日志：    

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now eridanus
sudo journalctl -u eridanus -f
```

---

## 5. Linux 下如何更新代码且不丢配置？

Eridanus 根目录自带了配置备份与智能合并工具 `tool.py`！在 Linux 上更新时，只需执行：    

```bash
# 1. 备份所有 YAML 配置到 ../backup_config
python tool.py backup

# 2. 拉取最新代码
git pull

# 3. 将你的旧配置与新版配置智能合并（保留你的设置，自动补齐新字段）
python tool.py merge
```
