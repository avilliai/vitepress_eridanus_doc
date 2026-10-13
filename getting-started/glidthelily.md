---
prev:    
  text: 'Linux 环境部署'    
  link: '/getting-started/linux'    
next:    
  text: '配置须知'    
  link: '/configuration/须知'    
---

# 进阶配置：FFmpeg 

把 Eridanus 跑起来之后，如果你想让机器人发语音、点歌、解析 B 站/油管视频，或者生成漂亮的图形化菜单、雀魂战绩卡、森空岛/绝区零面板，那下面这两件“神器”一定要配好哦~    

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
