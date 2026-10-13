# 编写你的第一个 Eridanus 插件

想在 Eridanus 框架里添加自己的专属功能？超级简单！    
你只需要在 `run/` 目录下新建一个文件夹，并按照约定提供入口函数即可。    

---

## 1. 插件目录规范

推荐的插件目录结构如下：    

```text
run/
└── my_cat_helper/
    ├── __init__.py          # 插件包声明 (可选，声明 entrance_func)
    ├── main.py              # 插件核心逻辑与事件监听
    └── config.yaml          # 插件独立配置文件
```

在 `config.yaml` 中写入你的初始配置：    
```yaml
enable: true
greeting: "喵呜~ 欢迎来到 Eridanus！"
target_groups:
  - 123456789
```

---

## 2. 编写 main.py

Eridanus 的插件加载器会自动检测并调用 `main(bot: ExtendBot, config: YAMLManager)`：    

```python
from developTools.event.events import GroupMessageEvent
from framework_common.framework_util.websocket_fix import ExtendBot
from framework_common.framework_util.yamlLoader import YAMLManager
from framework_common.utils.system_logger import get_logger

logger = get_logger("MyCatHelper")

def main(bot: ExtendBot, config: YAMLManager):
    logger.info("MyCatHelper 插件正在初始化...")

    @bot.on(GroupMessageEvent)
    async def handle_cat(event: GroupMessageEvent):
        # 从实时热重载配置中读取参数
        # 路径规则: config.<插件文件夹名>.<配置文件名>.<键>
        plugin_cfg = config.my_cat_helper.config
        if not plugin_cfg.get("enable", True):
            return

        text = event.raw_message.strip()
        if text == "/吸猫":
            greeting = plugin_cfg.get("greeting", "喵喵喵~ (蹭蹭你的手)")
            await bot.send(event, greeting)
```

---

## 3. 热重载与生效

当你保存 `my_cat_helper/main.py` 或修改 `config.yaml` 时：    
- 框架的 `PluginManager` 会自动感知文件变动并重新导入。    
- 控制台会打印 `插件 my_cat_helper 重载成功`，新代码瞬间生效！    
