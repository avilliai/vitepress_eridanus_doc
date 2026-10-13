# Epic 喜加一周免监控

白嫖才是宇宙第一快乐的真谛！哪怕领了之后放在库里吃灰，我也一定要把它完完整整装进主人的仓库里~

本功能周期性监控 Epic Games 官方商城的限免特惠活动，实时获取本周正在免费领取的游戏以及下周即将赠送的神秘游戏预告，并支持接入定时推送体系，到点在群里提醒群友领游戏！

## 源码入口与核心配置

- **代码入口**：`run/anime_game_service/epicfree.py`
- **后台服务**：`run/anime_game_service/service/epicfree/`
- **定时广播配置**：`run/scheduled_tasks/config.yaml`

Epic 监控本身无需繁琐的额外凭证即可调用商城公开 API，若想在每周固定时间自动往群里广播提醒，可在定时任务配置中定制：

```yaml
scheduledTasks:
  epic喜加一:       # Epic 周免游戏定时提醒
    enable: true
    time: 16/40    # 每天或每周检查推送时间（时/分）
    text: "杂鱼❤来白嫖游戏了" # 推送附带的提醒前缀文本
```

## 源码里支持的触发指令

指令直接在 `epicfree.py` 中匹配处理：

| 触发指令 / 别名 | 示例 | 作用说明 |
| :--- | :--- | :--- |
| `epic喜加一` / `epicfree` | `epic喜加一` | 即时抓取并发送当前正在免费领取的游戏名称、原价、截止时间、直达链接与下周神秘预告 |
| `epic帮助` / `epichelp` | `epic帮助` | 弹出 Epic 相关的指令帮助说明卡片 |

## 如果你想做什么，应该改哪里？

1. **想让 Bot 每天/每周定时在群里提醒大家领游戏**：
   - 打开 `run/scheduled_tasks/config.yaml`，确认 `scheduledTasks.epic喜加一.enable: true`；
   - 在你希望接收推送的群聊中发送：`/cron add epic喜加一`。
2. **想修改推送时的调侃台词**：
   - 修改 `scheduledTasks.epic喜加一.text`，换成主人喜欢的口吻（比如“快来白嫖 Epic 豪华大作啦~”）。
3. **网络受限无法访问 Epic 接口**：
   - 检查 `run/common_config/basic_config.yaml` 中的全局 `proxy` 配置，确保境外节点能够连通 Epic Games 官方服务。
