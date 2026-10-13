# ASMR 音声检索

）嘘……戴上耳机，今天想听点什么声音入眠呀？

Eridanus 内置了专门的 ASMR / 音声检索与搬运模块。你可以让我在深夜里翻出温柔的耳语、雨声白噪音或者精选音声作品。不过这种消耗带宽又带点私密性质的资源，在群里可不能乱放，我有一整套严格的发送模式和权限拦截机制呢~

## 源码入口与核心配置

- **代码入口**：`run/resource_collector/resource_search.py`
- **配置文件路径**：`run/resource_collector/config.yaml`
- **底层注册工具**：`run/resource_collector/__init__.py` 声明的 `call_asmr`

配置片段如下：

```yaml
asmr:
  with_url: false  # 是否附带同作品集其他作品的 url
  with_file: false # 是否合并并发送音频文件
  max_merge_file_num: 10 # 最大合并文件数
  gray_layer: true # 是否开启灰度图功能（防止封面过于刺激被风控）
  asmr_level: 0    # 使用该功能所需的最低权限等级
  send_type: file   # 发送形式：record（语音条）或 file（群文件）
  channels: # Telegram 频道来源（需在 basic_config 配置 proxy，并通过 tools 登录）
    - '@emococh'
    - '@-gabisroom-4153'
```

另外在 `run/streaming_media/config.yaml` 中也有下载等级门槛：
```yaml
流媒体:
  asmr:
    download_audio_level: 4  # 下载 ASMR 音频所需的权限等级
```

## 源码里真正支持的触发指令

代码直接匹配消息文本，没有任何花里胡哨的虚假语法：

| 触发词 / 指令 | 作用说明 |
| :--- | :--- |
| `随机asmr` / `随机奥术` / `随机奥数` | 随机调取一部音声资源并返回介绍与封面 |
| `最新asmr` / `最新奥术` / `最新奥数` | 拉取频道源最新收录的音声列表 |
| `最热asmr` / `最热奥术` / `热门asmr` | 获取高热度精选音声推荐 |

> **Yucca 的小贴士**：之所以别名叫“奥术”或者“奥数”，是为了在风控严苛的群聊里做个隐蔽代号啦，免得机器人刚发出来就被管理或者系统盯上~

## 如果你想做什么，应该改哪里？

1. **想让 Bot 直接把音频文件丢到群里而不是只发介绍卡片**：
   - 打开 `run/resource_collector/config.yaml`；
   - 将 `asmr.with_file` 设置为 `true`；
   - 如果想以语音条发送，改 `send_type: record`；如果想当成文件传输，改 `send_type: file`。
2. **封面图太暴露容易导致封号/被撤回**：
   - 保持 `asmr.gray_layer: true`，开启黑白灰度滤镜降低识别风险。
3. **限制普通群友滥用大文件下载**：
   - 将 `asmr.asmr_level` 调高（例如 `100` 或 `500`），只有核心信任成员才能呼叫。
4. **音频抓取失败或超时**：
   - 检查 `run/common_config/basic_config.yaml` 里的 `proxy` 代理是否畅通，且频道来源 `channels` 是否处于可用状态。
