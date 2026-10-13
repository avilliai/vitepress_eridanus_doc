# 新版 AI 对话（MaiReply）

终于聊到 Eridanus 最引以为傲的“灵魂核心”啦！MaiReply 是集成了深度记忆槽位、自主反思与工具调用的下一代多轮对话系统~    
Eridanus 全新一代的对话引擎名为 **MaiReply**（位于 `run/mai_reply`）。    
它不仅仅是普通的 LLM 对话，而是集成了 **多轮函数调用（Function Calling）**、**自适应情绪波动**、**跨群/私聊印象进化系统**、**用户深度喜好记忆槽位** 以及 **全自动语音+动态表情包配图** 的综合拟真智能体！    

---

## 核心设计亮点

1. **超强拟真人格（Persona）**：    
   - 默认加载 `data/system/chara/` 下的角色卡（如默认角色预设文件）。    
   - 绝非客服式有问必答，而是有着猫咪般的慵懒、狡黠、灵动与小傲娇。    
   - 拥有独立心情分值系统，会根据群友互动好感、被调戏还是被宠爱实时更新对每个用户的“印象描述”。    
2. **万能 Function Calling 工具库**：    
   - MaiReply 自带 50+ 种框架级工具，涵盖：搜图、天气、点歌、算命塔罗、B站解析、ASMR查询、甚至**自建跨时区定时任务**！    
3. **主动消息与关怀机制**：    
   - 在聊天结束后，我可以根据氛围自主判断是否以及何时在未来的某个时间点主动找你私聊，不再只能被动等待被 @！    
4. **视听一体化联动**：    
   - 回复文字时自动切片并调用 `tts_v2`（GPT-SoVITS）合成语音。    
   - 配合 `call_send_mface` 自动根据当前心情和语境从表情库挑选 GIF 表情包同频发送！    

---

## 配置文件详解

配置文件位于 `run/mai_reply/config.yaml`：    

```yaml
enable: true  # 开启后自动接管并优先于旧版 ai_llm 对话

llm:
  provider: openai      # 推荐 openai 协议，兼容市面上绝大多数中转和官方 API
  stream: true          # 是否开启流式传输
  func_calling: true    # 核心！开启函数调用工具链
  max_tool_rounds: 10   # 单次对话允许的最大工具递归轮数

  openai:
    api_keys:
      - "sk-xxxxxxxxxxxxxxxxxxxxxxxx"
    model: "gemini-2.5-pro"  # 推荐使用推理或多模态能力强的大模型
    base_url: "http://api.apollodorus.xyz/v1" # 接口地址（可进交流群获取官方代理）
    temperature: 1.1    # 带来丰富而自然的语调起伏
    max_tokens: 1024
```

---

## 触发方式与交互规则

- **群聊交互**：    
  - `@机器人 <想说的话>`    
  - 在群里直接喊机器人名字（如 `Eridanus` 或配置的名称）开始闲聊。    
- **私聊交互**：    
  - 直接发送任意文字，无需前缀或 @，随时随地与 Bot 畅聊！    
