# Z-Library 图书检索

别以为我整天只知道吃喝玩乐，知识的海洋里也有我替你搜集的好书哦~

本模块通过集成 Z-Library 检索与下载接口，让群友或私聊用户能够快捷查找专业书籍、外文原版书或流行小说，并支持通过提取码直接下载电子书文件。

## 源码入口与核心配置

- **代码入口**：`run/resource_collector/resource_search.py`
- **配置文件路径**：`run/resource_collector/config.yaml`
- **底层工具声明**：`search_book_info` 与 `call_download_book`

配置片段如下：

```yaml
z_library:       # 填入你的 zlib 账号，此功能必须开启代理网络环境
  search_num: 4        # 搜索返回结果数量，默认 4 本书
  email: ""            # Z-Library 注册邮箱
  password: ""         # Z-Library 账号密码
  search_operate_level: 0    # 书籍搜索所需最低权限等级
  download_operate_level: 998  # 书籍下载所需权限等级（默认极高，防带宽被刷爆）
```

## 触发指令

源码在 `GroupMessageEvent` 与 `PrivateMessageEvent` 下统一监听，支持群聊与私聊：

| 指令格式 | 示例 | 作用说明 |
| :--- | :--- | :--- |
| `搜书<关键词>` | `搜书 深入理解计算机系统` | 检索图书，返回匹配的书名、作者、年份、格式、ID 与专属 hash |
| `下载书 <id> <hash>` | `下载书 12345678 abcd1234ef` | 依据搜索结果给出的 ID 与 Hash 提取电子书文件并回传 |

> **注意传参格式**：`下载书` 后面必须用**空格**隔开 `<id>` 和 `<hash>`，代码是靠空格切片解析参数的哦！

## 如果你想做什么，应该改哪里？

1. **刚部署完搜书报错“未配置账号”**：
   - 打开 `run/resource_collector/config.yaml`；
   - 在 `z_library.email` 和 `z_library.password` 填入你在 Z-Library 可正常登录的账号与密码。
2. **想允许普通群友也能自由下载书籍**：
   - 默认的 `download_operate_level: 998` 接近 Master 级别；
   - 如果群内服务器带宽宽裕，可以将 `download_operate_level` 调低至 `0` 或 `10`。
3. **搜书出来的结果太多刷屏**：
   - 修改 `z_library.search_num` 为 `2` 或 `3`，保持输出卡片整洁。
4. **下载经常出现连接超时或网络重置**：
   - 检查 `run/common_config/basic_config.yaml` 中的 `proxy` 是否已正确配置，Z-Library 域名通常需要稳定的境外节点才能访问。
