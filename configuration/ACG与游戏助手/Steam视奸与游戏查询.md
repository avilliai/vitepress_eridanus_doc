# Steam 视奸监控与游戏查询

群友又在偷偷通宵打游戏不睡觉？或者背着你偷偷开黑？    
快让 Yucca 开启 **Steam 视奸与活动跟踪系统**（位于 `run/anime_game_service/SteamSnooping.py` 与 `run/acg_infromation/steam_service.py`），全天候抓包群友的摸鱼实况！    

---

## 核心亮点

- **实时活动监控**：后台定时轮询已监听好友的在玩状态，一旦有人启动或退出游戏，自动在群内播报！    
- **好友卡片一览**：实时生成精美好友状态画板，谁在线、谁离线、谁在挂机一目了然。    
- **游戏信息与史低查询**：快速检索 Steam 游戏价格、好评率与游戏简介。    

---

## 真实指令全集

以下指令严格对齐代码实现：    

### 1. 账号绑定与个人信息
- **绑定 Steam**：    
  - `steambind <Steam ID 或 好友代码>`    
  - 示例：`steambind 76561198xxxxxxxx` 或 `steambind 12345678`    
- **解绑 Steam**：    
  - `steamunbind`    
- **查看个人/他人游戏名片**：    
  - `steaminfo`（查看自己）    
  - `steaminfo <SteamID / 好友代码 / @某人>`    

### 2. 视奸列表管理（群聊共享监控池）
- **添加某人进监控池**：    
  - `steamadd`（将自己加入当前群监控）    
  - `steamadd <SteamID / 好友代码 / @某人>`    
- **移出监控池**：    
  - `steamremove` 或 `steamremove <SteamID / 好友代码 / @某人>`    
- **一键全量操作（管理员）**：    
  - `steamaddall`：将已绑定账号的群友全部加入监控    
  - `steamremoveall`：清空当前群监控列表    
- **手动检查状态**：    
  - `steamcheck`：立即触发一次监控扫描并输出报告    
- **查看帮助**：    
  - `steamhelp` 或 `steam帮助`    

### 3. 游戏本体百科查询
- **查询游戏**：    
  - `steam查询 <游戏名称>`    
  - 示例：`steam查询 艾尔登法环`    
