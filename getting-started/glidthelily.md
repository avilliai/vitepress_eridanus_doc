---
prev:
  text: 'Linux 环境部署'
  link: '/getting-started/linux'
next:
  text: '常见问题排查'
  link: '/getting-started/更新失败'
---

# 进阶环境配置：FFmpeg 与 Playwright

把 Eridanus 的本体跑起来只是第一步哦！    
如果你想让机器人不仅会打字，还能发甜甜的语音、在群里点歌、解析 B 站/YouTube 视频，或者生成漂亮的图形化菜单、雀魂战绩卡和绝区零面板，那么这个底层好帮手必须安顿好~

---

## 1. FFmpeg：语音合成、点歌与音视频转码核心

**FFmpeg** 是全能的多媒体处理引擎。在 Eridanus 里，包括 GPT-SoVITS 语音合成输出为 Silk 格式、点歌插件处理音频流、B 站视频转码压缩都离不开它。

### Windows 安装指南

- **源码用户便捷安装（推荐）**：
  在 Windows 终端中执行一行命令即可自动完成安装与 PATH 配置：
  ```powershell
  winget install Gyan.FFmpeg
  ```
- **手动解压安装**：
  1. 访问 [gyan.dev FFmpeg 构建站](https://www.gyan.dev/ffmpeg/builds/) 下载 `ffmpeg-release-essentials.zip`。
  2. 解压到 `C:\Program Files\ffmpeg`。
  3. 将 `C:\Program Files\ffmpeg\bin` 路径添加到 Windows 的系统环境变量 `Path` 中。
  4. 重新打开一个终端窗口，输入 `ffmpeg -version`，能打印出版本信息就搞定啦！

### Linux 安装指南
Debian / Ubuntu 环境下直接通过包管理器安装即可：
```bash
sudo apt update && sudo apt install -y ffmpeg
ffmpeg -version
```

---

## 2. Playwright：无头浏览器网页渲染器

Eridanus 的许多精美插件（如 B 站动态订阅、微博热搜卡片、签到面板、以及部分需要模拟登录抓取网页内容的插件）使用了现代化的 **Playwright** 浏览器内核进行高精度页面绘制与截图。

### 安装与内核下载

依赖安装完成后，还需要为 Playwright 下载对应的 Chromium 浏览器内核文件：

```bash
# 在已激活虚拟环境的终端中运行：
playwright install chromium
```

如果你是在 Linux 服务器上，可能还会缺少一些图形底层库，直接运行 Playwright 提供的依赖安装命令即可一键补全：

```bash
playwright install-deps chromium
```

::: tip 为什么是 Chromium？
Eridanus 默认针对 Chromium 做了无头渲染性能调优（包括禁用硬件加速沙箱、内存优化参数与高 DPI 渲染），只需安装 Chromium 内核即可，不需要下载 Firefox 或 WebKit，节省服务器磁盘空间。
:::

---

## 3. 中文字体库（Linux 防乱码必备）

在 Linux 系统上，无头浏览器截图或 PIL 渲染卡片时，如果系统没有安装中文字体，生成的图片文字就会变成难看的方框豆腐块！

安装常用开源中文字体族：
```bash
sudo apt install -y fonts-noto-cjk fonts-wqy-microhei fonts-wqy-zenhei
# 刷新系统字体缓存
sudo fc-cache -fv
```

验证安装成功：
```bash
fc-list :lang=zh
```
只要终端输出包含 `Noto Sans CJK` 或 `WenQuanYi` 的相关字形条目，图片渲染就会清秀好看、绝无乱码啦！
