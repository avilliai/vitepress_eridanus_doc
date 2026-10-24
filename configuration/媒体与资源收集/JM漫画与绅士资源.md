# JM 漫画与绅士资源

（脸颊微红，轻轻跺了跺脚）喂……这个功能到底是谁加进来的呀？！不过既然被主人写进底层了，那我也只能乖乖帮你找了啦……但别在公共大群里乱开香槟哦！

本插件整合了禁漫天堂（JMComic）的搜索、验车预览、随机精选与整本 PDF 离线下载能力，并且自带了一整套防风控遮罩、违规车牌号黑名单与私有云同步方案。

## 源码入口与核心配置

- **代码入口**：`run/resource_collector/resource_search.py`
- **底层服务**：`service/jmComic/`
- **配置文件路径**：`run/resource_collector/config.yaml`

配置片段包含权限与高级下载选项两大部分：

```yaml
jmcomic:
  jm_comic_search_level: 0    # 搜索功能所需权限等级
  jm_comic_download_level: 0  # 下载功能所需权限等级
  jm_comic_random_level: 0    # 随机本子所需权限等级

JMComic:                      # 禁漫核心设置
  anti_nsfw: obfuscate         # 防吞策略：可选 gif、black_and_white、no_censor、obfuscate（高斯混淆）
  gif_compress: false          # gif 模式下是否压缩
  previewPages: 6              # 验车预览抽取的页数
  autoClearPDF: true           # 发送完成后是否自动清理本地临时 pdf
  autoEncrypt: true            # 下载后是否自动加密 pdf 文件
  savePath: "data/pictures/benzi" # PDF 默认落盘路径
  jm_ban:                      # 禁止查询和下载的违规车牌号黑名单
    - 350234
    - 350235
  ban_answer:                  # 触发黑名单时的随机反讽回复
    - 带着你的董卓吃大份去吧
    - 还真是一对苦命鸳鸯
    - 带着你的苦命鸳鸯实大变去罢！
  ranking_limit: 10            # 榜单显示条数
  cover_workers: 5             # 封面并发下载线程数
  openlist:                    # 下载后是否自动同步上传到私有网盘（OpenList/Alist）
    enable: false
    base_url: ""
    username: ""
    password: ""
    upload_dir: ""
```

## 触发指令

| 指令格式 | 示例 | 作用说明 |
| :--- | :--- | :--- |
| `jm搜<关键词>` 或 `JM搜<关键词>` | `jm搜 纯爱` | 检索漫画作品，返回车牌号、标题、作者及总页数 |
| `验车<车号>` 或 `jm验车<车号>` | `验车 123456` | 抽取前 `previewPages` 页进行防吞混淆处理后发群预览 |
| `jm下载<车号>` | `jm下载 123456` | 完整拉取整本漫画，渲染为 PDF 并以群文件方式回传 |
| `随机本子` | `随机本子` | 随机挑选一部作品并生成预览介绍 |

## 如果你想做什么，应该改哪里？

1. **验车发送的预览图总是被腾讯秒撤回/封号**：
   - 打开 `run/resource_collector/config.yaml`；
   - 调整 `JMComic.anti_nsfw` 策略：推荐设为 `obfuscate`（算法混淆马赛克）或者 `black_and_white`（黑白化）。
2. **预览抽取的页数太多刷屏**：
   - 将 `JMComic.previewPages` 调小（例如从 `6` 改为 `3`）。
3. **遇到恶心人或违规车牌号想直接拉黑**：
   - 在 `JMComic.jm_ban` 列表中追加对应车牌号；
   - 在 `ban_answer` 列表里填入你想调侃/痛骂对方的台词。
4. **下载完本子后自动保存到自己的私人网盘**：
   - 启用 `JMComic.openlist.enable: true`，填入你的 OpenList / Alist 服务地址、账号密码与目标上传目录即可实现全自动转存！
