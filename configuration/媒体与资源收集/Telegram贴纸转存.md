# Telegram 贴纸包转存与下载

Telegram 上有很多神仙画风的动漫表情包想导入 QQ？    
Eridanus 内置了 Telegram 贴纸一键解析下载器（位于 `run/resource_collector/tg_sticker.py`），自动批量下载贴纸并转码打包！    

---

## 核心特性

- **静态与动态全兼容**：支持 WebP 静态表情包以及 TGS / WEBM 动态贴纸。    
- **批量转码与打包**：自动将贴纸包整套拉取并打包为压缩包或逐张发送。    

---

## 配置文件详解

配置文件位于 `run/resource_collector/config.yaml`：    

```yaml
telegram:
  tg_bot_token: "123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ" # 你的 Telegram Bot Token
```

---

## 触发指令与使用方式

- **指令格式**：    
  - `下载tg贴纸 <贴纸包链接或包名>`    
- **使用示例**：    
  - `下载tg贴纸 https://t.me/addstickers/menhera_chan`    
  - `下载tg贴纸 menhera_chan`    
- **执行流程**：    
  - Bot 会自动通过 Telegram Bot API 获取该贴纸包内全部 Sticker 文件；    
  - 下载完成后保存至本地缓存并打包发送给用户，方便一键保存或批量导入！    
