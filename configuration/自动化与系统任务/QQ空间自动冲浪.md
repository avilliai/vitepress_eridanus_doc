# QQ 空间自动动态

::: tip 免费鸡蛋
我们为 Eridanus 用户准备了可直连的云端生图网关（支持 ComfyUI、GPTImage2 与 Stable Diffusion），可前往 QQ 群 `1050663831` 获取 API Key，网关地址为 `http://api.apollodorus.xyz/`。
:::

QQ 空间插件为 Bot 赋予了极具活人感的空间互动能力：结合 LLM 根据时间线与节日节气生成生活动态说说，**统一从衣橱系统（`wardrobe`）读取角色外貌与服饰设定、从 `ai_generated_art` 读取绘图后端配置（支持 ComfyUI / SD / GPTImage2 对等生图）**，并定时巡检好友评论进行拟人化回复。

## 源码入口与核心配置

- **代码入口**：`run/qq_zone/qzone.py`
- **空间策略配置**：`run/qq_zone/config.yaml`（仅保留 Cookie 保活、定时说说、Vtuber 日常频率与评论互动策略）
- **绘图后端配置**：统一读取 `run/ai_generated_art/config.yaml`（支持 `comfyui`、`sd`、`gptimage2`）
- **角色与服装配置**：统一读取 `run/wardrobe/config.yaml`（详见 [衣橱系统与人设锚点](../AI创作工坊/衣橱系统与人设锚点.md)）
- **权限限制**：所有手动控制与测试命令**严格限定 Master** 权限触发！

*(注：`run/qq_zone/config.yaml` 中的冗余 `sd绘画设置` 与 `角色绘图设置` 已正式移除，只需在一处配置即可同时服务对话、自拍与空间动态。)*

## Master 控制指令

源码在 `qzone.py` 中对发送者身份进行核对，必须是 Master（`common_config.basic_config.master.id`）才能触发：

| 触发指令 | 作用说明 |
| :--- | :--- |
| `/qzone login` | 唤起 QQ 空间 Cookie 获取与登录引导 |
| `/发说说` | 立即依据当前心情与 AI 状态即兴发布一条全新说说 |
| `测试早安` / `发送早安` | 强制触发早安空间说说（含自动配图测试） |
| `测试晚安` / `发送晚安` | 强制触发晚安空间说说（含自动配图测试） |
| `测试日常` / `发送日常` | 强制触发一条 Vtuber 日常自拍动态说说 |
| `测试空间互动` | 立即触发一次评论区巡检并回复未处理的好友留言 |

## 如果你想做什么，应该改哪里？

1. **登录与 Cookie 保活？**
   - 不用手动抓包登录，当前版本直接通过 OneBot 接口自动同步获取 QQ 空间 Cookie。
2. **自定义 Bot 在说说里展示的外貌、服装与画风：**
   - 打开 `run/wardrobe/config.yaml`，修改 `character_anchor`、`art_anchor` 或切换 `outfits_v7` 服饰（详见 [衣橱系统与人设锚点](../AI创作工坊/衣橱系统与人设锚点.md)）。
3. **切换空间配图所使用的生图后端（ComfyUI / SD / GPTImage2）：**
   - 打开 `run/ai_generated_art/config.yaml`，调整 `文生图function_calling后端`（`"comfyui"` / `"sd"` / `"gptimage2"`）以及对应的接口地址和 `apikey`。
4. **修改评论回复的语气或调整每日说说频率：**
   - 在 `run/qq_zone/config.yaml` 中修改 `动态互动.reply_guidance` 约束说话风格，或调低 `vtuber日常互动.每日最大发送次数` 与 `发送概率`。
