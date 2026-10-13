# YAMLManager 与配置系统

在 Eridanus 中，配置文件不是一次性读入的死数据，而是具备**多文件聚合**与**毫秒级防抖热重载**的动态配置对象。    

---

## 1. 配置对象的层级访问

在插件入口函数中传入的 `config` 是一个 `YAMLManager` 实例。    
它会递归扫描所有插件目录下的 `.yaml` 文件，并将其挂载为属性：    

```python
# 访问 run/my_plugin/config.yaml 中的 api_key
key = config.my_plugin.config.get("api_key", "")

# 访问全局 data/config/common_config.yaml
master_id = config.common_config.master_id
```

---

## 2. 毫秒级防抖热重载机制

当你编辑保存 YAML 文件时：    
1. 内置的 `YAMLFileHandler`（基于 Watchdog）捕获到文件变动。    
2. 触发 0.3 秒定时器防抖，避免编辑器多次写入导致频繁刷新。    
3. 线程安全地在后台解析新的 YAML 内容并原子替换内存数据。    
4. 业务代码下一次读取 `config.xxx` 时，立即获取到最新值，无需重启 Bot！    

---

## 3. 注册配置变更回调

如果你希望在配置改变时立即触发某些动作（例如重新初始化客户端连接），可以注册监听回调：    

```python
def on_config_updated(new_yaml_dict):
    logger.info("检测到配置文件修改，正在刷新连接...")

config.register_callback("my_plugin", on_config_updated)
```




