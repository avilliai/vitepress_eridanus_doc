# Git 更新监控与提醒

只要 GitHub 或者代码仓库有了新提交，我就会第一时间小跑着过来拍拍你，告诉你作者又修了什么 Bug、加了什么好玩的黑科技哦~

本模块是 Eridanus 内置的仓库版本巡检守护进程。它在后台默默周期性执行 `git fetch`，对比本地与远程分支，一旦发现新 Commit，就会解析提交日志，甚至可以召唤 MaiReply 核心向 Master 进行私聊汇报。

## 源码入口与核心配置

- **代码入口**：`run/git_update_notifier/main.py`
- **配置文件路径**：`run/git_update_notifier/config.yaml`
- **通知目标**：优先使用本配置的 `master_id`，未填写时自动回落至 `run/common_config/basic_config.yaml` 的 `master.id`

配置片段如下：

```yaml
enable: false        # 是否开启后台自动巡检更新
check_interval: 1800 # 定时检查间隔（秒），默认 1800 秒（30分钟）
initial_delay: 20    # 启动后首次检查延迟（秒），等待 Bot 客户端连接就绪
remote: "origin"     # 远程仓库名称，默认 origin
branch: "auto"       # 监控分支，"auto" 表示自动跟随当前本地分支（如 master/main）
use_mai_reply: true  # 是否调用 MaiReply 对话核心进行角色化汇报（若不可用则优雅降级为结构化日志）
notify_master: true  # 是否向 Master 发送私聊更新提醒
master_id: ""        # Master 的 QQ 号，为空时自动读取 basic_config.yaml
max_commit_log_count: 10 # 提取给 LLM 解析的最大 Commit 数量
fetch_timeout: 45    # git fetch 的网络超时时间（秒）
notify_up_to_date_on_manual: true # 手动指令触发检查时，若已是最新是否回复告知
```

## 源码里真正支持的触发指令

除了后台自动化定时轮询外，Master 和群友也可以在群聊或私聊中主动发送指令触发即时检查：

| 指令格式 / 别名 | 作用说明 |
| :--- | :--- |
| `/git check` | 主动拉取远程最新日志并执行检查 |
| `/git status` | 查看当前 Git 仓库同步状态 |
| `检查更新` / `查看更新` | 常用中文自然语言别名 |
| `/check_update` | 快捷指令入口 |

源码中匹配的判定条件：
```python
command_list = ["/git check", "/git status", "检查更新", "查看更新", "/check_update"]
if text not in command_list:
    return
```

> **小贴士**：源码里**没有**自动执行 `git pull` 的危险命令哦！因为自动拉取可能会产生代码冲突或者破坏本地修改，所以我的职责是“贴心提醒主人”，真正的合并与部署还是要主人亲手敲下命令呢~

## 如果你想做什么，应该改哪里？

1. **刚部署好却从来不发更新提醒**：
   - 打开 `run/git_update_notifier/config.yaml`；
   - 确认最顶部的 `enable` 已改成 `true`。
2. **每次检查间隔太长，想更快知道仓库更新**：
   - 将 `check_interval` 调小（例如改成 `600`，即 10 分钟检查一次）。
3. **想让汇报使用bot ai回复核心**：
   - 保持 `use_mai_reply: true`，此时新提交的日志会交给 AI 对话核心处理，生成轻快俏皮的总结汇报。
4. **服务器网络连接 GitHub 经常超时**：
   - 适当增大 `fetch_timeout`（如设为 `60` 或 `90`），并检查服务器终端的 Git 代理配置。
# 更新方式
直接在群里@bot 更新一下你自己的代码。     
告诉它你要更新就好啦。Eridanus已经写好了有关的tool，在自动更新后会自动重启，确保应用更新。
