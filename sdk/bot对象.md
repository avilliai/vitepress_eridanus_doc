# Bot 对象核心 API

在 developTools 中，`WebSocketBot` 是所有网络通信与行为调度的灵魂核心。    
它继承自底层的 WebSocket 协议层，并内置了强大的异步事件总线（EventBus）。    

---

## 1. 实例化与启动参数

```python
from developTools.adapters.websocket_adapter import WebSocketBot

bot = WebSocketBot(
    uri="ws://127.0.0.1:3001",       # 正向 WebSocket 连接地址
    access_token="",                  # 鉴权 Token（如未配置留空即可）
    all_str_id=False,                  # 是否强制将消息 ID/群号转为字符串处理
    handler_timeout_warning=10.0,      # 事件处理器执行超时警告阈值（秒）
    enable_monitoring=True             # 是否开启事件执行耗时监控
)
```

启动机器人：    
```python
bot.run()  # 阻塞运行，启动事件循环并保持自动断线重连
```

---

## 2. 常用发送消息 API

| 方法名称 | 参数说明 | 功能描述 |
| :--- | :--- | :--- |
| `await bot.send(event, message)` | `event: EventBase, message: str \| MessageChain \| list` | 自动根据事件类型（群聊/私聊）回复对应目标 |
| `await bot.send_group_message(group_id, message)` | `group_id: int, message: ...` | 向指定群聊发送消息链或文本 |
| `await bot.send_friend_message(user_id, message)` | `user_id: int, message: ...` | 向指定好友/私聊发送消息 |
| `await bot.send_group_forward_msg(group_id, messages)` | `group_id: int, messages: list[Node]` | 发送合并转发聊天记录到群聊 |
| `await bot.send_private_forward_msg(user_id, messages)` | `user_id: int, messages: list[Node]` | 发送合并转发聊天记录到私聊 |
| `await bot.recall(message_id)` | `message_id: int \| str` | 撤回指定消息 |

---

## 3. 群管与系统动作 API

| 方法名称 | 参数说明 | 功能描述 |
| :--- | :--- | :--- |
| `await bot.mute(group_id, user_id, duration)` | `duration: int` (秒，0 为解除) | 禁言群成员 |
| `await bot.set_group_whole_ban(group_id, enable)` | `enable: bool` | 开启/关闭全员禁言 |
| `await bot.set_group_kick(group_id, user_id, reject_add)` | `reject_add: bool` | 移出群成员 |
| `await bot.set_group_card(group_id, user_id, card)` | `card: str` | 修改群名片 |
| `await bot.set_group_admin(group_id, user_id, enable)` | `enable: bool` | 设置/取消群管理员 |
| `await bot.send_like(user_id, times)` | `times: int` (默认 10) | 发送名片点赞 |
| `await bot.group_poke(group_id, user_id)` | `group_id: int, user_id: int` | 发送群内戳一戳 |

---

## 4. 信息获取类 API

| 方法名称 | 返回值 | 功能描述 |
| :--- | :--- | :--- |
| `await bot.get_friend_list()` | `list[dict]` | 获取好友列表 |
| `await bot.get_group_list()` | `list[dict]` | 获取机器人加入的群列表 |
| `await bot.get_group_member_list(group_id)` | `list[dict]` | 获取群成员详细列表 |
| `await bot.get_group_member_info(group_id, user_id)` | `dict` | 获取指定群成员详细名片信息 |
| `await bot.get_msg(message_id)` | `dict` | 查询历史消息详情 |




