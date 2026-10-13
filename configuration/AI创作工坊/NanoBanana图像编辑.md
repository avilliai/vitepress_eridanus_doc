# Gemini Nano-Banana 图像编辑

（咬着吸管，好奇地打量着画纸）想对一张现有的图片进行神仙级的大改造？比如把白天的风景变成繁星夜空、给画里的女孩子戴上一顶可爱的贝雷帽？

Nano-Banana 接入了基于 Gemini 多模态大模型的图像理解与改图编辑能力，支持多轮交互式的自然语言精准修图。

核心代码位于：`run/ai_generated_art/gemini_nano_banana.py`  
配置文件位于：`run/ai_generated_art/config.yaml`

## 源码里真正支持的交互指令

整个编辑流程采用状态机交互设计，认准以下特殊指令：

- `#nano`
  - 发送 `#nano` 开启图像编辑对话流！
  - 机器人会提示进入 Nano 编辑模式。在接下来的会话中，你可以发送一张待修改的底图，接着发送文字修改诉求（例如：“把裙子变成浅蓝色百褶裙，背景加上樱花飘落效果”）。
- `#view`
  - 查看当前会话中已经暂存的底图和所有修改诉求列表。
- `#ok`
  - 确认提交！系统将打包底图与修改意图，调用 Gemini Image 图像编辑模型生成全新的渲染结果。
- `#clear`
  - 放弃本次编辑，清空当前编辑缓存并退出会话状态。

## 核心配置片段一览（`run/ai_generated_art/config.yaml`）

```yaml
ai绘画:
  nano_banana_key:
    - "YOUR_GEMINI_API_KEY_HERE" # 必须填入支持图像生成的 Gemini API Key
  nano_banana_config:
    model: "gemini-3-pro-image-preview" # 图像编辑模型标识
    base_url: "https://generativelanguage.googleapis.com"
```

## 如果你想修改，应该改哪里？

- **提交 `#ok` 后提示 API 失败或未授权？**
  - 检查 `nano_banana_key` 是否配置了有效的 Google Gemini API 凭证。
- **需要走中转网关或者反向代理？**
  - 把 `base_url` 改成你的中转站点地址，即可绕过网络限制顺畅改图。
