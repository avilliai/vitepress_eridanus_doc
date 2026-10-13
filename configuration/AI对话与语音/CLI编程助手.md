# CLI 命令行编程助手（cli_bridge）

如果你是一个程序员或者系统管理员，平常离不开终端敲代码，那 Eridanus 的 **cli_bridge**（位于 `run/cli_bridge`）就是你在 QQ 里的远程编程军刀！    

---

## 核心功能

- **大模型终端桥接**：将本地安装的 AI CLI 工具（例如 Codex CLI、Claude Code 等）直接暴露给 QQ 消息。    
- **严格权限防护**：由于命令行涉及执行权限，该功能默认受到严格等级审查（默认需管理员等级 $\ge 10$）。    
- **超时保护**：防止执行陷入死循环卡死整个事件循环。    

---

## 配置文件详解

配置文件位于 `run/cli_bridge/config.yaml`：    

```yaml
enable: true
permission_level: 10   # 必须是管理员或指定权限等级才能使用
timeout: 3000          # 命令执行超时时间（秒）

commands:
  codex: "codex exec --yolo"
  claude: "claude -p"
```

---

## 触发与使用指令

在群聊中（需高权限），使用配置好的前缀即可执行代码分析或任务分发：    
- `codex <你的提示词或问题>`    
- `claude <你的提示词或问题>`    
