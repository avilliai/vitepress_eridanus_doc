---
prev:
  text: 'Linux 环境部署'
  link: '/getting-started/linux'
next:
  text: '配置须知'
  link: '/configuration/须知'
---

# 进阶配置：FFmpeg 与 Playwright 渲染引擎

把 Eridanus 跑起来之后，如果你想让 Yucca 发语音、点歌、解析 B 站/油管视频，或者生成漂亮的图形化菜单、雀魂战绩卡、森空岛/绝区零面板，那下面这两件“神器”一定要配好哦~    

---

## 1. FFmpeg（语音合成、点歌与视频解析必备）

**FFmpeg** 负责处理所有音视频转码（比如 TTS 语音切片、B站音视频合并、网易云点歌语音发送）。    

### Windows 安装方法
1. 如果你用的是 **Eridanus 一键整合包**，里面通常已经内置了 FFmpeg，无需额外操作！    
2. 如果是手动部署，可以直接在 PowerShell 中用 `winget` 一键安装：    
   ```powershell
   winget install Gyan.FFmpeg
   ```
3. 或者从 [gyan.dev](https://www.gyan.dev/ffmpeg/builds/) 下载 `ffmpeg-release-essentials.zip`，解压后把里面的 `bin` 目录路径添加到系统环境变量 `PATH` 中。    
4. 重新打开终端，输入 `ffmpeg -version`，能看到版本信息就大功告成啦！    

---

## 2. Playwright 浏览器内核（HTML 卡片与动态截图必备）

Eridanus 中的 **图形菜单 (`/remenu`)**、**用户资料卡**、**B站动态推送**、**雀魂战绩**、**绝区零/森空岛卡片** 以及 **QQ空间说说渲染** 都依赖 Playwright 的 Chromium 无头浏览器。    

在你的 Python 环境中运行：    

```bash
playwright install chromium
```

::: tip 国内下载太慢怎么办？
可以先设置国内镜像源再执行安装：    
- **PowerShell**: `$env:PLAYWRIGHT_DOWNLOAD_HOST="https://npmmirror.com/mirrors/playwright"; playwright install chromium`    
- **Linux**: `PLAYWRIGHT_DOWNLOAD_HOST=https://npmmirror.com/mirrors/playwright playwright install chromium`    
:::

---

## 3. 配置升级与备份神器：`tool.py`

很多小伙伴担心：“以后 Eridanus 更新了新功能，`config.yaml` 多了新配置项，我要是直接覆盖岂不是要重新填一遍 API Key？”    
完全不用担心！项目根目录的 `tool.py` 专门解决这个问题：    

- **自动备份**：`python tool.py backup` 会把 `run/` 和 `data/` 下的所有 `.yaml` 配置备份到上级目录 `../backup_config`；    
- **无损合并**：`python tool.py merge` 会以新版本的 YAML 结构为模板，把你备份中的旧配置值递归填回去，同时自动保留新版本新增的配置项（包括 `scheduled_tasks` 的任务列表也会按 `type + time + group_id/user_id` 智能去重合并）！    
