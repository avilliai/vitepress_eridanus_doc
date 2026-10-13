# 从 SDK 开始 (developTools)

嫌弃 Eridanus 完整本体里那堆繁复的 AI 人设、绘图工具、几十个插件和庞大配置太厚重？没关系！为了让大家能用最干净、最轻量的方式手搓自己的小机器人，我们把最纯粹的通信基座和事件总线单独抽离了出来——这就是 `developTools` SDK！

通过 SDK，你不需要背负任何框架包袱，纯异步、极简依赖、几行代码就能搭建一个响应飞快的 OneBot v11 机器人应用。

---

## 为什么选择轻量 SDK？

1. **极致轻量无死重**：纯异步 `asyncio` + `websockets` + `pydantic` 构建，毫秒级冷启动，哪怕在几百兆内存的超微型 VPS 上也能欢快奔跑；   
2. **完整 OneBot v11 规范支持**：完美对接首选推荐的 **[SnowLuma](https://snowluma.github.io/zh/)**，或者 NapCat、LLOneBot 等正向 WebSocket 协议端；   
3. **强类型事件总线 (EventBus)**：`GroupMessageEvent`、`PrivateMessageEvent`、`PokeNotifyEvent` 等所有事件均为结构化 Pydantic 模型，IDE 自动补全丝滑；   
4. **富有表达力的消息链 (MessageChain)**：告别原始丑陋的 CQ 码拼接，用 `MessageChain([At(...), Text(...), Image(...)])` 像拼积木一样组装图文；   
5. **无缝平滑升级**：SDK 里的事件处理语法与 Eridanus 完整插件体系 100% 兼容，未来随时可以把你写的小脚本直接丢进 `run/` 变成框架插件！   

---  

## 极简 10 秒体验脚本

创建一个名为 `quick_bot.py` 的文件：  

```python
import asyncio
from developTools.adapters.websocket_adapter import WebSocketBot
from developTools.event.events import GroupMessageEvent
from developTools.message.message_chain import MessageChain
from developTools.message.message_components import Text, At

# 1. 连接协议端正向 WebSocket
bot = WebSocketBot(uri="ws://127.0.0.1:3001")

# 2. 注册群消息监听器
@bot.on(GroupMessageEvent)
async def handle_group_msg(event: GroupMessageEvent):
    # 提取纯文本内容
    text = event.pure_text.strip()
    
    if text == "ping":
        # 组装一条艾特回复消息链
        reply = MessageChain([
            At(qq=event.sender.user_id),
            Text(" pong! 我是轻量 SDK 驱动的猫娘小助手喵~ ✨")
        ])
        await bot.send(event, reply)

# 3. 阻塞运行
if __name__ == "__main__":
    bot.run()
```

只需在终端运行 `python quick_bot.py`，向你的机器人所在的群里发一句 `ping`，它就会立刻艾特你并欢快地回上一句 `pong!` 啦！
