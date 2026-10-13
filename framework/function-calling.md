# Function calling：从工具声明到插件执行

Eridanus 的 AI 工具不是“随便写一个函数名”就能调用。工具必须先由插件导出，`mai_reply` 再把工具声明传给模型；模型返回 `tool_calls` 后，`run/mai_reply/service/llm_client.py` 根据名称查找 `tools` 字典中的 `func` 并执行，结果以 `role=tool`（OpenAI）或 `functionResponse`（Gemini）放回上下文，模型才会生成最终回复。

## 真实的工具声明

基础插件在 `run/basic_plugin/__init__.py` 中导出了以下工具（名称必须完全一致）：

| 名称 | 参数 | 实现 |
| --- | --- | --- |
| `call_weather_query` | `location: string` | `service/weather_query.py` |
| `call_setu` | `tag: string`、`r18: boolean` | `service/anime_setu.py` |
| `call_image_search` | `query: string` | `image_search.py` |
| `call_pick_music` | `song_name: string` | `service/cloudMusic.py` |
| `call_tarot` | 无 | `service/divination.py` |
| `call_fortune` | 无 | `service/divination.py` |
| `call_quit_chat` | 无 | 结束当前 AI 对话 |
| `call_menu` | 无 | 返回可用功能菜单 |

插件通过 `__init__.py` 中的字典导出 `name`、`description`、`parameters` 和 `func`。新增工具时应复制这种结构，不要只在提示词里虚构函数。

## 调用链（源码对应）

1. `run/mai_reply/service/reply_engine.py` 汇总当前启用插件的工具。
2. `llm_client.py` 将其转换为 OpenAI `{"type":"function", "function": ...}` 或 Gemini function declarations。
3. OpenAI 客户端收到 `finish_reason=tool_calls` 后进入 `_execute_openai_tool_calls`；Gemini 进入 `_execute_gemini_function_calls`。
4. 执行函数时会从工具项取出 `func`，传入模型给出的 JSON 参数；异常会被包装为工具错误，不应伪造成功结果。

不支持原生工具调用的接口由 `run/ai_llm/clients/eridanus_client.py` 解析文本中的工具标记；这不是插件作者需要实现的另一套 API。

## 插件示例（可运行骨架）

```python
# run/my_plugin/__init__.py
plugin_description="ACG相关信息查询插件"




"""
函数调用所需
"""
dynamic_imports={
    "run.acg_infromation.bangumi": ["call_bangumi_search"],
    "run.acg_infromation.character_identify": ["call_character_identify"],
    "run.acg_infromation.func_collection": [
        "anime_game_service_func_collection"
    ],
}
function_declarations=[
    {
        "name": "call_bangumi_search",
        "description": "搜索acg相关番剧、动画、小说、游戏、音乐、三次元人物等",
        "parameters": {
            "type": "object",
            "properties": {
                "cat": {
                    "type": "string", "enum": ["番剧", "动画", "书籍", "游戏", "音乐", "三次元人物"],
                    "description": "搜索类型"
                },
                "keywords": {
                    "type": "string",
                    "description": "搜索关键词"
                }
            },
            "required": [
                "keywords"
            ]
        }
    },
    {
        "name": "call_character_identify",
        "description": "识别图片中的人物。如果用户没有要求，不要主动识别",
        "parameters": {
            "type": "object",
            "properties": {
                "image_url": {
                    "type": "string",
                    "description": "图片的url"
                },
            },
            "required": [
                "image_url",
                "model_name"
            ]
        }
    },
    {
        "name": "anime_game_service_func_collection",
        "description": "调用游戏查询服务的功能集合。",
        "parameters": {
            "type": "object",
            "properties": {
                "m_type": {
                    "type": "string", "enum": ["blue_archive", "steam"],
                    "description": "blue_archive：碧蓝档案游戏攻略查询(角色、关卡) ；steam：Steam游戏查询"
                },
                "query_target": {
                    "type": "string",
                    "description": "查询目标，如游戏名称、游戏角色名称等"
                }
            },
            "required": [
                "m_type",
                "query_target"
            ]
        }
    },
]

```

函数应为 `async def`，并返回可 JSON 序列化的值。工具是否注入还受 AI 对话插件配置和权限控制影响；仅写入 YAML 不会自动创建工具。




