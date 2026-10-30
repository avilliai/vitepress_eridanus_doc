# RAG增强检索
::: tip
此功能尚在试验阶段，用于增强mai_reply的长期记忆表现。   
你可以在webui的`mai_reply 新版ai对话.rag`找到它的配置文件   
或是直接编辑`run/mai_reply/rag.yaml`
:::

# MaiReply RAG 长期记忆

`rag.yaml` 是独立于 Impression 和 Slots 的第三层记忆，默认 `enable: false`。关闭时不创建 RAG 数据库、不调用 embedding，也不改变原有记忆模式与提示词。

## Embedding 服务配置
`embedding.provider` 支持 `cloudflare` 和 `openai`。未配置该字段时沿用 `openai`，兼容现有配置。
### Cloudflare Workers AI / BGE-M3
::: tip
白嫖cloudflare embedding模型的教程我就不写了，太过简单。   
如果不想用cf提供的模型，Eridanus开发者的api站`http://api.apollodorus.xyz/` 也提供了免费的embedding模型
你也可以自己部署/寻找其他资源。
:::
使用cloudflare
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
使用其他中转
```yaml
embedding:
  provider: openai  # cloudflare: Workers AI；openai: 8099/Kaggle 等兼容接口
  # 以下同层参数仅用于 openai provider。
  base_url: http://api.apollodorus.xyz/v1
  endpoint: embeddings
  model: qwen3-embedding-4b
  api_key: ''
```

`CLOUDFLARE_API_TOKEN` 环境变量优先于 `api_token`。Cloudflare 子配置独立于 OpenAI 参数，RAG 总开关默认关闭。

适配器向 `https://api.cloudflare.com/client/v4/accounts/<account_id>/ai/run/<model>` 发送 `{"text": [...]}`，读取 `success` 和 `result.data`，检查数量、维度和数值后统一做单位化。BGE-M3 使用原文，不继承 Qwen 的查询指令，也不发送 OpenAI 的 `input`、`encoding_format` 或 `dimensions` 参数。

### OpenAI-compatible

切回 `embedding.provider: openai`，使用同层原有的 `base_url`、`endpoint`、`model`、`api_key`、`api_key_env`、`dimensions`、`query_instruction` 参数。Cloudflare 子配置不会影响它。

更换 provider 或模型后，持久化的原文会在后台重新索引。旧向量在新索引完成前不会参与检索；即使两种模型都是 1024 维也不会混用。不要删除记忆库来切换服务。

## 聊天与隔离

- 私聊按 `private:<user_id>` 隔离；群聊按 `group:<group_id>` 隔离，每条记忆保留发言者 ID 和昵称。其他群和私聊内容不会进入当前群。
- 群白名单独立配置，允许的群可以沉淀未触发回复的旁观消息。
- 用户与 Bot 的真实发言先存 SQLite 缓冲，达到对话阈值后归档成带角色、参与者和时间的片段，再由后台批量索引；服务故障时保留队列并重试。
- `integration_mode: replace` 默认只注入检索到的少量往事，替代本轮 Slots/Impression/全局记忆注入。`augment` 则与旧记忆叠加。
- Bot 回复保留为 `assistant`，不提升为用户事实；被抢占/发送失败的生成不记作已发送回复。短答“去过”“上个月”也会和上下文一起保留，不再按10字门槛丢弃。命令仍过滤。
- `/clearrag` 或 `清除RAG记忆`：私聊清理自己的记忆，群聊由管理员/主人清理当前群。

## 触发方式与日志

群聊满足总开关 `enable: true`、`group.enable: true` 后，`group.whitelist_enabled: false` 允许所有群；设为 `true` 时仅允许 `whitelist` 中的群，空列表不允许任何群。`observe_untriggered` 控制未触发回复的旁观消息是否入库，Bot 回复时仍会按当前群检索。

默认私聊每 **3轮完整用户/Bot对话**、群聊每 **10条用户消息** 统一归档。群里所有参与者及期间 Bot 发言一同保留，但 Bot 发言不占用户消息计数。`archive.private_turns`、`group_messages` 独立于 Slots；缺省时继承旧记忆的轮数配置。这里是结构化归档，不额外调用聊天模型生成摘要，避免摘要丢失菜馆名称、人物、约定等细节。

不足阈值的缓冲持久化，重启不会丢失。空闲默认 **600秒**后补归档，`idle_seconds: 0` 关闭此行为；过长缓冲提前归档。单条消息只产生本地写入，不逐条请求 embedding。长归档按完整发言组织并切块，相邻归档可保留少量上下文重叠。`index.batch_size` 是已归档片段单次请求的批量上限，失败按 `retry_seconds` 重试。

检索先结合当前会话近期发言与上次召回对象，补全“上次那家”等表达；以发言者 ID/明确姓名约束个人往事，支持“上个月”“一个月前”“上周”和明确日期，联合语义、关键词、时间排序。多人同名或多个相近候选会加入追问提示，不强行指定唯一答案。查询补全使用本地规则与主题词扩展，不调用另一个聊天模型，不能保证所有复杂指代都被理解。未知时间表达或信息不足仍应由 Bot 自然追问。

`retrieval.mode: adaptive` 跳过简单寒暄/确认，其他有效查询默认检索；同一作用域、同一用户的相同补全查询缓存向量5分钟。没有候选记录或人物/时间筛选为空时不调用接口。索引请求减少不等于所有计费 token 按同比例降低：费用还取决于合并文本长度，且有效检索仍可能需要一次查询 embedding。默认记忆注入仍严格限制预算。

`logging.enable: true` 默认使用框架日志器，在控制台与日常日志文件输出：启动是否开启、群策略、入库片段数、索引开始/完成及维度耗时、检索命中数量与注入字节数。不会输出消息原文、昵称或密钥。关闭时也会有一次未启用提示（除非日志开关也关闭）。

总开关为 `false` 时不会入库或检索；修改该开关、白名单或 provider 后需要重启 Bot。启用 Cloudflare 但缺少账户 ID 或 Token 时会在启动时明确提示。

配置修改后重启 Bot，使 provider 和模型命名空间生效。首次请求/云端冷启动可能超过 `retrieval.timeout_seconds`；该轮会跳过检索，后台重试不会阻塞回复。

