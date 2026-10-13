---
prev:
  text: '生命周期与事件流'
  link: '/framework/生命周期与事件'
next:
  text: '编写你的第一个插件'
  link: '/framework/first_plugin'
---

# Function Calling：从动态导入到 AI 调度执行

可千万别被外面那些通用的 OpenAI 教程带偏啦！在咱们 Eridanus 的世界里，MaiReply 拟人人格能够随心所欲地替你点歌、抽卡、查动态甚至下载视频，全靠一套非常规整、优雅且高效的 **Function Calling（工具调用）体系** 哦！

今天我就结合核心加载器 `func_map_loader.py` 与 `mai_reply` 的真实机制，带你彻底搞明白：**工具是怎么声明的**、**函数入参的铁律是什么**，以及 **如何控制是否触发 AI 二次回复**！

---

## 一、架构全景：函数是怎么被发现并调用的？

先花半分钟看懂 Eridanus 的工具调度链路：

```text
[群友发消息] -> "Yucca，帮我下载一下这个 B 站视频呗：https://b23.tv/xxx"
      ↓
[MaiReply 思考]
  - 携带所有已注册插件导出的 function_declarations 向 LLM 发起意图分析
      ↓
[LLM 返回 Tool Call 请求]
  - 工具名: "download_video"
  - 抽取出的模型参数: {"url": "https://b23.tv/xxx", "platform": "bilibili", "type": "video"}
      ↓
[框架核心路由执行]
  - 根据 dynamic_imports 找到 "run.streaming_media.youtube" 中的 download_video
  - 自动注入上下文对象：download_video(bot, event, config, url=..., platform=..., type=...)
      ↓
[工具执行完毕]
  - 若返回 None：流程结束，不再调用大模型（适合已自行完成发图/清记录的静默工具）
  - 若返回 dict：将数据作为 Tool Output 再次喂给 LLM，触发 MaiReply 二次生成人格化回复！
```

---

## 二、第一道门槛：`__init__.py` 中的三要素声明

在 Eridanus 中，每个具有工具调用能力的插件目录（位于 `run/<插件名>/` 下），必须在其 `__init__.py` 中明确声明以下三个元数据：

1. **`plugin_description`**：字符串，向插件扫描器简短描述本插件的服务定位；
2. **`dynamic_imports`**：**字典映射**，告诉底层 `func_map_loader` 该函数具体位于哪个 Python 模块下，动态按需导入；
3. **`function_declarations`**：符合 Gemini / OpenAPI Schema 规范的工具描述列表，直接包含 `name`、`description` 和 `parameters`。

### 真实源码示范：媒体服务插件 (`run/streaming_media/__init__.py`)

看！这就是我们源码里的标准实现：

```python
# 位于 run/streaming_media/__init__.py

plugin_description = "媒体服务"

# 1. 动态导入映射表：模块完整路径 -> [导出的函数名称列表]
dynamic_imports = {
    "run.streaming_media.youtube": ["download_video"],
    "run.streaming_media.cloud_music_parsing": ["parse_cloud_music"]
}

# 2. 供大模型理解的工具参数 Schema
function_declarations = [
    {
        "name": "download_video",
        "description": "下载youtube/bilibili的视频或音频。",
        "parameters": {
            "type": "object",
            "properties": {
                "type": {
                    "type": "string",
                    "enum": ["video", "audio"],
                    "description": "下载类型。asmr100平台只能下载audio"
                },
                "url": {
                    "type": "string",
                    "description": "视频/音频的链接地址"
                },
                "platform": {
                    "type": "string",
                    "enum": ["youtube", "bilibili", "asmr100"],
                    "description": "视频的来源平台。域名为b23.tv的为bilibili"
                }
            },
            "required": [
                "url",
                "platform"
            ]
        }
    },
    {
        "name": "parse_cloud_music",
        "description": "解析并下载网易云音乐单曲",
        "parameters": {
            "type": "object",
            "properties": {
                "url": {
                    "type": "string",
                    "description": "音频的链接地址"
                }
            },
            "required": [
                "url"
            ]
        }
    }
]
```

::: tip 避坑提示：不要在外层嵌套多余结构！
在 `function_declarations` 里，每个条目直接就是 `{ "name": ..., "description": ..., "parameters": ... }` 的扁平字典。千万不要自己在外面硬包一层 `{"type": "function", "function": ...}`，底层的 LLM 适配器在发送前会根据具体 API 自行包装！
:::

---

## 三、底层铁律：前三个参数永远固定是 `(bot, event, config)`

这是所有 Eridanus 开发者必须牢记的约定俗成铁则：

::: danger 工具入参黄金法则
**不管你的工具未来会接收大模型传入的多少个业务参数，函数签名的前三个位置参数永远固定是：**
```python
async def your_tool_func(bot: ExtendBot, event, config: YAMLManager, ...):
```
:::

### 1. 为什么不用在 `function_declarations` 里声明这三个参数？
因为这三个对象是属于机器人内部的**系统上下文**！
- `bot`：用于发送消息、发语音、发图片的机器人类实例（`ExtendBot`）；
- `event`：触发本次调用的消息事件（包含 `user_id`, `group_id`, `pure_text` 等）；
- `config`：全局配置热重载单例管理器（`YAMLManager`）。

大模型只需要从用户对话中提炼出纯粹的业务参数（比如 `url`、`platform`、`target`），而 Eridanus 底层的 `build_tool_fixed_params()` 在调用函数时，会自动将当前的 `(bot, event, config)` 固定塞给函数的前三个形参！

### 2. 纯上下文工具示例：清除对话历史
例如下面这个清除上下文的工具，大模型调用它时完全不需要传递任何额外参数：

```python
async def clear_chat_history(bot: ExtendBot, event, config: YAMLManager):
    """清除当前用户在本会话的 MaiReply 对话历史"""
    ctx = ContextManager(config)
    group_id = getattr(event, "group_id", None)
    # 直接利用传入的 event 和 config 结算业务
    ctx.clear_session(group_id, event.user_id)
    # 直接通过传入的 bot 发送反馈给用户
    await bot.send(event, "好的，对话记录已清除～")
```

---

## 四、核心机制：返回值设计与 MaiReply 二次调用

工具执行完了，究竟要不要让 AI 再说一句话？**全由你的函数返回值决定！**

### 规则 1：返回 `None`（或不写 return） -> **静默结束，不二次调用**
如果你的工具内部已经通过 `await bot.send(...)` 完整发送了最终结果（比如发完了一条语音、或者直接把清理记录的确认语句发给用户了），此时直接返回 `None`。
- **机制**：MaiReply 发现工具返回为空，本次对话链路直接宣告完成，**绝不会再浪费 token 触发一次大模型回复**，避免机器人像个复读机一样没话找话。

### 规则 2：返回一个 `dict` -> **捕获数据，触发 MaiReply 二次调用**
如果你的工具是负责查询数据、或者是抽到卡片后希望 AI 结合角色人设为群友“算命/吐槽”，那你的函数**必须返回一个 Python `dict`**！
- **机制**：MaiReply 会捕获这个字典，作为 `Tool Output` 提交回大模型，大模型看到真实返回的数据后，会立刻以 Yucca 的性格语气生成最终的回复。

### 真实源码示范：塔罗牌占卜工具 (`call_tarot`)

看！这就是 `basic_plugin` 中非常经典的实战写法：

```python
import random
from developTools.message.message_components import Text, Image
from framework_common.framework_util.manshuo_draw import manshuo_draw

async def call_tarot(bot, event, config):
    # 1. 检查彩蛋牌分支
    if (config.basic_plugin.config["tarot"]["彩蛋牌"] and 
        random.randint(1, 100) < config.basic_plugin.config["tarot"]["彩蛋牌"]["probability"]):
        
        cards_ = config.basic_plugin.config["tarot"]["彩蛋牌"]["card_index"]
        card = random.choice(cards_)
        card_path, text = list(card.items())[0]
        if text == "": 
            text = "no description"
            
        # 工具内部先发一张牌面图片
        await bot.send(event, [Text(f"{text}"), Image(file=card_path)])
        
        # 返回字典，供 MaiReply 获取彩蛋信息并组织生动的解说
        return {"text": "开出彩蛋牌，来源：jojo的奇妙冒险", "img": card_path}

    # 2. 普通牌面分支：渲染长图后发送
    txt, img, tarots = tarotChoice('bilibili')
    await bot.send(event, Image(file=(
        await manshuo_draw([
            {'type': 'basic_set', 'img_width': 750, 'img_name_save': f'{event.pure_text}_{tarots}.png'},
            {'type': 'img', 'subtype': 'common_with_des_right', 'img': [img], 'content': [txt]}
        ])
    )))
    
    # 将抽卡结果字典返回给 mai_reply，触发 AI 结合牌意替用户现场解卦！
    return {"text": txt, "img": img}
```

---

## 五、手把手实战：从零编写一个带 Function Calling 的插件

现在，我们手把手为机器人新增一个“群积分小金库查询”工具：

### 第一步：创建插件目录结构
```text
run/gold_vault/
├── __init__.py          # 存放元数据、dynamic_imports 与 function_declarations
└── service.py           # 存放具体实现的异步工具函数
```

### 第二步：编写 `run/gold_vault/__init__.py`
```python
plugin_description = "小金库积分服务"

dynamic_imports = {
    "run.gold_vault.service": ["query_user_coins"]
}

function_declarations = [
    {
        "name": "query_user_coins",
        "description": "查询当前群友或指定成员的小金库金币余额与钱包等级",
        "parameters": {
            "type": "object",
            "properties": {
                "target_name": {
                    "type": "string",
                    "description": "要查询的用户昵称，若用户询问自己的资产则填'self'"
                }
            },
            "required": ["target_name"]
        }
    }
]
```

### 第三步：编写 `run/gold_vault/service.py`
```python
from framework_common.database_util.User import get_user

async def query_user_coins(bot, event, config, target_name: str):
    """前三个参数永远是 bot, event, config；第四个参数对应 parameters 里的 target_name"""
    # 从数据库中读取用户数据
    user = await get_user(event.user_id)
    coin_count = user.coin
    
    # 按照需求返回结构化 dict，触发 MaiReply 二次用少女口吻夸奖或调侃
    return {
        "user_id": event.user_id,
        "target": target_name,
        "coins": coin_count,
        "wallet_status": "富得流油" if coin_count > 1000 else "穷得叮当响"
    }
```

大模型收到这个字典后，就会欢快地回复：    
> “（探出小脑袋数了数你的小钱包）哇！主人你现在一共有 1250 枚金币呢，简直富得流油~ 今晚是不是该请我吃顿小鱼干大餐啦？”

---

## 六、热刷新机制：如何在运行期动态更新工具？

如果你在机器人运行过程中动态生成或修改了工具（例如使用了 `cli_bridge` 代码生成器），不需要重启整个机器人进程！

可以直接调用热刷新接口：

```python
from run.mai_reply.service.reply_engine import refresh_tools

# 触发全盘重新扫描 run/ 目录并无损更新内存中的工具缓存字典
refresh_tools()
```

底层 `func_map_loader.py` 会清空 `dynamic_imports` 并通过 `importlib.reload` 重新载入所有修改后的声明，秒级生效~
