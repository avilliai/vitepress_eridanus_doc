# AI 图片甄别检测

（眯起眼睛，凑近屏幕仔细打量着画面的手指线条和噪点分布）这张画看起来好精致呀……不过到底是画师大大辛辛苦苦手绘的心血，还是 AI 几秒钟跑出来的呢？把图发给我，我来帮你掌掌眼！

AI 图甄别模块接入了专业的深度视觉特征分析模型与 Sightengine API，能够深度识别图片中的高频噪点规律、生成模型特征痕迹，并给出精确的 AI 生成概率评分与结构化结论。

## 源码入口与核心配置

- **代码入口**：`run/ai_generated_art/aiDraw.py`
- **配置文件路径**：`run/ai_generated_art/config.yaml` 的 `sightengine` 区块
- **底层工具**：调用视觉特征分析服务

配置片段如下：

```yaml
sightengine:
  # Sightengine 官方 API 凭据（可前往 https://dashboard.sightengine.com/ 免费注册获取）
  api_user: "your_api_user_id"
  api_secret: "your_api_secret_key"
```

## 触发指令

指令由 `aiDraw.py` 中的事件监听器直接捕获，支持群聊与私聊：

| 触发方式 | 操作步骤 | 作用效果 |
| :--- | :--- | :--- |
| **图文同行** | 发送一条包含 `ai图检测` 文本并在同一条消息中附带一张图片 | 系统自动提取图片特征，计算出该图片属于 AI 生成的概率百分比（例如：`该图片为 AI 生成的概率为: 98.4%`） |
| **向导等待** | 1. 发送文字 `ai图检测`<br>2. 机器人回复：“请发送要鉴别的图片喵~”<br>3. 群友紧随其后发送目标图片 | 自动完成下载并回传特征打分与判定结果 |

> **Yucca 的小贴士**：如果是主人自己手绘的画作，可千万不要拿来考我哦，我一定会给主人打出 100% 的人类真心分~

## 如果你想做什么，应该改哪里？

1. **发送指令后报错提示“鉴别服务未配置”**：
   - 打开 `run/ai_generated_art/config.yaml`；
   - 检查 `sightengine.api_user` 与 `sightengine.api_secret` 是否正确填写有效凭据。
2. **下载或请求 API 响应缓慢**：
   - 检查 `run/common_config/basic_config.yaml` 中的 `proxy` 是否开启，Sightengine 服务服务器位于境外，稳定的代理能大幅降低延迟。
