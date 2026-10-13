# Iwara 视频解析与下载

二次元 3D MMD 爱好者的聚集地！    
Eridanus 接入了 Iwara 视频资源解析模块（位于 `run/resource_collector/iwara.py`），提供免翻墙链接解析、预览图展示与原画视频下载！    

---

## 🤖 AI 智能对话联动 (Function Calling)    

当启用 `mai_reply` 的工具调用（`func_calling: true`）时，支持在聊天中由 AI 自动查询 Iwara 视频与榜单：    

| 注册工具名称 | 对应功能说明 | 触发示例 |
| :--- | :--- | :--- |
| `iwara_search` | 搜索 Iwara 视频资源（按关键词、作者、标签） | *“帮我找一下 iwara 上最新的原神 MMD 视频”* |
| `iwara_tendency` | 获取 Iwara 热门趋势与每日/每周热榜 | *“看看今天 iwara 热度榜前几名是什么”* |    

---

## 核心特性

- **原画无损解析**：提取高清 1080P/2K MP4 视频直链。    
- **多维度榜单追踪**：支持快速查看 Iwara 站内最新作品、近期趋势以及热门排行推荐。    

---

## 触发指令与使用方式

- **关键词搜索视频**：    
  - `iwara搜 <关键词>`    
  - 例如：`iwara搜 原神 芙宁娜`    
  - 返回搜索结果列表、作品 ID 与时长缩略图；    
- **下载视频原文件**：    
  - `iwara下载 <视频ID或网页链接>`    
  - 例如：`iwara下载 5abcde12345` 或 `iwara下载 https://www.iwara.tv/video/xxxx`    
  - 后台自动解析原画无损直链并下发；    
- **站内榜单速递**：    
  - `iwara最新`：查看全站最新上传的 MMD 视频列表；    
  - `iwara趋势`：查看当前上升趋势最快的视频推荐；    
  - `iwara热门`：查看当前全站热度最高的精选榜单；    
  - `iwara`：调出 Iwara 功能汇总菜单。    
