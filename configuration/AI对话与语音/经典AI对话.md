# 经典 AI 对话（ai_llm）

如果你不需要复杂的 MaiReply 记忆槽位与主动关怀链，只想配置一个轻量、极速响应、直连大模型 API 的问答机器人，那么经典的 **ai_llm** 插件（位于 `run/ai_llm`）就是最稳定坚固的基石。    

---

## 核心特性

- **双协议直连**：原生支持 OpenAI 规范接口（DeepSeek、ChatGPT、Claude 兼容）与 Google Gemini 原生 API。    
- **思维链（CoT）可视化**：支持 DeepSeek-Reasoner 等推理模型的思维链输出开关。    
- **敏感词与反逆向过滤**：内置轻量级安全过滤，防止 Prompt 越狱与不良注入。    
- **酒馆角色卡原生支持**：直接将酒馆导出的 Character Card 放入 `data/system/chara/` 即可无缝加载。    

---

## 配置文件详解

配置文件位于 `run/ai_llm/config.yaml`：    

```yaml
llm:
  model: openai          # 模型大类：openai 或 gemini，或使用 default 内置接口
  chara_file_name: default.txt  # 默认角色卡文件名，位于 data/system/chara/
  retries: 6             # 请求失败自动重试次数
  stream: true           # 是否流式传输

  openai:
    enable_official_sdk: true
    api_keys:
      - "YOUR_API_KEY"
    model: "deepseek-reasoner"
    quest_url: "https://api.deepseek.com"
    temperature: 1.0
    max_tokens: 2048
    CoT: true            # 是否展示思维链内容
```

---

## 常用指令

- **日常聊天**：群内 `@机器人 <内容>` 或私聊直接对话。    
- **切换人设**：`/切人设 <角色卡名称>`（例如 `/切人设 default.txt`）。    
