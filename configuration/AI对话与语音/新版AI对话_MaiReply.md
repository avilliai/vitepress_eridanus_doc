# 新版人格对话系统（MaiReply）

嘿，这可是我现在最喜欢、也是最灵动聪明的思考大脑啦~ 

比起以前死板的一问一答，MaiReply 让我更像一个活在群聊里的鲜活群友：我会看群里聊天气氛偷偷插话、偶尔会故意打错字、甚至无聊犯困时还会闹点小脾气呢。  

核心代码位于：`run/mai_reply/`  
配置文件位于：`run/mai_reply/config.yaml`

只要在配置文件顶部把 `enable: true` 打开，系统就会自动接管所有对话，并优雅地退休掉旧版的对话逻辑。

---

## 核心配置片段一览

```yaml

enable: True  # 开启后将自动禁用旧版ai回复
llm:
  provider: openai  #接口类型
  stream: true   # 是否开启流式回复（需要模型支持）
  func_calling: true  # 是否开启函数调用功能（需要模型支持）
  max_tool_rounds: 10
  openai:
    api_keys:
      - xxx
    model: gemini-2.5-pro
    base_url: http://api.apollodorus.xyz/v1   #可以去我们的开发群1050663831获取免费apikey。
    no_extra_paramters: False #启用后下边的参数都不会传入。适配各种中转
    temperature: 1.1
    max_tokens: 1024   #openai新版用的是max_completion_tokens，当max_completion_tokens配置项不为0时，自动使用max_completion_tokens
    max_completion_tokens: 0
    enable_official_sdk: false   # false=直接发post，true=用openai sdk

  gemini:
    api_keys:
      - YOUR_GEMINI_API_KEY
    model: gemini-2.0-flash-001
    base_url: https://generativelanguage.googleapis.com
    temperature: 1.0
    max_output_tokens: 1024

trigger:  # 基础触发相关配置
  at_trigger: true  #艾特触发
  prefix:     # 前缀触发（列表）
    - ""     # 空字符串=禁用
  private_trigger: true   # 私聊直接触发
  random_reply_probability: 3   # 概率触发（0=关闭，1-100=概率）
trigger_llm:   #ai判断是否触发
  enable: true
  api_key: ""
  base_url: "http://api.apollodorus.xyz/v1"   # 可以去我们的开发群1050663831获取免费apikey。
  model: "gpt-4o-mini"              # 填入你用于判断的廉价/快速模型
  stream: True
  whitelist_enabled: true  # 是否启用白名单模式，启用后只有在白名单中的群聊才会触发ai回复
  whitelist:
    - 1050663831
  ignore_prefixes:  # 以这些字符串开头的消息将跳过 trigger_llm 判断，不触发AI回复流程
    - "/"
    - "#"
  reply_max_chars: 150 #插嘴最多回复字数
  reply_max_segments: 4 #插嘴最多回几句

persona:  # 人设
  name: ""  # 角色名（可选，留空则读取默认配置
  system_prompt: ""   #系统提示词（留空则使用默认角色卡内容）建议在角色卡里写好system prompt，这里留空即可。
  chara_file: "猫娘.txt"  #角色文件名，放在data/system/chara文件夹内。如开启 gptimage2接管sd，建议使用【猫娘gptimage2.txt】

tts:
  voice_reply_probability: 30 # 回复时附带语音的概率（0=关闭，1-100=概率）。需要配置voice_model和相关参数
  speaker: natuki  # api.apollodorus.xyz提供的语音模型说话人
  lang_type: JP  #自动翻译



context: # 上下文相关配置
  max_turns: 20   # 每个会话保存的最大消息轮数（一来一回=1轮）
  group_context_window: 15   # 群聊上下文：读取群内最近N条消息作为旁观上下文（让bot感知群聊气氛）
  session_ttl: 7200      # 2小时   # Redis TTL（秒）。会话历史缓存存活时间
  # 记忆体系模式选择与群生态槽位配置：当两者都启用时，可自行选择 ( "slots" | "impression" | "both")
  user_memory_mode: "slots"    # 用户记忆模式：slots(槽位事实)、impression(主观印象)、both(两者兼备)。若设为slots且开了impression，系统视同impression关闭以节省API token并出warning
  group_memory_mode: "slots"   # 群聊记忆模式：slots(群生态10槽位)、impression(群整体印象)、both(两者兼备)。若设为slots且开了群印象，同理视同群印象关闭以节省token
  group_memory_whitelist_enabled: true # 群聊记忆是否启用白名单模式。true=白名单模式（仅白名单群触发群生态槽位/群印象）；false=全局模式（对所有群生效）
  group_memory_whitelist: []            # 群聊记忆白名单群号列表。若开启了白名单模式但此处为[]，将自动使用trigger_llm配置的whitelist
  user_trigger_turns: 3               # 用户记忆更新间隔（无论是槽位事实还是主观印象，每进行几轮对话触发一次更新，默认3轮）
  group_trigger_messages: 10          # 群聊记忆更新间隔（无论是群生态槽位还是群整体印象，群公屏每积累多少条消息触发一次更新，默认10条）
  group_reply_speaker_memory_count: 3 # 群聊回复时读取最近几位发言者的记忆（通用支持槽位事实与主观印象，默认3人）

  Impression: # Impression 主观印象总结系统
    enable_impression: false   # 是否启用用户印象记忆（跨会话）
    impression_ttl: 604800  # 7天 印象保留时间
    impression_max_chars: 180 #用户impression最大字数
    enable_group_impression: false # 是否启用群聊气氛印象
    group_max_chars: 120 #群聊印象最大字数
  Slots: # Slots 结构化记忆槽位系统
    enable_memory_slots: true   # 是否开启结构化长期固定事实记忆与Bot全局独立生活记忆层
    global_memory_slot_count: 10  # Bot全局独立生活经历记忆槽位数（默认10条）
    user_memory_slot_count: 10    # 每个用户的长期客观事实记忆槽位数（默认10条）
    memory_slot_max_chars: 50    # 单条槽位记忆最大字数限制
    enable_group_memory_slots: true  # 是否开启群专属结构化特征槽位（社群定位/禁忌/黑话/生态等10个槽位，替代群印象避免API浪费与上下文冗余）
    group_memory_slot_count: 10      # 群记忆槽位数量（默认10个）
    group_user_context_turns: 3      # 群聊中被@时，最多回溯该用户自身历史轮数（默认3轮，控制私聊上下文，把更多空间留给群公屏消息）
  anti_nsfw:
    enable: false          # 是否开启审核系统，模型默认用trigger_llm的
    trigger_turns: 5      # 几轮对话触发一次审查

human_like:  # 模拟人类回复特征的配置
  typing_delay_ms_per_char: 30 # 打字延迟模拟（毫秒/字，0=关闭）
  typing_delay_max_ms: 4000 # 最大打字延迟上限（毫秒）
  split_threshold: 60 # 消息分割：超过N字自动拆成多条发（0=不分割）
  split_interval_ms: 800  # 分割后每条消息之间的间隔（毫秒）
  typo_probability: 8  # 偶尔故意打错字的概率（0-100）。0=关闭
  ignore_probability: 15  # 不回复的概率（模拟"看了不回"，0=总是回，100=从不回）。仅对概率触发有效
  quote_reply: true  # 是否在回复时随机引用原消息
  quote_reply_probability: 40   # 引用概率（0-100）

emotion:  # 情绪系统配置
  enable: true
  decay_rate_min: 20  # 情绪衰减速率（分钟/级，越小衰减越快）
  default_mood: "还行，没啥特别的"  # 默认情绪（启动时）
  moods:  # 情绪词库（会被注入到persona prompt的{mood}中）
    - "挺好的，今天状态不错"
    - "有点无聊，不知道聊啥"
    - "困了，有点犯懒"
    - "还行，没啥特别的"
    - "有点烦，不过没关系"
    - "今天心情好，想聊天"
    - "脑子有点转不动了"
  redis_db: 4  # 情绪Redis db编号

concurrency:  # 并发控制配置
  lock_timeout: 120 # 单个会话（群/私聊）并发回复锁超时（秒）
  max_concurrent: 150  # 全局最大并发回复数（防止爆炸）
  message_merge_window_ms: 1200  # 消息队列：同一会话短时间内多条消息合并处理（毫秒，0=禁用）


permission:
  group_reply_level: 0  # 群聊回复所需权限等级
  private_reply_level: 0  # 私聊回复所需权限等级
redis: # 上下文存储db编号（避免和其他插件冲突）
  context_db: 5
  impression_db: 6
sqlite:
  context_db_path:    "data/database/context_store.db"
  impression_db_path: "data/database/impression_store.db"

skills:  # LLM Skill 风格技能包动态加载。放在skills目录下
  enable: false
  skills_dir: "skills"
  include_catalog: true          # 是否把所有可用 skill 的 name/description 注入 prompt，方便模型知道能触发什么
  llm_select: true               # 是否允许模型先看元数据，再通过 load_skill/read_skill_file/run_skill_script 函数按需加载
  enable_skill_tools: true       # 是否注册 skill 相关函数调用工具
  auto_trigger: true             # 是否根据本轮用户文本自动预加载 skill 正文，作为模型选择机制的兜底
  always_load: []                # 总是加载的 skill 名称列表，例如 ["my-skill"]
  max_loaded_skills: 3           # 单轮最多加载几个 skill 正文
  max_skill_chars: 240000          # 单个 SKILL.md 正文最大注入字符数，防止上下文爆炸
  max_file_chars: 240000          # read_skill_file / run_skill_script 输出最大注入字符数
  reload_interval_seconds: 100    # 扫描 skills 文件夹的最小间隔，支持运行中热更新
  allow_script_execution: false   # 是否允许执行 skill 包 scripts/ 下的脚本，默认关闭更安全
  script_timeout_seconds: 20
  allowed_script_extensions:
    - ".py"

mcp:  # MCP stdio server 配置。启动后会把 MCP tools 暴露为 mcp__server__tool 函数调用工具
  enable: false
  startup_timeout_seconds: 60
  tool_call_timeout_seconds: 120
  mcpServers:
    godot:
      command: "npx"
      args:
        - "@coding-solo/godot-mcp"
      env:
        GODOT_PATH: "D:/SteamLibrary/steamapps/common/Godot Engine/godot.windows.opt.tools.64.exe"
        DEBUG: "true"

    another_server:
      command: "python"
      args:
        - "path/to/server.py"
      env:
        SOME_KEY: "some-value"

    filesystem:
      command: "npx"
      args:
        - "@modelcontextprotocol/server-filesystem"
        - "D:/some/allowed/path"

```

---

## 记忆系统：Impression 与 Memory Slots 

在最新版本中，Eridanus 对记忆系统进行了革命性的**双层解耦与互斥机制**重构：

### 1. 为什么分离？
- **旧版痛点**：过去“主观印象”将用户画像、客观事实与情感偏好混杂在一起，字数冗长且模型容易在长对话中“胡言乱语”或“机械念经”，且每次全量刷新极度消耗 Token。
- **全新 Memory Slots（客观事实记忆槽位）**：
  - **Bot 自我经历层（Global Memory Slots）**：拥有专属的生活轨迹与日常经历记录（如最近关注的番剧、生活状态），Bot 不再是围着用户打转的工具人，而是一个鲜活独立的存在。
  - **用户长期硬事实层（User Memory Slots）**：以固定 10 个槽位精准记录用户的客观特征（生日、喜好、作息习惯、重要约定）。信息内化为潜意识，在对话合适时机自然流露，不刻板念经。
  - **群生态槽位（Group Memory Slots）**：提炼社群定位、群内禁忌、独特黑话与讨论重点。
- **全新 Impression（主观印象与好感度）**：
  - 侧重于感性维度的关系认知、好感度评分与阶段性情绪沉淀。

### 2. 四套模式自由选择（互斥 + 兼容 + None）
通过 `user_memory_mode` 与 `group_memory_mode` 可灵活调配：
- **`"slots"`（推荐模式，极致省 Token）**：仅启用客观事实槽位层。若同时开启了 `enable_impression`，系统会自动将 impression 视同关闭并打印 Warning，杜绝双重 API 浪费！
- **`"impression"`**：传统感性主观印象模式。
- **`"both"`**：豪华双模共存，既有硬事实又有感性印象。
- **`"none"`**：完全关闭记忆沉淀，无状态轻量运行。

---

## 如果你想做什么，应该改哪里？

- **想要完全关闭记忆功能，做一个纯净无状态的陪聊？**
  - 将 `context.user_memory_mode` 与 `context.group_memory_mode` 均改为 `"none"`。
- **想换一个更喜欢的人设角色卡（比如换成 Yucca 或你专属定制的角色）？**
  - 在 `data/system/chara/` 文件夹里放好你的文本或 JSON 角色卡，然后把 `persona.chara_file` 改成对应文件名（例如 `"yucca.txt"`）。最新版本对人设提示词进行了大幅精简，去除了冗余念经，表现更灵动自然。
- **想在特定群里让 Bot 记住大家的社群黑话？**
  - 确保 `enable_group_memory_slots: true`，并在 `context.group_memory_whitelist` 中填入该群号即可！
