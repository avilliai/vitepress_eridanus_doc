# Z-Library 图书检索与下载

海量原版小说、技术书籍与学术资料随心畅读！    
Eridanus 封装了 Z-Library 电子书检索模块（位于 `run/resource_collector/resource_search.py`），群聊中即可一键搜书并下载推送电子书文件！    

---

## 🤖 AI 智能对话联动 (Function Calling)    

当启用 `mai_reply` 的工具调用（`func_calling: true`）时，无需输入固定指令，直接通过自然语言问答即可由大模型自动调取以下工具检索并下载电子书：    

| 注册工具名称 | 对应功能说明 | 触发示例 |
| :--- | :--- | :--- |
| `search_book_info` | 搜索 Z-Library 图书信息（支持书名、作者、格式筛选） | *“帮我在 zlib 上查一下《三体》有没有 epub 格式”*、*“搜一下阿加莎克里斯蒂的书”* |
| `call_download_book` | 根据图书哈希 ID 或信息下载指定书籍并发送至聊天 | *“帮我下载刚才找到的那本计算机网络”* |    

---

## 核心特性

- **全网书籍检索**：覆盖中英日文图书，返回书名、作者、格式、文件大小与唯一标识。    
- **一键下载推送**：凭借书本 ID 与哈希校验码，直接将选中的电子书下载后发送到群聊或私聊中！    

---

## 配置文件详解

配置文件位于 `run/resource_collector/config.yaml`：    

```yaml
zlibrary:
  username: "your_zlib_account"
  password: "your_password"
  api_key: "your_api_token"
```

---

## 触发指令与使用方式

- **搜书指令**：    
  - `搜书 <书名或关键词>`    
  - 例如：`搜书 深入理解计算机系统`    
  - Bot 会列出搜索结果列表，展示书名、作者、格式、`book_id` 以及专属 `hash`；    
- **下载书籍**：    
  - `下载书 <book_id> <hash>`    
  - 例如：`下载书 1234567 89abcdef01`    
  - 系统在后台调用直链下载引擎抓取电子书文件，并直接下发到聊天窗口中！    
