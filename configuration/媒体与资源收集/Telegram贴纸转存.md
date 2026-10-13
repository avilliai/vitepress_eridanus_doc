# Telegram 贴纸转存

Telegram 上的群友表情包是不是比 QQ 好玩多了？看到好看的贴纸包不用眼馋，丢个链接给我，我把整包表情都给你打包扒下来！

该功能支持解析 Telegram Sticker 贴纸包链接，自动遍历其中所有表情并打包转换为群友可直接使用的格式。

## 源码入口与核心配置

- **代码入口**：`run/resource_collector/tg_sticker.py`
- **配置文件路径**：`run/resource_collector/config.yaml`
- **底层工具**：`run/resource_collector/__init__.py` 声明的 `telegram_stickers_download`

配置片段如下：

```yaml
telegram_stickers:
  bot_token: ""   # Telegram Bot Token（前往 @BotFather 申请后填入）
```

> **重要依赖**：由于下载 Telegram 资源必须走 Telegram 官方 API，因此除了配置上面的 `bot_token` 外，`run/common_config/basic_config.yaml` 中的 `proxy` 也必须配置好可用的代理端口！

## 源码里真正支持的触发指令

源码在 `tg_sticker.py` 中通过正则提取消息：

| 指令格式 | 示例 | 作用说明 |
| :--- | :--- | :--- |
| `下载tg贴纸 <链接>` | `下载tg贴纸 https://t.me/addstickers/LineCat_by_bot` | 提取贴纸包名称，拉取全部贴纸并打包发送至群内 |

源码正则解析逻辑：
```python
match = re.search(r"addstickers/([^/]+)", text)
```
只要你的消息以 `下载tg贴纸` 开头，且包含带有 `addstickers/<pack_name>` 结构的链接即可被成功捕获！

## 如果你想做什么，应该改哪里？

1. **发送指令后机器人提示“请先配置 Bot Token”**：
   - 打开 `run/resource_collector/config.yaml`；
   - 在 `telegram_stickers.bot_token` 中填入你的 Telegram 机器人 Token（例如 `123456789:ABCdefGhIJKlmnoPQRsTUVw`）。
2. **下载一直卡住或报错 ConnectError**：
   - 检查 `run/common_config/basic_config.yaml` 中的 `proxy` 配置，确保代理能稳定访问 `api.telegram.org`。
