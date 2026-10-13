# Z-Library 图书检索与下载

海量原版小说、技术书籍与学术资料随心畅读！    
Eridanus 封装了 Z-Library / 电子书检索模块（位于 `run/streaming_media/zlibrary.py`），群聊中即可一键搜书并下载推送电子书文件！    

---

## 核心特性

- **全网书籍检索**：覆盖中英日文图书，返回书名、作者、格式、文件大小与评分。    
- **一键下载推送**：支持直接将选中的电子书（epub / mobi / pdf）下载为 QQ 群文件直接发送！    

---

## 配置文件详解

配置文件位于 `run/streaming_media/config.yaml`：    

```yaml
zlibrary:
  username: "your_zlib_account"
  password: "your_password"
  api_key: "your_api_token"
```

---

## 触发指令与使用方式

- **搜书指令**：    
  - `搜书 <书名或作者>` 或 `搜本子 <书名>`    
  - 例如：`搜书 深入理解计算机系统`    
  - Bot 会列出搜索结果列表及编号；    
- **下载书籍**：    
  - `下载书籍 <编号>` 或 `下载本子 <编号>`    
  - 例如：`下载书籍 1`    
  - 后台自动下载文件，并将其发送到群聊或私聊中！    
