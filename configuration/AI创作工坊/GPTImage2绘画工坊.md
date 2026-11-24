# GPTImage2 绘画工坊（OpenAI Images API 标准）

::: tip 免费接口
我们为 Eridanus 用户准备了兼容 OpenAI Images API 标准的 `gptimage2` 网关接口：  
- 可前往 QQ 群 `1050663831` 获取 API Key  
- 网关地址：`http://api.apollodorus.xyz/v1`
:::

Eridanus 已将原有的 `gpt_official`（OpenAI DALL-E）与 `gptimage2` 合并为 **统一的 `gptimage2` 配置入口**，请求与响应全面遵循 OpenAI `/v1/images/generations` 与 `/v1/images/edits` 标准（同时兼容 `b64_json` 与 `url` 返回格式）。

它不仅支持自然语言随口画图、多图编辑与九宫格表情包制作，还可以**作为 `comfyui` / `sd` 的同级别对等后端**，直接承接对话自拍、Bot 形象重绘与 QQ 空间配图任务！

- **核心代码**：`run/ai_generated_art/gptimage2.py`、`run/ai_generated_art/service/gptimage2_client.py`、`run/ai_generated_art/function_collection.py`
- **配置文件**：`run/ai_generated_art/config.yaml` 的 `gptimage2` 区块

---

## 交互指令与调用场景

1. **群聊快捷指令**
   - **`/gpt <画面描述>`** 或 **`/生图 <画面描述>`**：直接通过统一文生图入口渲染图片。
   - **`/图像编辑`**：开启多轮交互式修图会话！连续发送 1 张或多张参考图及文字修改要求后，发送 **`/end`** 提交给 `/v1/images/edits` 生成。
2. **自然对话与 Function Calling**
   - **对话改图（`image_edit`）**：无论当前文生图主后端设为 `comfyui` 还是 `sd`，对话触发的 AI 改图工具 `image_edit` **固定使用 `gptimage2`** 完成，不再混入 ComfyUI 重绘。
   - **对话文生图（`text2img`）**：当把 `文生图function_calling后端` 设为 `"gptimage2"` 时，AI 对话中要画图或发自拍会自动调用 `gptimage2`；若涉及 Bot 本身（`is_about_bot=true`），会自动附上 `bot_oc` 原画与 [衣橱系统](./衣橱系统与人设锚点.md) 的当前穿搭参考重绘。
3. **QQ 空间与并发绘图同级支持**
   - 当 `文生图function_calling后端: "gptimage2"`、`gptimage2.接管sd: true` 或 `ai绘画.gptimage2画图: true` 时，`画 <描述>`、QQ 空间定时早安/晚安/日常动态配图均可无缝切换到 GPTImage2 出图。

---

## 核心配置一览（`run/ai_generated_art/config.yaml`）

```yaml
# 如需让对话画图与空间配图优先使用 GPTImage2，可设为主后端：
# 文生图function_calling后端: "gptimage2"

gptimage2:
  base_url: "http://api.apollodorus.xyz/v1" # 网关 /v1 地址或 OpenAI 官方 https://api.openai.com/v1
  apikey: "your_gptimage_key_here"          # 接口授权密钥（sk- 开头）
  model: "gpt-image-2.5-flare"              # 网关支持 gpt-image-2.5-flare / nano-banana-2；官方可填 gpt-image-1 / dall-e-3
  size: ""                                  # OpenAI 标准尺寸（如 1024x1024；留空按 aspect_ratio 与 resolution 自动换算）
  quality: "medium"                         # OpenAI 标准质量（low / medium / high / standard / hd）
  output_format: "png"                      # 输出图片格式（png / jpeg / webp）
  timeout: 180                              # 超时时间（秒）
  aspect_ratio: "1:1"                       # 默认宽高比（1:1, 3:4, 4:3, 16:9, 9:16 等）
  resolution: "1K"                          # 1K（快速省额）或 2K（高清）
  max_retry: 5                              # 失败自动重试次数
  权限要求: 0                               # 使用所需最低权限等级
  接管sd: false                             # 开启后“画 <描述>”、“重绘”及空间配图自动交由 GPTImage2 接管
  bot_oc: "data/system/bot_oc.png"          # 绘制机器人自身时的外貌参考原画
  extra_prompt: "赛璐璐风格。不必绘制过于繁复的服饰细节和发丝..."
  character_anchor: "的固定外貌特征如下：银白色长发及肩以下且发尾带淡蓝微光..."
```

---

## 常见调整说明

- **如何切换到 OpenAI 官方或其他兼容中转？**
  - 直接将 `gptimage2.base_url` 改为 `https://api.openai.com/v1`（或中转 `/v1` 地址），填入对应的 `apikey` 和 `model`（例如 `gpt-image-1`、`dall-e-3`）即可，无需再单独配置 `gpt_official`。
- **想画竖屏或横屏壁纸？**
  - 修改 `aspect_ratio`（如 `"3:4"`、`"16:9"`），或直接指定标准 `size`（如 `"1024x1536"`、`"1792x1024"`）。
- **想让 `画 <描述>`、自拍、空间配图全部改走 GPTImage2？**
  - 将顶部 `文生图function_calling后端` 改为 `"gptimage2"`，或开启 `gptimage2.接管sd: true` 即可彻底省去本地/云端 SD 与 ComfyUI 的显存依赖。
