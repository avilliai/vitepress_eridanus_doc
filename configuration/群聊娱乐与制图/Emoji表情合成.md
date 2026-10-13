# Emoji 表情双拼合成（Emojimix）

当害羞脸遇上了小幽灵，或者戴墨镜的酷酷脸碰上了大哭猫猫，会变出什么奇奇怪怪的化学反应呢？

Emojimix 插件支持将任意两个原生 Emoji 表情融合提炼，借助 Google Kitchen 算法库实时合成出一张独一无二的高清拟态新表情贴图！

## 源码入口与核心配置

- **代码入口**：`run/group_fun/emojimix.py`
- **配置文件路径**：`run/group_fun/config.yaml`

配置片段非常清爽：

```yaml
emojimix:         # Emoji 双拼合成相关
  enable: true    # 是否开启表情合成功能
```

## 源码里真正支持的触发指令

源码在 `emojimix.py` 中实现了极简的直接判定逻辑：

```python
if len(event.pure_text) == 2 and config.group_fun.config["emojimix"]["enable"]:
    emoji1, emoji2 = event.pure_text[0], event.pure_text[1]
```

| 触发方式 | 示例 | 作用说明 |
| :--- | :--- | :--- |
| **直接发送两个 Emoji** | `🥺🐱`、`😎🔥`、`😭🎉` | 系统检测到消息纯文本长度恰好为 2 且均属于支持的 Emoji 时，立即自动融合并回传一张合成后的高清 PNG 表情大图！ |

> **Yucca 的小贴士**：中间不要加空格、逗号或任何中文汉字哦，只要干干净净发两个连在一起的 Emoji 就行！如果两个表情过于冷门暂时没有官方合成图谱，系统也会温柔地告诉你“这两个小家伙还没学会合体呢~”。

## 如果你想做什么，应该改哪里？

1. **群友发表情太频繁，想暂时关闭该功能**：
   - 打开 `run/group_fun/config.yaml`；
   - 将 `emojimix.enable` 设置为 `false` 即可秒级停用。
2. **合成图片下载失败或超时**：
   - 检查 `run/common_config/basic_config.yaml` 中的全局 `proxy`，Google Kitchen 资源需要稳定的网络环境进行拉取与本地缓存。
