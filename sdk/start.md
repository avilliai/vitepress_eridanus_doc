# 从 SDK 开始 (developTools)

嫌弃 Eridanus 本体那堆复杂的插件调度太繁琐？    
没关系！本猫把核心连接和事件驱动层单独抽离了出来，就是位于 `developTools` 的独立 SDK 层。    

通过 SDK，你可以用最干净、最轻量的方式从零手搓自己的机器人应用，完全不需要关心复杂的业务逻辑。    
无论你是想写个极简的群管小工具，还是做自己的专属 AI 智能体，直接从这里起步就对啦！    

---

## 为什么选择轻量 SDK？

1. **零多余负担**：纯异步 `asyncio` + `websockets` 构建，没有冗余插件拖慢启动。    
2. **完整 OneBot v11 支持**：配合首选的 **[SnowLuma](https://snowluma.github.io/zh/)** 或者 NapCat / LLOneBot 等正向 WebSocket 协议端，秒级连通。    
3. **清晰的事件驱动与消息链**：强类型的事件体系（`GroupMessageEvent`, `PrivateMessageEvent` 等）和结构化消息链（`MessageChain`, `Text`, `Image`, `At` 等），拼装消息像搭积木一样简单。    
4. **灵活可插拔**：随时可以无缝升级为 Eridanus 完整插件体系，语法完全通用。    

---

## 极简体验代码

一个最简单的 Echo 机器人在 SDK 里只需要几行代码：    

```python
import asyncio
from developTools.adapters.websocket_adapter import WebSocketBot
from developTools.event.events import GroupMessageEvent, PrivateMessageEvent

# 连接到本地 SnowLuma / OneBot v11 正向 WebSocket
bot = WebSocketBot("ws://127.0.0.1:3001")

@bot.on(GroupMessageEvent)
async def on_group_msg(event: GroupMessageEvent):
    # 收到群消息后，检测关键词并回复
    if event.raw_message.startswith("喵"):
        await bot.send(event, f"抓到一只学猫叫的：{event.raw_message}")

@bot.on(PrivateMessageEvent)
async def on_private_msg(event: PrivateMessageEvent):
    # 私聊自动回复
    await bot.send(event, "私聊收到啦，本猫正在摸鱼呢~")

if __name__ == "__main__":
    bot.run()
```

是不是超级清爽？接下来跟本猫去看看怎么写你的第一个正式功能吧！    
