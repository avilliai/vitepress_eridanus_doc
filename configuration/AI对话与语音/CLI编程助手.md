# CLI 自动化终端助手（cli_bridge）

哼哼，谁说我只会陪聊看番的？遇到敲代码、修 Bug、查系统状态的硬核需求，我一样能帮你操控终端完成！

CLI Bridge 允许具有足够权限的用户，直接在群聊或私聊中调用宿主机本地安装的代码智能体命令行工具（比如 Codex CLI、Claude Code 等）。

核心代码位于：`run/cli_bridge/main.py`  
配置文件位于：`run/cli_bridge/config.yaml`

## 源码里真正支持的交互指令

指令监听群聊与私聊消息，要求指令后必须**带有空格**并附带提示词（Prompt）：

- `/codex <提示词>`
  - 示例：`/codex 帮我用 Python 写一个提取文本中所有网址的函数`
  - 示例：`/codex 检查当前目录下的 package.json 文件依赖是否正常`
- `/claude <提示词>`
  - 示例：`/claude 分析一下系统 CPU 占用偏高的可能原因`

机器人接收到后会在后台异步唤起本地对应的 CLI 子进程，执行完毕后把终端输出结果截取整理并反馈到聊天窗口中。

## 核心配置片段一览（`run/cli_bridge/config.yaml`）

```yaml
enable: true                   # 插件总开关
permission_level: 10           # 最低权限要求（默认为 10 级关注者，保护系统安全）
timeout: 3000                  # 进程最大执行超时时间（秒）

commands:                      # 映射的系统底层可执行命令
  codex: "codex exec --yolo"   # 对应的 Codex CLI 启动指令
  claude: "claude -p"          # 对应的 Claude Code 启动指令
```

## 如果你想做什么，应该改哪里？

- **担心普通群友乱敲指令把服务器玩炸？**
  - 把 `permission_level` 调高到 `1000`！这样只有最高权限的 Master 本人才能通过机器人操控宿主机终端执行命令，安全感拉满。
- **想要接入其它你喜欢的命令行工具？**
  - 在 `commands` 字典里添加新的命令映射（例如添加一条 `python: "python -c"`），不过底层工具必须提前在操作系统的系统环境变量 PATH 中能够直接执行哦。
- **AI 动态调用支持**：本插件还在 `__init__.py` 注册了 `run_cli_tool` 工具声明，若开启了 MaiReply 的 Function Calling，大模型自身在必要时也可以自主调用该终端工具协助排错。
