# B站 UP 主动态监听

谁又偷偷开播了？谁又发新视频了？放心，只要被我盯上，动态一出立马在群里汇报！

Eridanus 的 B 站动态监听模块基于 `run/streaming_media/dynamic.py` 与专属后台服务实现，支持多群独立订阅、图文富文本卡片渲染、视频投稿直达以及自动防刷屏过滤。

## 源码入口与核心配置

- **代码入口**：`run/streaming_media/dynamic.py`
- **后台服务**：`run/streaming_media/service/bili_dynamic/`
- **配置文件路径**：`run/streaming_media/config.yaml`

配置片段如下：

```yaml
bili_dynamic:     # B站解析与推送相关设置
  enable: false    # 是否开启动态巡检与推送功能
  dynamic_interval: 30 # 动态检查轮询间隔时间（秒）
  is_only_master: false # 是否仅允许 master 管理订阅
  is_only_send_video: false # 是否仅推送订阅 UP 主的投稿视频（过滤日常动态与转发）
  is_filter_winning: true # 是否过滤互动抽奖/中奖通知（减少二游官号刷屏）
  is_absorb_color: true # 是否吸取动态主图主色调，卡片自适应印象色
  is_fetch_up_info: true # 是否获取 UP 主信息并渲染在卡片头部
  is_QQ_chek: false # 遇到 QQ 小程序外链时是否只发文字避免刷大图
  is_download_high_quality: true # 视频解析是否追求高清（需 /bili login 登录）
  use_proxy: false # 是否走代理访问 B 站 API
```

## 触发指令

所有命令严格在 `dynamic.py` 的命令列表中注册，严禁随意编造前缀：

| 触发指令 / 别名 | 作用说明 |
| :--- | :--- |
| `/bili_login`、`b站登录`、`/bili login`、`/bililogin` | 唤起二维码登录或凭证引导 |
| `/bili login manual` | 手动填入 SESSDATA 与凭证登录 |
| `/bili status` | 检查当前 B 站登录状态与凭据有效期 |
| `/bili add <UID>` | 将指定 UP 主添加到当前群的订阅列表 |
| `/bili remove <UID>` | 取消订阅指定 UP 主 |
| `/bili enable <UID>` | 在当前群恢复推送该 UP 主的动态 |
| `/bili disable <UID>` | 在当前群暂时静音/停用该 UP 主的推送 |
| `/bili list` | 查看当前群已订阅的所有 UP 主列表与开关状态 |
| `/bili resub` | 重新向后台服务刷新所有订阅连接 |
| `/bili search <关键词>` | 通过关键词搜索 B 站 UP 主及其 UID |
| `/bili help`、`b站帮助`、`b站菜单`、`b站订阅帮助` | 弹出完整的指令菜单指引 |

## 如果你想做什么，应该改哪里？

1. **部署后完全不推送新动态**：
   - 检查 `run/streaming_media/config.yaml`，确认 `bili_dynamic.enable` 已改为 `true`；
   - 在群里发送 `/bili status` 查看账号有效性，若过期请发送 `/bili login` 重新扫码或填入凭证。
2. **群友乱加订阅太吵，只想让管理员管理**：
   - 将 `bili_dynamic.is_only_master` 设置为 `true`。
3. **官号整天发抽奖动态刷屏**：
   - 开启 `bili_dynamic.is_filter_winning: true`，自动拦截抽奖与中奖公告。
4. **只关心 UP 主更新的正片视频，不想看日常碎碎念**：
   - 开启 `bili_dynamic.is_only_send_video: true`，仅在发布新投稿视频时才会推送到群里。
