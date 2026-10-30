# Steam 好友动态视奸

（悄悄猫在门缝边往里瞧）群友说他去睡觉了，结果转头就在 Steam 启动了黑神话悟空或者小红车？哼哼，一切伪装都逃不过我的法眼！

本插件能够周期性巡逻你和好友的 Steam 在线状态，谁偷偷启动了游戏、玩了多久、什么时候下线，都会被自动播报到群里。

核心代码位于：`run/anime_game_service/SteamSnooping.py`  
配置文件位于：`run/anime_game_service/config.yaml` 的 `steamsnooping` 区块

## 交互指令

指令均不区分大小写，支持以下完整管理链路：

- `steambind <SteamID/好友代码>`：将当前 QQ 绑定到指定的 Steam 账号
- `steaminfo` 或 `steaminfo <SteamID>`：查询绑定的 Steam 账号状态、个人主页与近期游玩记录
- `steamadd <SteamID>`：将某位好友加入本群的动态视奸监听列表
- `steamremove <SteamID>`：将指定好友移出监听列表
- `steamaddall`：一键把绑定的 Steam 账号的好友列表全员加入本群视奸！
- `steamremoveall`：一键清空本群的所有视奸监听目标
- `steamcheck`：立即查看当前本群正在监听的好友实时状态与游玩游戏
- `steamhelp` 或 `steam帮助`：查看指令速查菜单

## 核心配置片段一览（`run/anime_game_service/config.yaml`）

```yaml
steamsnooping:
  is_snooping: false    # 是否开启 Steam 视奸轮询后台播报（开启请设为 true）
  steam_api_key:        # Steam Web API Key，前往 https://steamcommunity.com/dev/apikey 免费申请
    - "YOUR_STEAM_API_KEY_HERE"

  game_white:           # 游戏播报白名单/免打扰名单（名单内的软件启动时不发群播报）
    - "Wallpaper Engine" # 壁纸引擎常驻不播报
    - "MyDockFinder"
    - "DSX"
    - "Source SDK"
```

## 如果你想修改，应该改哪里？

- **好友启动游戏却没有群播报？**
  - 首先确认 `steamsnooping.is_snooping` 改成了 `true`；其次好友的 Steam 隐私设置必须对公开开放“游戏详情”，如果对方设为完全私密，Steam API 也是拿不到状态的哦。
- **不想让 Wallpaper Engine 这种挂机软件天天刷屏？**
  - 在 `game_white` 列表里加上软件的准确英文名称即可自动静音。
