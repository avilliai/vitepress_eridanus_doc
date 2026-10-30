# 经典 AI 对话模式（ai_llm）

::: danger 安全性小提示
我们已不再为ai_llm插件提供更新支持，ai_llm组件将在不久的将来被彻底删除。如您正在使用此功能，建议尽快更换到我们的新版ai对话。
:::

（托着腮帮子，翻了翻旧记事本）这是 Eridanus 早期最稳重踏实的经典对话核心啦~ 

如果你不需要复杂的群聊拟真情绪和长程记忆槽位，只想要一个专注且听话的问答助手、或者需要多 API Key 自动轮询、深度思考 CoT 思维链展示，那这个经典模块依然非常耐用哦。

核心代码位于：`run/ai_llm/`  
配置文件位于：`run/ai_llm/config.yaml`

::: tip 注意生效条件
如果你的 `run/mai_reply/config.yaml` 开启了 `enable: true`，MaiReply 会自动接管对话系统。想要回退使用经典对话模块，记得先去 MaiReply 里将 `enable` 设为 `false` 哦。
:::

## 核心配置片段一览

```yaml
llm:
  model: "openai"              # 模型大类：openai、gemini、default（内置模型）
  chara_file_name: "猫娘.txt"  # 人设文件名，存放于 data/system/chara/ 目录
  自动清理无效apikey: false
  retries: 6                   # 请求失败时的自动重试次数
  stream: true                 # 是否使用流式传输
  func_calling: false          # 经典模式下的函数调用开关

  openai:                      # 兼容所有 OpenAI 标准接口格式
    enable_official_sdk: true  # 是否使用官方 SDK（关闭则直接发 HTTP POST）
    api_keys:                  # 支持配置多个 API Key 轮流调用
      - "sk-xxxxxxxxxxxxxxxxxxxxxxxx"
    model: "deepseek-reasoner" # 可选用 deepseek-chat、gpt-4o 等
    quest_url: "https://api.deepseek.com" # 填入 base_url
    temperature: 1.0
    max_tokens: 2048
    CoT: true                  # 是否在消息中直接展示模型思考过程（思维链）

  prefix:                      # 触发前缀，留空则支持 @ 触发
    - ""

core:
  ai_reply_group: true         # 是否开启群聊回复
  ai_reply_private: true       # 是否开启私聊回复
```

## 如果你想做什么，应该改哪里？

- **想用 DeepSeek R1 这种推理大模型看它的解题思考？**
  - 把 `openai.model` 改为 `"deepseek-reasoner"`，`quest_url` 填入 `"https://api.deepseek.com"`，并且把 `openai.CoT` 设为 `true`，这样推理过程就会完整带出来了。
- **有多个 API Key 怕单号限流？**
  - 在 `openai.api_keys` 列表中一行一个添加多个 Key，请求时系统会自动进行轮询与健康检查。
- **想通过特定前缀才触发，不想被无脑艾特？**
  - 在 `llm.prefix` 列表里填入你的专属前缀，例如 `["/ai", "提问"]`。
