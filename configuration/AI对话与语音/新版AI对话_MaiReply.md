# 新版人格对话系统（MaiReply）

嘿，这可是我现在最喜欢、也是最灵动聪明的思考大脑啦~ 

比起以前死板的一问一答，MaiReply 让我更像一个活在群聊里的鲜活群友：我会看群里聊天气氛偷偷插话、偶尔会故意打错字、甚至无聊犯困时还会闹点小脾气呢。   

核心代码位于：`run/mai_reply/`  
配置文件位于：`run/mai_reply/config.yaml`

只要在配置文件顶部把 `enable: true` 打开，系统就会自动接管所有对话，并优雅地退休掉旧版的对话逻辑。

## 核心配置片段一览

```yaml
enable: true  # 开启新版人格对话，自动接管并停用旧版 ai_llm

llm:
  provider: openai      # 大模型接口类型：openai 或 gemini
  stream: true          # 是否开启流式回复
  func_calling: true    # 极为关键！是否允许我调用各种插件工具（画图、查天气、搜资源等）
  max_tool_rounds: 10   # 一轮对话中工具链连续调用的最大轮数
  
  openai:
    api_keys:
      - "your-api-key-here"
    model: "gemini-2.5-pro" # 建议选择支持工具调用的高智商模型
    base_url: "http://api.apollodorus.xyz/v1"
    temperature: 1.1    # 灵动度与发散度
    max_tokens: 1024
    enable_official_sdk: false

trigger:
  at_trigger: true               # 是否在群里被 @ 时必定回复
  prefix:                        # 前缀触发列表，例如 ["/chat", "小助手"]，填空字符串表示禁用
    - ""
  private_trigger: true          # 私聊收到消息是否直接触发
  random_reply_probability: 3    # 随缘插嘴概率（0=关闭，1-100 为概率百分比）

trigger_llm:                     # 智能潜水侦测（让廉价小模型判断群友聊的话题值不值得我接话）
  enable: true
  api_key: "your-api-key"
  base_url: "http://api.apollodorus.xyz/v1"
  model: "gpt-4o-mini"
  whitelist_enabled: true        # 是否只在特定群聊开启随缘插嘴
  whitelist:
    - 1050663831                 # 允许插嘴的白名单群号
  ignore_prefixes:               # 遇到以这些前缀开头的指令跳过判断，不乱插嘴
    - "/"
    - "#"

persona:
  chara_file: "猫娘.txt"          # 角色设定文件！放在 data/system/chara/ 目录下（比如 yucca.txt）

human_like:                      # 活人拟真行为模拟！
  typing_delay_ms_per_char: 30   # 模拟打字延迟（毫秒/字），拒绝秒回机器人感
  typing_delay_max_ms: 4000
  split_threshold: 60            # 超过字数自动拆分成多条短消息连发
  split_interval_ms: 800         # 多条短句发送间隔
  typo_probability: 8            # 偶尔故意手滑打错字的概率（百分比）
  ignore_probability: 15         # 模拟“已读不回/懒得搭理”的随性概率（仅对概率触发有效）
  quote_reply: true              # 是否随机引用群友的原话进行回复

emotion:                         # 少女的心情波动系统
  enable: true
  decay_rate_min: 20             # 心情自然衰减平复时间（分钟）
  default_mood: "还行，没啥特别的"

context:
  max_turns: 20                  # 当前会话保存的最大轮数
  group_context_window: 15       # 偷看群里最近15条消息作为聊天背景环境
  enable_impression: true        # 跨越日夜的记忆！对每个群友生成专属印象与好感记忆
```

## 如果你想做什么，应该改哪里？

- **想换一个更喜欢的人设角色卡（比如换成我 Yucca 或者是你专属定制的角色）？**
  - 在 `data/system/chara/` 文件夹里放好你的文本或 JSON 角色卡，然后把 `persona.chara_file` 改成对应文件名（例如 `"yucca.txt"`）。
- **想让我不仅能陪聊，还能帮群友查天气、画图、查番剧？**
  - 一定要确认 `llm.func_calling: true`！各个功能插件只要导出了工具函数，MaiReply 就会自动把工具清单递给大模型，让我根据对话自然调用。
- **觉得我在群里话太多有点吵，或者概率插嘴太烦人？**
  - 把 `trigger.random_reply_probability` 调小或者设为 `0`；如果只想在熟人群里插嘴，打开 `trigger_llm.whitelist_enabled: true` 并把目标群号写进 `whitelist` 列表里就好啦。
- **回复总是长篇大论太机械，想要鲜活的女孩子碎碎念感觉？**
  - 检查 `human_like` 区块：把 `split_threshold` 设为 `50` 或 `60`，长段落就会自动拆成一截一截的轻快短句发出来；再加上适当的 `typing_delay_ms_per_char`，活人感直接拉满~
