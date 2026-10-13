# 编写你的第一个框架插件

终于到了最令人激动的实战环节啦！现在就跟紧我的脚步，在 Eridanus 真实框架下从零打造一个带配置、带权限检测、带图文回显的完整插件吧！

## 插件标准目录规范

在 `run/` 目录下新建属于你自己的插件文件夹，例如 `run/my_lucky_draw/`：

```text
run/my_lucky_draw/
├── __init__.py       # 包初始化文件（可在此导出 Function Calling 工具）
├── main.py           # 插件逻辑入口（必须包含 main(bot, config) 函数）
└── config.yaml       # 插件专属配置文件（支持动态热重载）
```

---

## 第一步：编写专属配置 `config.yaml`

在 `run/my_lucky_draw/config.yaml` 中写入：

```yaml
enable: true
min_user_level: 0           # 最低参与权限等级
reward_gold_range: [10, 50] # 每次抽取的金币奖励范围
cooldown_seconds: 60        # 冷却时间（秒）
```

---

## 第二步：编写业务逻辑 `main.py`

在 `run/my_lucky_draw/main.py` 中实现完整的事件监听与业务逻辑：

```python
# -*- coding: utf-8 -*-
import random
import time
from developTools.event.events import GroupMessageEvent
from developTools.message.message_chain import MessageChain
from developTools.message.message_components import Text, At, Image
from framework_common.database_util.User import User # 框架内置用户模型

# 内存记录冷却时间：{user_id: last_timestamp}
user_cooldowns = {}

def main(bot, config):
    @bot.on(GroupMessageEvent)
    async def handle_lucky_draw(event: GroupMessageEvent):
        # 1. 严格匹配触发命令
        if event.pure_text.strip() != "幸运抽奖":
            return
            
        # 2. 动态读取配置
        plugin_cfg = config.my_lucky_draw.config
        if not plugin_cfg.get("enable", True):
            return

        user_id = event.sender.user_id
        current_time = time.time()
        
        # 3. 冷却时间判定
        cd = plugin_cfg.get("cooldown_seconds", 60)
        last_time = user_cooldowns.get(user_id, 0)
        if current_time - last_time < cd:
            remain = int(cd - (current_time - last_time))
            await bot.send(event, MessageChain([
                At(qq=user_id),
                Text(f" 慢点抽嘛~ 还要等 {remain} 秒才可以再试哦！")
            ]))
            return

        # 4. 检查用户等级
        user_info = User.get_user(user_id)
        min_level = plugin_cfg.get("min_user_level", 0)
        if user_info and user_info.get("level", 0) < min_level:
            await bot.send(event, f"权限等级不足喵！需要达到 {min_level} 级~")
            return

        # 5. 执行抽奖与金币发放
        gold_range = plugin_cfg.get("reward_gold_range", [10, 50])
        gold = random.randint(gold_range[0], gold_range[1])
        if user_info:
            User.add_gold(user_id, gold) # 直接调用框架内置接口加金币

        user_cooldowns[user_id] = current_time

        # 6. 发送复合消息链
        reply_chain = MessageChain([
            At(qq=user_id),
            Text(f"
🎉 欧气爆发！恭喜你抽中了 {gold} 枚金币！
快去个人信息里查看你的最新小金库吧~")
        ])
        await bot.send(event, reply_chain)
        bot.logger.info(f"用户 {user_id} 完成了一次幸运抽奖，获得 {gold} 金币")
```

---

## 第三步：运行与验证

1. 启动 `main.py`；
2. 控制台输出：`[PluginManager] 已加载插件: run.my_lucky_draw.main`；
3. 在群里发送 `幸运抽奖`，机器人立即艾特你并结算金币奖励；
4. 尝试在不重启机器人的情况下打开 `config.yaml`，将 `reward_gold_range` 改为 `[100, 200]` 并保存，再次抽奖立即获得新数值！

这就是一个完整、规范的 Eridanus 插件开发闭环！
