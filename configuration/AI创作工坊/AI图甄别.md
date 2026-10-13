# AI 图片甄别与检测 (AI Art Moderate)    

智能鉴别二次元插画或日常图片是否由生成式 AI (如 Midjourney, Stable Diffusion, NovelAI 等) 绘制生成，并返回精细的判定置信度百分比。    

---

## 架构实现说明与外部 API    

> ⚠️ **注意**：本功能并非本地内置的模型引擎，而是对接外部内容风控与生成式鉴别云端接口：    
> 1. **Sightengine API**：调用业界成熟的 `genai` 模型计算 AI 生成概率；    
> 2. **AnimeTrace / 相关二次元鉴别服务**：针对动漫二次元画风进行特化识别。    
> 
> 因此，使用前必须在配置文件中填入你的 API Key 凭据方可正常工作。    

---

## AI 智能对话联动 (Function Calling)    

当开启 `mai_reply` 的函数调用能力后，支持在自然语言对话中让机器人主动检测图片：    

| 注册工具名称 | 对应功能说明 | 触发示例 |
| :--- | :--- | :--- |
| `call_aiArtModerate` | 传入图片 URL，返回 AI 绘制生成的置信度百分比 | *“帮我看看这张图是不是 AI 画的”*、*“检测一下群友刚发的这张插画”* |

---

## 传统指令触发与使用示例    

在群聊中输入以下指令：    

### 1. 附图一步检测    
发送 `ai图检测` 并附带图片：    
```text
ai图检测 [附带图片]
```    
机器人将调用云端鉴别接口，回复例如：    
> `aiArtModerate调用成功，ai生成的可能性为：98.7%`    

### 2. 交互式多图检测    
直接发送文本 `ai图检测`，机器人会进入等待接收图片状态，随后发送的图片都会自动触发鉴别，直到检测完成。    

---

## 配置文件说明    

配置文件位于 `run/ai_generated_art/config.yaml`：    

```yaml
sightengine:
  api_user: "your_sightengine_api_user"       # Sightengine 控制台获取的 api_user
  api_secret: "your_sightengine_api_secret"   # Sightengine 控制台获取的 api_secret
```
