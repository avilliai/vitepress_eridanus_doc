# 编写第一个插件

插件目录位于 `run/` 下，并以 Python 包形式提供入口。推荐结构：

```text
run/my_plugin/
├── __init__.py
├── main.py
└── config.yaml
```

事件插件在入口函数中注册监听器：

```python
from developTools.event.events import GroupMessageEvent

def main(bot, config):
    @bot.on(GroupMessageEvent)
    async def on_message(event):
        if event.pure_text.strip() == "你好":
            await bot.send(event, "你好！")
```

不要假设存在 `ExtendBot` 或 `YAMLManager` 类型注解；以当前仓库中已有插件的入口签名为准。配置文件中的字段也必须在代码里读取才会生效。需要让 AI 调用的能力，按[Function calling](./function-calling)页面在 `__init__.py` 导出工具声明，而不是仅添加聊天指令。
