# NovelAI 专业绘画 (NAI3 / NAI4)    

支持对接官方 NovelAI 绘图接口（包含最新的 V3 与 V4 模型体系），提供高品质动漫风格二次元插画绘制与图生图变体重绘。    

---

## 核心功能    

- **双代模型支持**：原生支持 NovelAI 3 与 NovelAI 4，出图质量极其精美。    
- **文生图与图生图**：支持提示词直接生图，以及配合参考图进行局部重绘/风格变体（`n4re` / `n3re`）。    
- **参数细节把控**：默认内置防炸词过滤、质量提示词补全与反向词优化。    

---

## 常用指令与使用示例    

在群聊中输入以下指令（需开启对应开关）：    

### 1. 文生图 (Text to Image)    
- **NovelAI 4 生图**：    
  ```text
  n4 1girl, hatsune miku, masterpiece, best quality
  ```    
- **NovelAI 3 生图**：    
  ```text
  n3 1girl, silver hair, cat ears, highly detailed
  ```    

### 2. 参考图重绘 (Image to Image)    
- **NovelAI 4 图生图**：发送 `n4re [提示词]` 并附带图片（或先发 `n4re` 进入等待传图交互模式）。    
- **NovelAI 3 图生图**：发送 `n3re [提示词]` 并附带图片（或发送 `n3re` 后上传目标图片）。    

---

## 配置文件说明    

配置文件位于 `run/ai_generated_art/config.yaml`：    

```yaml
ai绘画:
  novel_ai画图: true      # 是否开启 NovelAI 绘图指令
novel_ai:
  token: "pst-xxxx..."   # NovelAI 官方账户的 Bearer Token
  proxy: ""              # 请求代理（如需要）
```
