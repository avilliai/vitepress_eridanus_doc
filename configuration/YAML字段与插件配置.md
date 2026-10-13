# YAML 字段与插件配置

别看 Eridanus 功能这么多，其实我的插件体系设计得特别规整，一点都不乱糟糟的~ 每一个功能包都在自己的小房间里过日子。

整个框架采用的是 **“中心+分布式”** 的配置管理逻辑：
1. **全局主枢纽**：`run/common_config/basic_config.yaml`（负责连接、权限基础与代理）。
2. **独立插件包配置**：每个功能目录下的 `run/<插件名>/config.yaml`（负责每个插件独有的业务参数）。

## 插件配置是怎样被读取的？

在代码世界里，框架会自动把各个 YAML 文件挂载在全局 `config` 对象上：
- 访问格式通常是：`config.<插件目录名>.<yaml文件名>`
- 比如基础插件读取的是 `config.basic_plugin.config`
- 系统插件读取的是 `config.system_plugin.config`

这也意味着：**YAML 里的键名是严格区分大小写的，层级缩进不能乱，未在代码中使用的自定义键是不会凭空起作用的哦！**

## 典型插件配置速览（以 basic_plugin 为例）

来看看 `run/basic_plugin/config.yaml` 的节选：

```yaml
# 外部开放 API 的密钥配置
心知天气:
  api_key: ""             # 心知天气 Private Key，留空就查不了实时天气了哦
image_search:
  sauceno_api_key: ""     # SauceNAO 以图搜番 key
nasa_api:
  api_key: ""             # NASA 天文每日一图 key

# 涩图与壁纸相关设置
setu:
  r18mode: true           # 是否允许 R18 内容（请群主对自己的群聊负责~）
  download: true          # 是否先下载到本地再发送
  gray_layer: true        # 是否添加防和谐轻度灰度滤镜
  setu_operate_level: 0   # 触发涩图所需的最低用户权限等级（0 表示普通用户皆可）
  custom_pic_source: "https://api.lolicon.app/setu/v2"
  today_img_list: ["巨乳", "贫乳", "萝莉", "黑丝", "白丝"]

# 搜图引擎行为
搜图:
  search_image_resource_operate_level: 0
  聚合搜图: true
  soutu_bot: true
```

## 如果你想修改配置，必须注意什么？

- **缩进规范**：YAML 必须用**半角空格**缩进，严禁使用 Tab 键！缩进一旦错位，整个文件都会解析崩溃，到时候我可就起不来床啦。
- **布尔值与数字**：真假只能写小写的 `true` / `false`，权限等级必须是纯整数（如 `0`、`10`、`100`、`1000`）。
- **热更新还是重启？**
  - 如果你修改的是具体的插件业务参数（例如心知天气的 Key、涩图的开关、反击概率等），绝大多数插件在重新调用或者热重载时就能直接生效。
  - 但如果你动了 `basic_config.yaml` 里的 WebSocket 链接、协议端端口、Master QQ、Redis 地址等底层网络基础设施，请务必老老实实**重启主程序**！
- **WebUI 修改与本地文件同步**：你在 WebUI 配置编辑器里修改并保存的内容，最终都会直接写回对应的本地 `.yaml` 文件。如果你发现改了没反应，先看看控制台有没有报语法错误或者权限不足哦。
