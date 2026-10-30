# CLI 自动化终端助手（cli_bridge）

哼哼，谁说我只会陪聊看番的？遇到敲代码、修 Bug、查系统状态的硬核需求，我一样能帮你操控股机终端完成！

CLI Bridge 允许具有足够权限的用户，直接在群聊或私聊中调用宿主机本地安装的代码智能体命令行工具（例如 Codex CLI、Claude Code 等）。

在最新重构中，CLI Bridge 引入了 **多轮持久化会话管理（Session Manager）**、**前台即时任务中止**、**Eridanus 插件开发规范注入** 以及 **长文本合并转发降级保护**！

核心代码位于：`run/cli_bridge/`  
配置文件位于：`run/cli_bridge/config.yaml`

---

## 指令交互体系

指令监听群聊与私聊消息，支持多种操作语法：

### 1. 发起任务与连续多轮对话
格式：`/<provider> <需求/代码>`
- 示例：`/codex 帮我写一个定时清理 temp 目录的 Python 脚本`
- 示例：`/codex 把刚才脚本里的删除逻辑改成安全移动到回收站`（**直接延续上一轮会话记忆！**）
- 示例：`/claude 检查当前系统的内存与网络负载`

### 2. 会话管理与状态控制指令

| 指令 | 示例 | 作用说明 |
| :--- | :--- | :--- |
| `reset` / `new` | `/codex reset` 或 `/codex new` | 清空当前群/私聊会话的历史记忆，开启全新会话 |
| `stop` | `/codex stop` | **即时强制中止**当前正在后台运行的任务进程 |
| `status` | `/codex status` | 查询当前用户的持久化 Session ID 及任务运行状态 |
| `help` | `/codex help` | 弹出 CLI 助手的完整使用指引 |

---

## 核心设计特性

### 1. 多轮上下文隔离与会话持久化
- 会话基于 `session_key = f"{user_id}:{group_id}:{provider}"` 实现严格隔离。
- 用户的连续请求会自动绑定对应 CLI 的 Session ID（保存在 `data/cli_bridge_sessions.json`），像在 IDE 里与 AI Agent 协作一样顺畅迭代。

### 2. 自动注入 Eridanus 插件开发铁律
当调用 `/codex` 要求编写机器人功能时，系统会自动在 Prompt 末尾追加 **Eridanus 架构规范提示**：
- 严格遵循 `run/<plugin_name>/__init__.py` 结构；
- 明确 `dynamic_imports`、`function_declarations` 声明；
- 固定参数签名 `async def func(bot, event, config, ...)`；
- 权限判断规范与无语法错误保证。
保证生成的代码直接可用！

### 3. 合并转发与防刷屏降级
终端输出通常长达数千字。系统会自动按 1200 字符切分，并优先采用 QQ 合并转发节点（Forward Node）发送；若环境不支持合并转发，则平滑降级为最多 5 段分段消息，避免在群里大面积刷屏。

---

## 核心配置片段一览（`run/cli_bridge/config.yaml`）

```yaml
enable: true                   # 插件总开关
permission_level: 10           # 最低权限要求（默认为 10 级关注者，保护系统安全）
timeout: 300                   # 进程最大执行超时时间（秒）
max_output_length: 6000        # 单次输出最大截断长度
auto_fallback_on_resume_error: true # 当多轮会话恢复失败时自动降级开辟新会话

commands:                      # 映射的系统底层可执行命令
  codex: "codex exec --yolo"   # 对应的 Codex CLI 启动指令
  claude: "claude -p"          # 对应的 Claude Code 启动指令
```

## 如果你想做什么，应该改哪里？

- **担心普通群友乱敲指令把服务器玩炸？**
  - 把 `permission_level` 调高到 `1000`！这样只有最高权限的 Master 本人才能通过机器人操控终端执行命令，安全感拉满。
- **想要接入其它你喜欢的命令行工具？**
  - 在 `commands` 字典里添加新的命令映射（例如添加一条 `python: "python -c"`），不过底层工具必须提前在操作系统的系统环境变量 PATH 中能够直接执行哦。
- **AI 动态调用支持**：本插件还在 `__init__.py` 注册了 `run_cli_tool` 工具声明，若开启了 MaiReply 的 Function Calling，大模型自身在必要时也可以自主调用该终端工具协助排错。
