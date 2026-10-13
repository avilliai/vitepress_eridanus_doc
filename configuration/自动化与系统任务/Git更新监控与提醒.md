# Git更新监控与提醒

呼喵~ 想要让自己的机器人随时保持在最新版本，又懒得天天去翻 GitHub commit 记录？    
Eridanus 内置了智能的远程仓库监控插件 `git_update_notifier`！它会像专属小秘书一样默默盯着远程仓库，一旦检测到作者发布了新代码，就会贴心地带着详细的更新摘要跑来向 Master 汇报！    

## 1. 核心工作机制

- **定时静默轮询**：后台协程定期（默认每 30 分钟）向远程 Git 仓库（默认 `origin`）发起轻量 Fetch，比对本地当前提交与远程分支的差异。    
- **智能汇总提交日志**：如果落后了好几个 commit，它绝不会只报一句“有更新”，而是抓取所有落后 commit 的提交者、提交信息以及文件改动统计（`git diff --stat`）。    
- **AI 对话核心汇报**：如果启用了 `mai_reply`，系统会将这一整串变动详情交给对话大模型，以拟人化的贴心口吻向管理员总结：“Master！仓库刚刚更新了 N 个功能哦，主要修复了……新增了……”    
- **防骚扰去重设计**：同一个远程 commit 哈希只会在首次发现时汇报一次。如果 Master 暂时不想更新，也不会每隔半小时就被重复弹窗骚扰。    
- **傻瓜式更新引导**：绝不强求对命令行不熟悉的用户去敲复杂的 `git pull`！Bot 在汇报时会贴心提示：    
  - 可以直接在聊天中对她说“帮我更新系统”或“更新代码”；    
  - 也可以直接双击运行项目根目录下的【`更新.bat`】一键搞定！    

## 2. 手动查询指令

如果你刚刚在群里听说发了新版，不想等定时轮询，可以随时主动向 Bot 询问：    

| 指令 | 权限 | 说明 |
| :--- | :--- | :--- |
| `/git check` / `/git status` | Master | 立即主动向远程仓库检查更新状态 |
| `检查更新` / `查看更新` / `/check_update` | Master | 同上，支持中文自然指令 |

### 响应示例

- **当前已是最新**：    
  ```text
  ✅ 当前已是最新版本！
  分支：master
  最新提交：a1b2c3d4
  暂无需要更新的内容。
  ```
- **发现新版本**：    
  ```text
  ✨ 发现远程分支 master 领先 3 个提交！已开始生成详细更新汇报通知 Master（您也可以直接对我下达「更新系统」指令让我自动完成更新）...
  ```

## 3. 插件配置项详解

配置文件位于 `run/git_update_notifier/config.yaml`：    

```yaml
enable: true                      # 是否启用远程仓库监控
check_interval: 1800             # 自动检查周期（秒），默认 1800 秒（半小时）
initial_delay: 20                # Bot 启动后首次检查的延迟等待时间（秒）
remote: "origin"                 # 远程仓库源名称
branch: "auto"                   # 监听分支，"auto" 表示自动检测本地当前所在分支
use_mai_reply: true              # 是否使用 MaiReply 对话核心生成自然语言汇报总结
notify_master: true              # 是否向 Master 私聊发送通知
master_id: null                  # 接收通知的管理员 QQ（填 null 则自动读取 common_config 中的 master.id）
max_commit_log_count: 15         # 单次汇报最多解析的 commit 数量上限
fetch_timeout: 45                # Git fetch 网络超时时间（秒）
notify_up_to_date_on_manual: true # 手动输入检查更新指令且无更新时，是否发送已是最新版本的提示
```
