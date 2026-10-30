# Iwara 视频解析

（眼神飘向一旁，悄悄压低帽檐）哼，别以为我不知道你们在 Iwara 上看些什么……绅士 MMD 舞蹈和 3D 动画是吧？既然是主人的需求，我也可以帮你搜出来哦~

本模块提供了对 Iwara 平台的视频搜索、排行榜浏览与无水印下载功能。由于内容特殊性，框架原生配备了灰度保护和权限分级，防止公共群聊炸群。

## 源码入口与核心配置

- **代码入口**：`run/resource_collector/iwara.py`
- **后台服务**：`run/resource_collector/service/iwara/`
- **配置文件路径**：`run/resource_collector/config.yaml`
- **底层工具**：`iwara_search`、`iwara_tendency`、`iwara_download`

配置片段如下：

```yaml
iwara:
  iwara_search_level: 0     # 搜索功能所需权限等级（默认所有人可用）
  iwara_download_level: 9   # 视频下载所需权限等级（建议设高，避免大文件滥用）
  iwara_gray_layer: true    # 是否开启封面灰度滤镜（黑白封面防群内风控）
  zip_file: false           # 下载后是否打包为 ZIP 压缩包发送
  zip_password: "123456"    # 压缩包解压密码
```

## 触发指令

指令全部在 `iwara.py` 的分支判断中精确匹配：

| 指令格式 | 示例 | 作用说明 |
| :--- | :--- | :--- |
| `iwara搜<关键词>` | `iwara搜 genshin` | 检索相关作品，返回标题、作者、视频 ID 与封面 |
| `iwara最新` | `iwara最新` | 获取当前平台最新发布的视频列表 |
| `iwara趋势` | `iwara趋势` | 获取当前上升趋势最快的视频推荐 |
| `iwara热门` | `iwara热门` | 获取平台高热度人气视频列表 |
| `iwara下载<ID/链接>` | `iwara下载 abcdef12345` | 下载对应视频并发送（支持直发或按配置加密压缩） |

## 如果你想做什么，应该改哪里？

1. **群文件直传视频经常被腾讯风控拦截**：
   - 打开 `run/resource_collector/config.yaml`；
   - 将 `iwara.zip_file` 设为 `true`；
   - 自定义 `iwara.zip_password`（例如 `"eridanus"`），让 Bot 自动打包加密回传，安全度拉满！
2. **群聊搜索封面太暴露容易被封号**：
   - 保持 `iwara.iwara_gray_layer: true`，所有发送的视频预览封面会自动经过黑白灰度处理。
3. **只有信任的管理才能下载原片**：
   - 修改 `iwara.iwara_download_level` 为更高数值（如 `10`、`100` 或 `998`）。
4. **国内服务器直连超时**：
   - 确认 `run/common_config/basic_config.yaml` 中的 `proxy` 正确设置，Iwara 需要境外代理支持。
