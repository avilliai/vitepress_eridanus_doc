# YAMLManager 与动态配置系统

在很多老旧的机器人框架里，改个配置就得把整个进程杀掉重启？在 Eridanus 这里可不用这么憋屈哦！

Eridanus 的配置系统基于 `framework_common/framework_util/yamlLoader.py` 中的 `YAMLManager` 构建。它不仅将 `run/` 下所有零散的 `config.yaml` 自动聚合为一个面向对象的属性树，还内置了基于 **Watchdog** 的文件监视器与**毫秒级防抖热重载**机制。

## 1. 配置对象的层级访问原理

当主程序调用 `config = YAMLManager("run")` 时，管理器会递归扫描所有子目录，并将目录名与文件名映射为 Python 对象的属性：

```python
# 访问 run/common_config/basic_config.yaml 中的 master.id
master_qq = config.common_config.basic_config["master"]["id"]

# 访问 run/my_awesome_plugin/config.yaml 中的自定义参数
my_api_key = config.my_awesome_plugin.config.get("api_key", "default_val")

# 访问 run/resource_collector/config.yaml 中的 asmr 字段
asmr_level = config.resource_collector.config["asmr"]["asmr_level"]
```

> **注意层级规则**：
> - 根属性名称对应于 `run/` 下的子文件夹名称；
> - 二级属性对应去掉 `.yaml` 后缀的配置文件名（如果目录下只有一个 `config.yaml`，直接用 `.config` 访问即可）；
> - 读取到的内容为标准的 Python `dict` / `list` 结构。

## 2. 毫秒级防抖热重载机制 (Watchdog)

`yamlLoader.py` 内部实现了 `YAMLFileHandler`：
1. **文件变更监听**：系统在后台拉起 `Observer` 监视线程，捕获任何 `.yaml` 或 `.yml` 文件的写盘事件；
2. **定时器防抖 (0.3s)**：代码编辑器在保存时往往会产生多次临时写入事件，防抖逻辑确保只在最后一次稳定落盘后的 0.3 秒触发重新解析；
3. **线程安全原子替换**：在互斥锁保护下重读 YAML，新字典原子替换内存中的旧对象；
4. **即刻生效**：插件的业务代码下一次读取 `config.xxx` 时，拿到的立刻就是修改后的全新数值，完全无需重启 Python 进程！

## 3. 插件开发中的最佳配置实践

如果你正在编写一个新插件 `run/my_plugin/`：

### 第一步：创建专属 `config.yaml`
```yaml
enable: true
reply_prefix: "【我的插件】"
max_daily_limit: 10
admin_level_required: 100
```

### 第二步：在插件代码中直接使用注入的 `config`
```python
def main(bot, config):
    @bot.on(GroupMessageEvent)
    async def handle_msg(event: GroupMessageEvent):
        # 实时读取，哪怕你在运行时修改了 config.yaml，这里也会秒级同步最新值！
        plugin_cfg = config.my_plugin.config
        
        if not plugin_cfg.get("enable", False):
            return
            
        prefix = plugin_cfg.get("reply_prefix", "")
        if event.pure_text == "测试":
            await bot.send(event, f"{prefix} 收到测试指令喵~")
```

无需手动加载文件，无需处理编码与序列化，开箱即用，优雅丝滑！
