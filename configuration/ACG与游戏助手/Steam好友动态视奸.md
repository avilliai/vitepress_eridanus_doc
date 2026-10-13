# Steam好友动态视奸

由 `run/anime_game_service/SteamSnooping.py` 驱动，为群聊提供全自动的 Steam 好友游戏状态跟踪、新玩游戏广播与深度名片生成。    

---

## 核心特性

- **好友游戏动态轮询**：后台定时轮询已监听用户，当群友启动游戏或切换新游戏时，自动在群内发送趣味提示。    
- **个人游戏名片生成**：渲染包含玩家头像、近期游玩时长、常玩游戏统计的高清信息卡片。    
- **群聊视奸名单管理**：支持单人加入/移出监听，或群管一键将全群已绑定成员加入视奸列表。    

---

## 真实指令列表

### 1. 绑定与解绑 Steam 账号
- **绑定指令**：    
  - `steambind <SteamID64或好友代码>`    
  - 示例：`steambind 76561198xxxxxxxx` 或 `steambind 123456789`    
- **解绑指令**：    
  - `steamunbind`    

### 2. 个人游戏名片与数据
- **查看个人/他人名片**：    
  - `steaminfo`（查询自己）    
  - `steaminfo <SteamID64>`（指定ID）    
  - 发送 `steaminfo` 并 `@群友`（查询对应群友的游戏数据）    

### 3. 群聊视奸名单操作
- **添加当前群监听**：    
  - `steamadd`（将自己加入本群视奸名单）    
  - `steamadd <SteamID64>`（添加指定 Steam 用户到本群名单）    
- **移出当前群监听**：    
  - `steamremove`（将自己从本群视奸名单移除）    
  - `steamremove <SteamID64>`（移除指定 Steam 用户）    
- **群管全员操作**：    
  - `steamcheck`：查看本群当前已加入视奸的用户清单及监听状态    
  - `steamaddall`：一键将所有已绑定账号的群友全部加入本群视奸列表    
  - `steamremoveall`：清空本群视奸列表    
- **指令帮助**：    
  - `steamhelp` 或 `steam帮助`    

---

## 🤖 AI 智能对话联动 (Function Calling)

在 `mai_reply` 智能对话中，群友可直接自然语言互动：    
- 注册工具：`anime_game_service_func_collection`    
- 对话示例：*“查查赖哥最近在 Steam 玩了什么游戏”*、*“看看群里谁又在偷偷摸鱼打游戏”*
