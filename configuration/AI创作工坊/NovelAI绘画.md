# NovelAI 专业二次元绘画（NAI3 / NAI4）

（轻轻眨了眨眼，把调色板整理好）说到二次元二创和日系动漫审美，NovelAI 的权威地位懂的都懂啦~

Eridanus 深度支持了官方 NovelAI 的最新生成 API（包括 V3 与 V4 模型分支），不管是正向 Tag 渲染还是上传底图重绘，都能顺滑搞定。

核心代码位于：`run/ai_generated_art/aiDraw.py`  
配置文件位于：`run/ai_generated_art/config.yaml` 的 `ai绘画` 区块

## 源码里真正支持的交互指令

请认准下面的精确前缀（**指令与 Tag 之间必须有空格**）：

- `n4 <Tag关键词>`
  - 示例：`n4 1girl, cat ears, silver hair, blue eyes, cute dress, high quality`
  - 调用 NovelAI V4 最新模型进行二次元画风生图。
- `n3 <Tag关键词>`
  - 示例：`n3 1girl, solo, cherry blossoms, school uniform`
  - 调用经典的 NovelAI V3 动漫模型生图。
- `n4re <Tag关键词>` 或 `n4re`
  - 进入 N4 图生图 / 垫图重绘模式。发送指令后随附或紧接着发送一张参考图片，系统会在原图构图上融合新 Tag 重构画面。
- `n3re <Tag关键词>` 或 `n3re`
  - 进入 N3 图生图 / 垫图重绘模式。

*(注：只有在配置文件开启了 `novel_ai画图: true` 并且填入了有效 Token 时，上述指令才会响应哦)*

## 核心配置片段一览（`run/ai_generated_art/config.yaml`）

```yaml
ai绘画:
  novel_ai画图: true       # NovelAI 功能总开关，必须设为 true
  nai_key:                # NovelAI 官方授权 Token 列表
    - "pst-xxxxxxxxxxxxxxxxxxxxxxxx"
  ai绘画所需权限等级: 0     # 使用绘图功能所需的最低用户等级
```

## 如果你想修改，应该改哪里？

- **发送了 n4/n3 机器人毫无反应？**
  - 首先检查 `ai绘画.novel_ai画图` 是否改成了 `true`；其次检查 `ai绘画.nai_key` 里面填写的 NovelAI 密钥格式是否正确（通常以 `pst-` 开头）。
- **国内网络连接 NAI 超时？**
  - NovelAI 的官方服务器在境外，如果服务器在国内，请务必在全局 `run/common_config/basic_config.yaml` 中配置好 `proxy` 代理，否则握手会一直卡住甚至超时报错。
