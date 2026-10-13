# Steam游戏资料与史低查询

由 `run/acg_infromation/steam_service.py` 驱动，随时查询 Steam 商店游戏售价、平史低、历史最低折扣以及详尽评价详情。    

---

## 核心特性

- **商店信息即时检索**：获取官方游戏封面、游戏标签、当前支持语言与简评。    
- **价格与史低比对**：智能获取国区/全区实时折扣百分比与历史最低售价（平史低/新史低）。    

---

## 真实指令列表

- **查询游戏价格与详情**：    
  - 指令格式：`steam查询 <游戏名称>`    
  - 示例：    
    - `steam查询 艾尔登法环`    
    - `steam查询 黑神话悟空`    
    - `steam查询 Cyberpunk 2077`    

---

## 🤖 AI 智能对话联动 (Function Calling)

在 `mai_reply` 大模型对话体系中，群友可自由询问折扣：    
- 工具支持：`anime_game_service_func_collection`    
- 对话示例：*“帮我看看现在星露谷物语在 Steam 上打折没，多少钱”*
