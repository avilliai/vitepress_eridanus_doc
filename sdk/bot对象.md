---
prev:
  text: 'SDK 快速起步'
  link: '/sdk/start'
next:
  text: '事件系统与模型'
  link: '/sdk/事件'
---

# Bot 核心对象与 API 源码手册
 
在 `developTools` 中，`WebSocketBot` 是整个机器人的动力引擎与通讯中枢！所有消息下发、群禁言、戳一戳、发语音和文件上传，全都是通过它提供的方法实现的。

与其看抽象的参数说明，不如直接来看源码！今天 Yucca 把 `WebSocketBot` 最核心的方法实现直接切片贴给你，让你清楚每个 API 在底层发了什么请求、支持什么参数、以及怎么优雅调用！

---

## 一、Bot 类的实例化与构造函数源码

```python
# 位于 developTools/adapters/websocket_adapter.py

class WebSocketBot:
    def __init__(
        self,
        uri: str,                             # WebSocket 连接地址，例如 "ws://127.0.0.1:3001"
        access_token: str = None,             # 鉴权 Token（若协议端设置了 access_token 则传入，否则为 None）
        all_str_id: bool = False,             # 是否将所有 QQ 号和群号强制转为字符串处理
        handler_timeout_warning: float = 10.0,# 事件处理器执行超时警告阈值（秒）
        enable_monitoring: bool = True        # 是否启用 Handler 耗时监控与防阻塞检测
    ):
        self.uri = uri
        self.access_token = access_token
        self.all_str_id = all_str_id
        self.event_bus = EventBus(handler_timeout_warning, enable_monitoring)
        self.on = self.event_bus.on           # 快捷事件订阅装饰器
        self.logger = get_logger()
```

### 快速初始化与启动标准范式：
```python
from developTools.adapters.websocket_adapter import WebSocketBot

# 创建机器人实例
bot = WebSocketBot("ws://127.0.0.1:3001")

# 启动并保持常驻监听
bot.run()
```

---

## 二、消息发送 API 源码与实战

### 1. 智能自适应发送：`send()`

这是你写插件最常用的消息发送方法！它会自动判断事件是来自于群聊还是私聊，不需要你手动写 `if-else` 分流；并且支持一键引用原消息回复！

#### 底层源码实现：
```python
async def send(
    self, 
    event: EventBase, 
    components: list[Union[MessageComponent, str]], 
    Quote: bool = False
):
    """
    智能根据传入的事件类型，将消息分发到群聊或私聊
    :param event: 触发当前消息的 Event 对象（GroupMessageEvent 或 PrivateMessageEvent）
    :param components: 发送内容列表（可以是纯字符串，也可以是 Text, Image, At, Record 等组件列表）
    :param Quote: 是否引用被回复的消息（True 时会自动在消息头部拼装 Reply 组件）
    """
    if isinstance(components, str):
        components = [Text(components)]
    if Quote:
        components.insert(0, Reply(event.message_id))
        
    if event.message_type == "group":
        await self.send_group_message(event.group_id, components)
    elif event.message_type == "private":
        await self.send_friend_message(event.user_id, components)
```

#### 调用实战：
```python
# 1. 简写直接发送纯文本
await bot.send(event, "收到啦主人~")

# 2. 混合发送艾特与多张图片
from developTools.message.message_components import At, Text, Image
await bot.send(event, [At(event.user_id), Text(" 给你看张美图："), Image(file="output.jpg")])

# 3. 引用原消息回复 (Quote=True)
await bot.send(event, "你刚才说的那句话我记在小本本上啦！", Quote=True)
```

---

### 2. 精确发送群消息与好友私聊源码

如果你是在定时任务或者后台轮询中想要主动推送消息（此时手里没有 `event`），直接使用以下两个底层方法：

```python
async def send_group_message(self, group_id: int, components: list[Union[MessageComponent, str]]):
    """主动向指定群发送消息"""
    if isinstance(components, str):
        components = [Text(components)]
    data = {"group_id": group_id, "message": self.to_json(components)}
    return await self._call_api("send_group_msg", data)

async def send_friend_message(self, user_id: int, components: list[Union[MessageComponent, str]]):
    """主动向指定好友发送私聊消息"""
    if isinstance(components, str):
        components = [Text(components)]
    data = {"user_id": user_id, "message": self.to_json(components)}
    return await self._call_api("send_private_msg", data)
```

#### 调用实战：
```python
# 在早安早报定时任务里主动推送到测试群：
await bot.send_group_message(879886836, [Text("☀️ 早上好！今日早报已送达~")])

# 私聊通知管理员：
await bot.send_friend_message(1840094972, [Text("⚠️ 检测到服务器 CPU 占用过高！")])
```

---

### 3. 合并转发消息源码：`send_group_forward_msg()`

想把多条长文本或日志折叠成聊天记录样式的合并转发卡片？

```python
async def send_group_forward_msg(self, group_id: int, components: Union[str, list[Union[MessageComponent, str]]]):
    """发送群合并转发节点消息"""
    data = {"group_id": group_id, "messages": self.to_json(components)}
    return await self._call_api("send_group_forward_msg", data)
```

#### 调用实战（配合 Node 节点组件）：
```python
from developTools.message.message_components import Node, Text

nodes = [
    Node(user_id=bot.id, nickname="Yucca", content=[Text("这是第一条合并消息内容~")]),
    Node(user_id=bot.id, nickname="Yucca", content=[Text("这是第二条合并消息内容哦！")])
]
await bot.send_group_forward_msg(event.group_id, nodes)
```

---

## 三、消息撤回与社交互动 API 源码

```python
async def recall(self, message_id: int):
    """撤回指定消息 ID"""
    data = {"message_id": message_id}
    return await self._call_api("delete_msg", data)

async def send_like(self, user_id: int):
    """给指定用户 QQ 名片点赞（默认一次点 10 赞）"""
    data = {"user_id": user_id, "times": 10}
    return await self._call_api("send_like", data)

async def group_poke(self, group_id: int, user_id: int):
    """在群内发送戳一戳"""
    data = {"group_id": group_id, "user_id": user_id}
    return await self._call_api("group_poke", data)

async def friend_poke(self, user_id: int):
    """私聊中给好友发送戳一戳"""
    data = {"user_id": user_id}
    return await self._call_api("friend_poke", data)
```

#### 调用实战（发送临时消息并在 10 秒后自动撤回）：
```python
import asyncio

# 发送提示
sent_res = await bot.send(event, "这条消息会在 10 秒后自动销毁哦~")
msg_id = sent_res["data"]["message_id"]

await asyncio.sleep(10)
# 调用 recall 撤回
await bot.recall(msg_id)
```

---

## 四、群管理与群成员控制 API 源码

编写群管小帮手时，这些函数可全都是你的得力法宝哦！

### 1. 禁言与全员禁言源码：
```python
async def mute(self, group_id: int, user_id: int, duration: int):
    """
    群禁言指定成员
    :param duration: 禁言秒数，设置为 0 时表示解除禁言
    """
    data = {"group_id": group_id, "user_id": user_id, "duration": duration}
    return await self._call_api("set_group_ban", data)

async def set_group_whole_ban(self, group_id: int, enable: bool):
    """开启或关闭全员禁言"""
    data = {"group_id": group_id, "enable": enable}
    return await self._call_api("set_group_whole_ban", data)
```

### 2. 踢出成员、改群名片与专属头衔源码：
```python
async def set_group_kick(self, group_id: int, user_id: int, reject_add_request: bool = True):
    """
    移出群成员
    :param reject_add_request: 是否拉黑该用户，拒绝其后续再次申请加群
    """
    data = {"group_id": group_id, "user_id": user_id, "reject_add_request": reject_add_request}
    return await self._call_api("set_group_kick", data)

async def set_group_card(self, group_id: int, user_id: int, card: str):
    """修改群成员群名片（留空则还原为原昵称）"""
    data = {"group_id": group_id, "user_id": user_id, "card": card}
    return await self._call_api("set_group_card", data)

async def set_group_admin(self, group_id: int, user_id: int, enable: bool):
    """设置或取消群管理员"""
    data = {"group_id": group_id, "user_id": user_id, "enable": enable}
    return await self._call_api("set_group_admin", data)

async def set_group_special_title(self, group_id: int, user_id: int, special_title: str):
    """设置群员专属头衔（仅群主拥有此权限）"""
    data = {"group_id": group_id, "user_id": user_id, "special_title": special_title, "duration": -1}
    return await self._call_api("set_group_special_title", data)
```

#### 调用实战（违禁词禁言套餐）：
```python
# 禁言违规成员 10 分钟 (600秒)
await bot.mute(event.group_id, event.user_id, duration=600)
await bot.send(event, f"检测到违规发言，已请 [CQ:at,qq={event.user_id}] 喝茶 10 分钟！")
```

---

## 五、请求审批与群文件/精华消息 API 源码

```python
async def handle_friend_request(self, flag: str, approve: bool, remark: str = ""):
    """
    审批加好友请求
    :param flag: FriendRequestEvent 中的 flag 标识
    :param approve: True 为同意，False 为拒绝
    :param remark: 同意后的好友备注
    """
    data = {"flag": flag, "approve": approve, "remark": remark}
    return await self._call_api("set_friend_add_request", data)

async def set_group_add_request(self, flag: str, approve: bool, reason: str = ""):
    """
    审批加群/邀请进群请求
    :param flag: GroupRequestEvent 中的 flag 标识
    :param approve: True 为同意，False 为拒绝
    :param reason: 拒绝理由（若 approve=False 则有效）
    """
    data = {"flag": flag, "approve": approve, "reason": reason}
    return await self._call_api("set_group_add_request", data)

async def upload_group_file(self, group_id: int, file: str, name: str = None):
    """
    上传本地文件到群文件
    :param file: 本地文件绝对路径
    :param name: 上传后显示的文件名（若留空则自动提取原文件名）
    """
    if name is None:
        name = os.path.basename(file)
    data = {"group_id": group_id, "file": file, "name": name}
    return await self._call_api("upload_group_file", data)

async def set_essence_msg(self, message_id: int | str):
    """将指定消息设为群精华消息"""
    data = {"message_id": int(message_id)}
    return await self._call_api("set_essence_msg", data)
```

---

## 六、信息查询 API 源码

想要在发消息前先查查对方是不是群管理、或者群里一共有多少人？看这里：

```python
async def get_group_member_info(self, group_id: int, user_id: int):
    """获取单个群成员详细信息（返回字典包含 role, join_time, last_sent_time 等）"""
    data = {"group_id": group_id, "user_id": user_id, "no_cache": True}
    return await self._call_api("get_group_member_info", data)

async def get_group_member_list(self, group_id: int):
    """获取群成员完整列表"""
    data = {"group_id": group_id, "no_cache": True}
    return await self._call_api("get_group_member_list", data)

async def get_stranger_info(self, user_id: int):
    """获取陌生人/好友的基本个人信息"""
    data = {"user_id": user_id, "no_cache": True}
    return await self._call_api("get_stranger_info", data)

async def get_msg(self, message_id: int):
    """根据 message_id 反查消息详细内容"""
    data = {"message_id": message_id}
    return await self._call_api("get_msg", data)
```

#### 调用实战（检查是否拥有管理员权限）：
```python
member_info = await bot.get_group_member_info(event.group_id, event.user_id)
role = member_info.get("data", {}).get("role")  # "owner" / "admin" / "member"

if role in ["owner", "admin"]:
    await bot.send(event, "管理员大人好！有什么吩咐吗？")
else:
    await bot.send(event, "普通群员不可以执行这个危险操作哦~")
```
