# 框架通用工具 (framework_common)

`framework_common` 下集成了 Eridanus 运行所需的各种框架级基础设施。善用这些工具可以避免重复造轮子！    

---

## 1. 统一彩色日志 (`system_logger`)

通过 `get_logger(name)` 获取格式统一、支持彩色等级输出与文件滚动记录的 Logger：    

```python
from framework_common.utils.system_logger import get_logger

logger = get_logger("MyPlugin")
logger.info("普通信息")
logger.warning("警告信息")
logger.error("错误信息", exc_info=True)
```

---

## 2. 动态定时调度引擎 (`scheduler_engine`)

框架级跨时区定时引擎，支持一次性倒计时、每天、每周特定循环，内置 SQLite 数据库持久化：    

```python
from framework_common.utils.scheduler_engine import dynamic_scheduler

# 添加一个 5 分钟后的单次提醒任务
task_id = dynamic_scheduler.add_task(
    user_id=1840094972,
    group_id=None,
    action_type="message",
    trigger_rule={"recur_type": "once", "time_str": "02:30"},
    prompt_or_message="赖哥该休息啦！",
    description="深夜提醒",
    user_timezone_offset=8.0
)
```

---

## 3. Gemini 多密钥负载均衡池 (`GeminiKeyManager`)

自动管理多个 Google Gemini API Key，支持故障轮询、自动剔除超额 Key 与配额健康检查：    

```python
from framework_common.utils.GeminiKeyManager import GeminiKeyManager

key_mgr = GeminiKeyManager(keys=["AIzaSy...", "AIzaSy..."])
valid_key = key_mgr.get_valid_key()
```

---

## 4. 全球城市与时区转换 (`TimezoneHelper`)

支持从国内城市名或国外主要都市名解析其与东八区（UTC+8）的小时偏移量：    

```python
from framework_common.utils.timezone_helper import TimezoneHelper

# 获取东京与当前东八区的时差
offset = TimezoneHelper.get_timezone_offset("东京")  # 返回 +1.0
```

---

## 5. 依赖动态安装 (`install_and_import`)

在插件首次加载时自动检查并安装缺失的第三方 pip 包，免除用户手动逐个安装的烦恼：    

```python
from framework_common.utils.install_and_import import install_and_import

watchdog = install_and_import("watchdog")
```
