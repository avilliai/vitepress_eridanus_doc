# Steam 游戏资料与史低查询

）G 胖的打折季又到啦？这款游戏到底有没有背刺？现在买究竟是不是历史最低价？把名字告诉我，我来帮你算笔明白账！

本插件深度调取 Steam 官方商城与史低价格数据库，帮你快速比价、查看国区售价、折扣百分比、玩家好评率与游戏核心标签，买游戏再也不当冤大头。

## 源码入口与核心配置

- **代码入口**：`run/acg_infromation/steam_service.py`
- **后台服务**：`run/acg_infromation/service/steam.py`
- **代理配置**：走 `run/common_config/basic_config.yaml` 的 `proxy`
- **所属模块配置**：`run/acg_infromation/config.yaml`

```yaml
绘图框架:
  gal_recommend: true   # 是否接入绘图框架渲染
  majsoul_search: true  # 搜索功能卡片渲染
```

查询结果支持抓取 Steam 官方封面图与折后价格，网络请求默认走配置的全局代理。

## 触发指令

源码在 `steam_service.py` 中采用严格的前缀匹配与空格切片：

| 指令格式 | 示例 | 作用说明 |
| :--- | :--- | :--- |
| `steam查询 <游戏名称>` | `steam查询 艾尔登法环` | 检索 Steam 游戏，输出封面、原价、当前折后价、历史最低价、折扣率与总体评测好评率 |
| `steam查询 <英文原名>` | `steam查询 Cyberpunk 2077` | 支持英文名精准检索 |

> **避坑提醒**：代码是按 `steam查询 `（**后面带一个半角空格**）严格切分的哦！请千万记得在关键词前面空一格，写成 `steam查询 潜水员戴夫`，不然我可能会当作普通聊天没反应呢~

## 如果你想做什么，应该改哪里？

1. **查询经常提示“网络超时”或封面出不来**：
   - 打开 `run/common_config/basic_config.yaml`；
   - 检查 `proxy` 是否已配置并正常工作，Steam 商城 API 国内网络偶有阻断。
2. **搜索出来的游戏名字不对**：
   - 尽量使用 Steam 商城上的标准中文官方译名或英文原名进行检索。
