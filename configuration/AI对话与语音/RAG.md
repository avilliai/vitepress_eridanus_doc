# RAG 长期记忆系统

::: tip 功能定位
MaiReply RAG 是专为 Eridanus 架构设计的**下一代长期记忆检索增强系统**。  
它融合了 **Mem0 原子事实提取** 与 **多轮会话情境切片（Episodes）**，并原生支持**群聊多发言人（Multi-Speaker）感知**。  
你可以在 WebUI 的 `mai_reply 新版ai对话.rag` 找到其配置面板，或直接编辑 `run/mai_reply/rag.yaml`。
:::

---

## 什么是 MaiReply RAG？

传统的群聊 Bot 长期记忆常常面临两难困境：
1. **传统向量检索（Naive RAG）**：把聊天记录按固定字数机械切片后存入向量库。检索时经常召回零散无序、缺乏主谓语的聊天碎片，不仅消耗大量 Token，还容易导致模型胡言乱语。
2. **传统记忆槽位（Slots / Impression）**：由大模型对每个用户或群维护固定槽位（如“基础档案”、“喜好”等）。虽然结构清晰，但槽位容量有限，长远来看难以承载数十上百天复杂的真实经历，且每次交互都需要注入全部槽位，非常挤占上下文。

**MaiReply RAG 采用了双层混合架构**：
- **原子事实层（Mem0 架构）**：后台自动调用 `trigger_llm`，从真实聊天中抽取结构化的**原子事实**（例如 *“用户A在莫斯科留学，近期正准备毕业论文”*、*“用户B喜欢机械键盘”*、*“Bot答应了明早叫赖哥起床”*）。
- **情境切片层（Episodes）**：将多轮真实互动的完整对话上下文结构化归档为片段，保留发言人、昵称与时间线。当用户问起“还记得我们上次聊什么吗”时，能精准还原历史现场。
- **群聊多发言人（Multi-Speaker）智能感知**：在群聊中，Bot 不仅能记住正在跟自己对话的人，还能通过极低 Token 消耗（每人 1 句精炼认知）识别群内其他在场/被提及的群友，真正做到“认识群里的大家”。
- **Bot 全局独立生活经验（agent:global）**：记录 Bot 自身的经历、愿望与生活状态，让 Bot 拥有独立于任何单一用户的真实“人格实体感”。

---

## 记忆是如何注入提示词的？在哪注入的？

许多用户好奇：*“RAG 查出来的记忆究竟放在哪里了？为什么有时候看得到，有时候看不到？”*

### 1. 注入位置
RAG 记忆是在生成 Bot 回复前，由 `run/mai_reply/service/prompt_builder.py` 动态注入到 **System Prompt（系统提示词）** 内部的。  
它位于人格基础设定的下方、对话历史（Chat History）的上方，作为 Bot 思考与回复时的“潜意识背景认知”。

### 2. 注入模块结构
一次完整的 RAG 召回，会根据当前对话情境将检索到的条目分组呈现给大模型：

```text
==================================================
【相关历史往事（引文）】：
"2026-10-30 呷玛日巴: 你能用rag查东西吗
 2026-10-30 Bot: 当然可以呀，我平时检索外部知识、查资料用的就是这套逻辑"

【关于当前对话用户 (发言者) 的事实记忆】：
- 用户赖哥在莫斯科留学，专业为政治学，正处于毕业设计高压期
- 用户讨厌跨性别人士
- 双方已相识5年，曾在2021年首次为Bot命名

【群内其他成员简短认知（你在群里也认识他们）】：
- DAKIMO：近期正被群友拿“草莓大福”的梗调侃
- 小明：平时喜欢在群里分享技术博客，擅长Python

【你的真实世界经历与自我记忆】：
- Bot确认偏好加牛奶与糖的咖啡，运行模型为gemini-3-flash
- 2026-10-29：感知到开发者中午对其性格螺丝进行了微调
==================================================
```



**当前版本已全面优化**：
1. **逐项贪心打包（Item-by-Item Greedy Packing）**：系统在组装提示词时，按语义相关度逐条完整添加；若某一条目加入后会超出预算，则**整条舍弃**，绝不在句子中间生硬截断，确保模型看到的每句话都是语法完整、意义明确的。
2. **预算充裕化**：默认提示词预算上调至 `max_prompt_chars: 1200`，`max_prompt_tokens: 1500`，既能容纳丰富的长期记忆，又给后续的对话留足空间。

---

## 快速配置指南

配置文件位于 `run/mai_reply/rag.yaml`（或在 WebUI 的 `mai_reply 新版ai对话.rag` 中配置）。

### 1. 核心总开关与接入模式

```yaml
enable: true  # 总开关，开启后启用 RAG 长期记忆
integration_mode: replace  # 记忆接入模式：replace 或 augment
db_path: data/dataBase/mai_rag_memory.db  # 向量与事实数据库路径
```

::: tip 重点说明：`integration_mode` 模式选择
- **`replace`**：  
  Bot 回复时**只注入 RAG 检索出来的精准记忆**，自动跳过原有的全局 Slots 槽位与主观印象注入。  
  这样可以**大幅节省上下文 Token**，避免无关记忆反复挤占提示词，彻底告别“思想钢印”（Bot 每句话都复读同一个槽位设定）。  
  *(注意：原有的 Slots 和 Impression 系统代码依然保留并在后台运行，绝不会损坏既有数据)*。
- **`augment`**：  
  将 RAG 检索到的记忆与原有的 Slots / Impression 叠加注入。适合希望全面保留所有记忆系统的场景，但会消耗更多上下文 Token。
:::

---

### 2. 私聊与群聊控制

```yaml
private:
  enable: true  # 是否在私聊中启用 RAG

group:
  enable: true  # 是否在群聊中启用 RAG
  whitelist_enabled: false  # true: 仅在下方 whitelist 群中启用；false: 对所有群生效
  whitelist: []  # 允许启用 RAG 的群号列表，如 [1050663831]
  observe_untriggered: true  # 是否沉淀旁观群消息（群友之间日常闲聊即使没艾特Bot，也会自动归档为背景记忆）
```

::: info 隐私与安全边界
- **私聊记忆绝对隔离**：私聊记忆存储在 `private:<user_id>` 作用域中，**群聊检索时绝对禁止查询私聊记录**，绝不会在群聊中泄漏用户的私聊隐私！
- **用户档案跨会话漫游**：用户在私聊中沉淀的个人事实（如偏好、忌口、称呼），以 `user:<user_id>` 维度安全沉淀，Bot 在群里与该用户互动时依然能够感知并记住。
:::

---

### 3. Embedding 向量模型配置

RAG 依赖 Embedding 模型将文本转化为向量。系统支持 **OpenAI 兼容接口** 与 **Cloudflare Workers AI**。

#### 方案 A：使用 OpenAI 兼容接口（推荐，如官方免费接口 / 本地模型）

```yaml
embedding:
  provider: openai
  base_url: http://api.apollodorus.xyz/v1  # 接口地址（注意末尾不带 /chat/completions）
  endpoint: embeddings
  model: qwen3-embedding-4b  # 推荐模型：qwen3-embedding-4b
  dimensions: 2560  # qwen3-embedding-4b 的向量维度为 2560
  api_key: '你的APIKey'  # 可在交流群 1050663831 获取开发者提供的免费接口 Key
  api_key_env: MAI_RAG_API_KEY  # 可选：优先从该环境变量读取 Key
  timeout_seconds: 15
  query_instruction: Given a conversation query, retrieve relevant past conversations and memories
```

::: tip 免费资源支持
Eridanus 官方网关 `http://api.apollodorus.xyz/` 为用户提供了免费的 `qwen3-embedding-4b` 向量化模型支持。  
如果你使用第三方聚合站或本地部署的 `vLLM` / `Ollama`，只需将 `base_url`、`model`、`dimensions` 修改为对应参数即可。
:::

#### 方案 B：使用 Cloudflare Workers AI（免费 BGE-M3）
`你可以问你的gpt怎么获取这个东西，cf提供的每日配额是完全足够的`
```yaml
embedding:
  provider: cloudflare
  cloudflare:
    account_id: 你的Cloudflare账户ID
    model: '@cf/baai/bge-m3'
    api_token: 你的CloudflareToken
    api_token_env: CLOUDFLARE_API_TOKEN
    timeout_seconds: 30
    query_instruction: ''
```

---

### 4. 对话归档与 Mem0 事实抽取参数

系统在后台平滑归档对话，无需人工干预：

```yaml
archive:
  private_turns: 6  # 私聊每累计 6 轮完整对话（一问一答）触发一次归档与事实提取
  group_messages: 15  # 群聊每累计 15 条用户消息触发一次归档与事实提取
  idle_seconds: 600  # 空闲归档：若未达上述条数但会话静默超过 10 分钟，自动将缓冲区落盘
  max_buffer_chars: 6000
  chunk_chars: 1800  # 长对话切片最大字符数
  overlap_messages: 2  # 切片相邻重叠消息数，保留上下文连贯性
```

::: tip 提取模型说明
原子事实提取（Mem0 机制）无需单独配置大模型 API，系统会自动复用你已经在 `run/mai_reply/config.yaml` 中配置好的 **`trigger_llm`** 廉价/快速小模型进行提取，速度快、成本极低！
:::

---

### 5. 检索与提示词预算参数

控制每次 Bot 发言时如何召回记忆：

```yaml
retrieval:
  mode: adaptive  # 自适应检索模式（对简单寒暄如"好的"、"收到"自动跳过检索，节省调用）
  top_k: 8  # 每次最多候选条数
  min_similarity: 0.35  # 余弦相似度阈值（低于此分数的记忆不予召回，过滤不相关杂讯）
  max_prompt_chars: 1200  # 注入提示词的最大总字符数（防止记忆过长挤占回复）
  max_prompt_tokens: 1500  # 注入提示词的最大 Token 上限
  timeout_seconds: 15.0  # 检索超时限制
```

---

## 最佳组合 RAG+Slots
这是我目前在使用的配置，目前来看，长期记忆表现较好。
webui打开`mai_reply 新版ai对话.config`，或编辑`Eridanus/run/mai_reply/config.yaml`
```yaml
context: # 上下文相关配置

  user_memory_mode: "slots"   
  group_memory_mode: "none"
  #....演示需要，隐藏了其他配置项.....
  user_trigger_turns: 3               # 用户记忆更新间隔（无论是槽位事实还是主观印象，每进行几轮对话触发一次更新，默认3轮）



  Impression:
    #....演示需要，隐藏了其他配置项.....
    enable_impression: false   # 是否启用用户印象记忆（跨会话）

  Slots: # Slots 结构化记忆槽位系统
    enable_memory_slots: true   # 是开启对用户的记忆槽位
    #....演示需要，隐藏了其他配置项.....
    memory_slot_max_chars: 80    # 单条槽位记忆最大字数限制
    enable_group_memory_slots: false # 关闭群聊记忆槽位(因为有RAG)

```
我们仅开启私聊Slots，用以强化对单个用户的聊天效果。    
webui打开`mai_reply 新版ai对话.rag`，或编辑`Eridanus/run/mai_reply/rag.yaml`
```yaml
enable: true  
integration_mode: augment  #兼容slots功能。如为replace则slots和impression都会默认关闭
#....演示需要，隐藏了其他配置项.....
private:
  enable: true
group:
  enable: true
  #....演示需要，隐藏了其他配置项.....
  observe_untriggered: true  # 旁观消息也做语义分析并参与检索，但绝不替群友抢答
embedding:
  provider: openai  # cloudflare: Workers AI；openai: 兼容接口 / 本地 Embedding 服务
  base_url: http://api.apollodorus.xyz/v1
  endpoint: embeddings
  model: qwen3-embedding-4b
  api_key: ''
  #....演示需要，隐藏了其他配置项.....
archive:
  private_turns: 6  # 每6轮完整用户/Bot对话归档一次并抽取Mem0原子事实
  group_messages: 15  # 群内累计15条用户消息归档，Bot发言一起沉淀
```

---

## 性能优化与 API 配额保护机制

有用户担心：*“群里消息那么多，后台每次提取事实和向量化会不会狂刷我的 API，造成账单爆炸？”*

MaiReply RAG 在架构底层实现了严苛的**防刷与成本保护措施**：

1. **防抖合并批量请求（Debounce & Batch Embedding）**：  
   在同一个归档周期内，情境对话切片（Episodes）和 Mem0 提取出的多条事实记忆，会经过 **1.0 秒防抖队列**自动打包合并。系统将多条文本合并为一个 HTTP 请求发送至 Embedding 接口（默认单次批处理上限 `batch_size: 16`），避免了逐条单发带来的 HTTP 握手开销与日志刷屏。
2. **严格事实去重与向量复用（Deduplication & Vector Preservation）**：  
   当会话中提取出的事实已经存在于数据库且文本未发生改变时，系统仅更新该条事实的时间戳，**永久保留原有已计算好的向量**，绝不重复调用 Embedding 接口重新向量化！
3. **查询向量 5 分钟 LRU 缓存**：  
   对于短时间内相似的提问或多轮连续互动，相同的检索 Query 会直接命中内存缓存，无需再次请求向量模型。
4. **自适应查询过滤（Adaptive Retrieval）**：  
   面对“哈哈”、“嗯嗯”、“收到”等无意义短语或纯表情包互动，系统会自动判定无需召回记忆，直接跳过检索流程。

---

## 实用运维指令

| 指令 | 作用域 | 权限说明 | 作用 |
| :--- | :--- | :--- | :--- |
| `/clearrag` 或 `清除RAG记忆` | 私聊 | 发送者本人 | 清理发送者在私聊中的所有 RAG 历史记忆 |
| `/clearrag` 或 `清除RAG记忆` | 群聊 | 群主 / 管理员 / Bot主人 | 清理当前群聊的所有 RAG 记忆与本群事实 |

### 数据库维护
所有向量与结构化记忆均保存在单文件 SQLite 数据库中：`data/dataBase/mai_rag_memory.db`。  
数据库开启了 WAL（Write-Ahead Logging）高并发模式，崩溃不丢数据。  
如果你需要彻底重置所有记忆重新开始，只需在关闭 Bot 后直接删除该 `.db` 文件，重启 Bot 时系统会自动重建全新的空数据库。

