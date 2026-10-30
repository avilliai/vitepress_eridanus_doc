# 新版人格对话系统（MaiReply）

::: tip 
最开始是因为新版ai对话一部分参考了maibot的设计，但随着时间推移，目前该组件所有和maibot有关的部分已完全被弃用。   
仅出于更新功能的兼容性考量，未更改插件名。
:::

嘿，这可是我现在最喜欢、也是最灵动聪明的思考大脑啦~ 

比起以前死板的一问一答，MaiReply 让我更像一个活在群聊里的鲜活群友：我会看群里聊天气氛偷偷插话、偶尔会故意打错字、甚至无聊犯困时还会闹点小脾气呢。  

核心代码位于：`run/mai_reply/`  
配置文件位于：`run/mai_reply/config.yaml`
它在webui中的名称是：`mai_reply 新版ai对话.config`

---
## 配置对话api
在webui中打开`mai_reply 新版ai对话.config`，或是手动用任意文本编辑器打开`Eridanus/run/mai_reply/config.yaml`    
找到以下字段
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
    base_url: http://api.apollodorus.xyz/v1
```
`api_keys`中填写你的`apikey`，`base_url`就是`base_url`，不要带之后的`/chat/completions`。   
保存并重启bot，如果你的key和base_url是有效值的话，在群内bot就能够回复你了。

::: tip 免费鸡蛋
我们为Eridanus用户准备了若干免费接口，包括`llm api`。   
可前往qq群`1050663831`获取      
网关在`http://api.apollodorus.xyz/`
:::


::: tip 进阶配置
接下来是进阶内容
:::
## trigger_llm
Eridanus采用了多模型协作的架构。在上一步我们填写了主回复模型，接下来可以配置`trigger_llm`，填写一个更加廉价、快速的模型，把那些不太重要的工作，比如记忆总结提取、群内判断是否触发、自我审核、翻译等全部交给它。
```yaml
trigger_llm:   #ai判断是否触发
  enable: true
  api_key: ""
  base_url: "http://api.apollodorus.xyz/v1"   # 可以去我们的开发群1050663831获取免费apikey。
  model: ""              # 填入你用于判断的廉价/快速模型
  stream: True
  whitelist_enabled: true  # 是否启用白名单模式，启用后只有在白名单中的群聊才会触发ai回复
  whitelist:
    - 1050663831
  ignore_prefixes:  # 以这些字符串开头的消息将跳过 trigger_llm 判断，不触发AI回复流程
    - "/"
    - "#"
  reply_max_chars: 150 #插嘴最多回复字数
  reply_max_segments: 4 #插嘴最多回几句
```
和上一步同样的配置规则。
### 想要在群内自动插话
`whitelist_enabled`为`true`的情况下，把`群号`添加到`whitelist`中，群内每条消息都会发给bot，由`trigger_llm`自行判断是否应当回复。     
当`whitelist_enabled`为`false`，所有群的每条消息都会发给bot，由`trigger_llm`自行判断是否应当回复。   
## Memory Slots 记忆槽位机制 | Impression 印象机制
这是我们为bot设置的两套长期记忆机制，一般而言，任选其一即可。   
两套机制均使用`trigger_llm`中配置的模型开展工作。
```yaml
context: # 上下文相关配置
  max_turns: 20   # 私聊会话最多保留多少轮(一轮=一问一答)
  group_context_window: 15   # 群聊上下文：读取群内最近N条消息作为旁观上下文

  # 记忆体系模式选择与群生态槽位配置：当两者都启用时，可自行选择 ( "slots" | "impression" | "both")
  user_memory_mode: "slots"    # 用户记忆模式：slots(槽位事实)、impression(主观印象)、both(两者兼备)。若设为slots且开了impression，系统视同impression关闭以节省API token并出warning
  group_memory_mode: "slots"   # 群聊记忆模式：slots(群生态10槽位)、impression(群整体印象)、both(两者兼备)。若设为slots且开了群印象，同理视同群印象关闭以节省token
  group_memory_whitelist_enabled: true # 群聊记忆是否启用白名单模式。true=白名单模式（仅白名单群触发群生态槽位/群印象）；false=全局模式（对所有群生效）
  group_memory_whitelist: []            # 群聊记忆白名单群号列表。若开启了白名单模式但此处为[]，将自动使用trigger_llm配置的whitelist
  user_trigger_turns: 3               # 用户记忆更新间隔（无论是槽位事实还是主观印象，每进行几轮对话触发一次更新，默认3轮）
  group_trigger_messages: 10          # 群聊记忆更新间隔（无论是群生态槽位还是群整体印象，群公屏每积累多少条消息触发一次更新，默认10条）
  group_reply_speaker_memory_count: 3 # 群聊回复时读取最近几位发言者的记忆（通用支持槽位事实与主观印象，默认3人）
```

### Slots 槽位机制
槽位机制会分别针对私聊对象、群聊、bot自身进行更新。在部署项目后，`默认开启并使用Slots机制`进行长期记忆维护。    
槽位机制默认有10个记忆点。根据`user_trigger_turns`和`group_trigger_messages`的设置，每次触发时，将自动提取当前对话中符合槽位(slots)特征的信息，并更新/补充原有槽位中的信息。    
10个槽位分别是
```
【用户记忆槽位】
"基础个人档案",
"深度喜好偏好",
"雷区禁忌点",
"日常作息规律",
"性格特质风格",
"重要人际关系",
"契约约定承诺",
"重大生平里程1",
"重大生平里程2",
"近期核心焦点",

【bot自身记忆槽位】
"Bot独立生活状态",
"Bot个人兴趣爱好",
"Bot世界观个性",
"Bot自发心愿目标",
"Bot社交日常圈子",
"Bot空间生活动态1",
"Bot空间生活动态2",
"Bot空间生活动态3",
"Bot空间生活动态4",
"Bot近期心境感悟",

【群聊记忆槽位】
"社群定位与核心圈子",
"群规底线与敏感禁忌",
"专属黑话与经典名梗",
"活跃作息与时段节奏",
"群体气氛与社交基调",
"核心人物与成员生态",
"常驻热门与高频话题",
"重大历史与里程碑大事件",
"Bot在本群的角色与契约",
"近期核心焦点与走向",
```
一些记忆槽位的开发利用程度目前偏低，将在未来的开发工作中进一步盘活。    
```yaml
#slot配置
context: # 上下文相关配置
  max_turns: 20   # 每个会话保存的最大消息轮数（一来一回=1轮）
  group_context_window: 15   # 群聊上下文：读取群内最近N条消息作为旁观上下文（让bot感知群聊气氛）
  session_ttl: 7200      # 2小时   # Redis TTL（秒）。会话历史缓存存活时间
  # 记忆体系模式选择与群生态槽位配置：当两者都启用时，可自行选择 ( "slots" | "impression" | "both")
  user_memory_mode: "slots"    # 用户记忆模式：slots(槽位事实)、impression(主观印象)、both(两者兼备)。若设为slots且开了impression，系统视同impression关闭以节省API token并出warning
  group_memory_mode: "slots"   # 群聊记忆模式：slots(群生态10槽位)、impression(群整体印象)、both(两者兼备)。若设为slots且开了群印象，同理视同群印象关闭以节省tokenn: # Impression 主观印象总结系统
  #..中间其他的省略了....
  Slots: # Slots 结构化记忆槽位系统
    enable_memory_slots: true   # 是否开启结构化长期固定事实记忆与Bot全局独立生活记忆层
    global_memory_slot_count: 10  # Bot全局独立生活经历记忆槽位数（默认10条）
    user_memory_slot_count: 10    # 每个用户的长期客观事实记忆槽位数（默认10条）
    memory_slot_max_chars: 50    # 单条槽位记忆最大字数限制
    enable_group_memory_slots: true  # 是否开启群专属结构化特征槽位（社群定位/禁忌/黑话/生态等10个槽位，替代群印象避免API浪费与上下文冗余）
    group_memory_slot_count: 10      # 群记忆槽位数量（默认10个）
    group_user_context_turns: 3      # 群聊中被@时，最多回溯该用户自身历史轮数（默认3轮，控制私聊上下文，把更多空间留给群公屏消息）
```
你可以通过这些配置项控制记忆槽位功能。
### Impression 印象机制
这是早期开发过程中制作的功能，原理是每过几轮对话，就总结/更新对用户/群的印象。更偏向中短期记忆，目前建议使用更加完善的`Slots`机制   
`如果你想使用此机制，需要做出如下修改`  
```yaml
context: # 上下文相关配置
  max_turns: 20   # 每个会话保存的最大消息轮数（一来一回=1轮）
  group_context_window: 15   # 群聊上下文：读取群内最近N条消息作为旁观上下文（让bot感知群聊气氛）
  session_ttl: 7200      # 2小时   # Redis TTL（秒）。会话历史缓存存活时间
  # 记忆体系模式选择与群生态槽位配置：当两者都启用时，可自行选择 ( "slots" | "impression" | "both")
  user_memory_mode: "impression"    # 用户记忆模式：slots(槽位事实)、impression(主观印象)、both(两者兼备)。若设为slots且开了impression，系统视同impression关闭以节省API token并出warning
  group_memory_mode: "impression"   # 群聊记忆模式：slots(群生态10槽位)、impression(群整体印象)、both(两者兼备)。若设为slots且开了群印象，同理视同群印象关闭以节省token
  
  Impression: # Impression 主观印象总结系统
    enable_impression: true   # 是否启用用户印象记忆（跨会话）
    impression_ttl: 604800  # 7天 印象保留时间
    impression_max_chars: 180 #用户impression最大字数
    enable_group_impression: false # 是否启用群聊气氛印象
    group_max_chars: 120 #群聊印象最大字数
```
### 两个一起用/两个都不想要
可以，但**不推荐**，只会白白增加token消耗。   
`如果你想同时使用两套机制`
```yaml
context: # 
  # 记忆体系模式选择与群生态槽位配置：当两者都启用时，可自行选择 ( "slots" | "impression" | "both")
  user_memory_mode: "both"    # 用户记忆模式：slots(槽位事实)、impression(主观印象)、both(两者兼备)。若设为slots且开了impression，系统视同impression关闭以节省API token并出warning
  group_memory_mode: "both"
```
`如果你两套机制都不想用`
```yaml
context: # 
  # 记忆体系模式选择与群生态槽位配置：当两者都启用时，可自行选择 ( "slots" | "impression" | "both")
  user_memory_mode: "none"    # 用户记忆模式：slots(槽位事实)、impression(主观印象)、both(两者兼备)。若设为slots且开了impression，系统视同impression关闭以节省API token并出warning
  group_memory_mode: "none"
```
## 自我审核
同样使用`trigger_llm`中配置的模型和接口，自动根据4个评估维度，对当前用户的聊天上下文进行评估。如违规则上报给管理员。   
```yaml
context: 
  #.....已省略其他配置项
  anti_nsfw:
    enable: true          # 是否开启审核系统，模型默认用trigger_llm的
    trigger_turns: 5      # 几轮对话触发一次审查
```
## 修改人设
人设文件全都放置在`Eridanus/data/system/chara`文件夹下，你可以选择其一，并填写到如下配置中。
```yaml
persona:  # 人设
  name: ""  # 角色名（可选，留空则读取默认配置
  system_prompt: ""   #系统提示词（留空则使用默认角色卡内容）建议在角色卡里写好system prompt，这里留空即可。
  chara_file: "猫娘.txt"  #角色文件名，放在data/system/chara文件夹内。如开启 gptimage2接管sd，建议使用【猫娘gptimage2.txt】
```
你也可以修改对应的角色卡，或自己制作新的角色卡。
## 自动调用语音合成
让bot在回复用户的同时，自动发送语音。    
tts_v2插件提供了多个speaker，只需在这里填写对应的speaker和语言类别，即可自动匹配到相应的语音合成引擎。
```yaml
tts:
  voice_reply_probability: 30 # 回复时附带语音的概率（0=关闭，1-100=概率）。需要配置voice_model和相关参数
  speaker: natuki  # api.apollodorus.xyz提供的语音模型说话人
  lang_type: JP  #自动翻译
```
如果你想增加自己的speaker，应当查看tts_v2的文档。 
## 情绪系统
目前对情绪系统的开发利用程度较低，简单说就是还没起到啥作用，没想好怎么设计。
```yaml
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
```
## 权限设置
不想让人随便和bot聊天可以调这里
```yaml
permission:
  group_reply_level: 0  # 群聊回复所需权限等级
  private_reply_level: 0  # 私聊回复所需权限等级
```
## 拟人化机制
总的来说，就是让bot的活动行为看起来更像人类，一部分作用是增强对话沉浸感，或许在一定程度上也有利于降低被风控的风险(？)
```yaml
human_like:  # 模拟人类回复特征的配置
  typing_delay_ms_per_char: 30 # 打字延迟模拟（毫秒/字，0=关闭）
  typing_delay_max_ms: 4000 # 最大打字延迟上限（毫秒）
  split_threshold: 60 # 消息分割：超过N字自动拆成多条发（0=不分割）
  split_interval_ms: 800  # 分割后每条消息之间的间隔（毫秒）
  typo_probability: 8  # 偶尔故意打错字的概率（0-100）。0=关闭
  ignore_probability: 15  # 不回复的概率（模拟"看了不回"，0=总是回，100=从不回）。仅对概率触发有效
  quote_reply: true  # 是否在回复时随机引用原消息
  quote_reply_probability: 40   # 引用概率（0-100）
```
## Skills支持
像agent一样，Eridanus同样可以调用你预设的skill，但一般来说用不太到。       
Eridanus的`cli_bridge插件`能够使bot调用`宿主机已安装的`生态更成熟的`codex cli`和`claude cli`，因此，并不推荐为Eridanus添加skill。
```yaml
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
```
## MCP支持
```yaml
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
