# Telegram 贴纸包转存与下载

Telegram 上有很多神仙画风的动漫表情包想导入 QQ？    
Eridanus 内置了 Telegram 贴纸一键解析下载器（位于 `run/streaming_media/telegram_stickers.py`），自动批量下载贴纸并转码打包！    

---

## 核心特性

- **静态与动态全兼容**：支持 WebP 静态表情包以及 TGS / WEBM 动态贴纸。    
- **自动解压分发**：支持一键转码为透明 PNG / GIF，直接发送到群聊供存图。    

---

## 触发指令与使用方式

- **贴纸包下载**：    
  - `/tg <贴纸包链接或包名>` 或 `/sticker <包名>`    
  - 例如：`/tg https://t.me/addstickers/menhera_chan`    
- **执行流程**：    
  - Bot 会将整套贴纸逐一提取，并打包压缩为 zip 或精选表情直接发送！    
