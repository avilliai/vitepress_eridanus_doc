# GPTImage2 绘画工坊
::: tip 免费鸡蛋
我们为Eridanus用户准备了若干免费接口，包括`gptimage2`。   
可前往qq群`1050663831`获取      
网关在`http://api.apollodorus.xyz/`
:::

如果说传统的 SD 还要到处找各种生涩难懂的 Danbooru 英文 Tag，那 GPTImage2 就是彻彻底底的自然语言魔法啦。只要你用中文随口描绘你心中的画面，我就能帮你画出色彩斑斓的插画哦~

核心代码位于：`run/ai_generated_art/gptimage2.py`  
配置文件位于：`run/ai_generated_art/config.yaml` 的 `gptimage2` 区块

## 交互指令

- `/gpt <画面描述>` 或 `/生图 <画面描述>`
  - 示例：`/gpt 蓝发短发少女坐在窗台边喝热可可，窗外飘着细雪，温暖治愈的二次元插画风格`
  - 示例：`/生图 穿着水手服的猫系少女，慵懒地躺在被窝里看手机`
  - 行为：提取关键词直接送入 GPT-Image 模型渲染，生成高精度单张插画发送到群聊。
- `/图像编辑`
  - 开启多轮交互式修图会话！
  - 发送 `/图像编辑` 后，我会在会话中等待你发送底图和修改要求（比如“把衣服换成红色卫衣”）。
  - 修图完成或想中止时，发送 `/end` 即可退出编辑会话。

## 核心配置片段一览（`run/ai_generated_art/config.yaml`）

```yaml
gptimage2:
  base_url: "http://api.apollodorus.xyz/v1" # API 接口地址
  apikey: "your_gptimage_key_here"          # 你的接口授权密钥
  model: "gpt-image-2.5-flare"              # 推荐模型：gpt-image-2.5-flare，也可选 nano-banana-2
  aspect_ratio: "1:1"                       # 默认画面比例，可选 1:1, 16:9, 4:3, 9:16 等
  resolution: "2K"                          # 分辨率：1K 极速稳定；2K 更精细但消耗双倍配额
  max_retry: 5                              # 请求失败时的最大重试次数
  权限要求: 0                               # 最低权限要求（0 表示所有群友均可使用）
  接管sd: false                             # 是否全面接管原本的 SD 生图指令
  bot_oc: "data/system/bot_oc.png"          # 绘制机器人自身时的外貌参考原画
  extra_prompt: "赛璐璐风格。不必绘制过于繁复的服饰细节和发丝，保持角色可识别即可。保持图片清晰"
  character_anchor: "的固定外貌特征如下：粉色和蓝色渐变眼睛；少女体型；标志性服装为白色不对称吊带礼裙..."
```

## 如果你想修改，应该改哪里？

- **生图老是提示连接失败或者密钥无效？**
  - 快看 `gptimage2.apikey`！必须填入有效的 API Key。没有 Key 的话可以到官方群聊申请测试额度哦。
- **画出来的图想要横屏壁纸（16:9）或者竖屏手机壁纸（9:16）？**
  - 改 `aspect_ratio`！直接修改为 `"16:9"` 或者 `"9:16"` 即可。
- **想让我彻底把画图指令接管，不用再启动本地臃肿的 SD？**
  - 把 `接管sd` 改为 `true`，此时连“画 <描述>”指令都会自动流转到 GPTImage2 处理，省心又省显存。
