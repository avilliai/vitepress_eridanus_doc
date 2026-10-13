# 框架公共工具库 (framework_common/utils)

（背着双手轻巧地踱步）不要重复发明轮子！在 `framework_common/utils` 目录下，框架为所有插件开发者准备了一整套稳定、高效的基础设施小工具。无论是日志、加密、动态依赖安装还是环境检查，直接 import 就能用！

## 1. 统一彩色日志 (`system_logger`)

严禁在插件里直接使用裸 `print()`！使用统一的 `get_logger` 可以获得带有时间戳、彩色日志等级、文件自动切片落盘的高颜值 Logger：

```python
from framework_common.utils.system_logger import get_logger

logger = get_logger("MyPlugin")

logger.info("常规运行日志信息喵~")
logger.warning("这是一条警告信息！")
logger.error("发生严重错误！", exc_info=True) # 自动打印异常堆栈
```

## 2. 动态依赖缺失自动安装 (`install_and_import`)

如果你的插件需要用到第三方库（比如 `pillow`, `aiofiles`, `cloudscraper`），又不想强迫所有用户预先手动 `pip install`，可以使用依赖自动管理函数：

```python
from framework_common.utils.install_and_import import install_and_import

# 如果本地未安装，系统会自动静默调用 pip 安装后再动态导入并返回模块引用
cloudscraper = install_and_import("cloudscraper")
```

## 3. 内存健康与自动垃圾回收 (`GCTool` 与 `MemoryMonitor`)

针对长时间运行易产生内存泄露的图像处理或大模型交互插件：

```python
from framework_common.utils.GCTool import force_garbage_collect
from framework_common.utils.MemoryMonitor import get_current_memory_mb

# 实时查询当前进程占用内存 (MB)
current_mem = get_current_memory_mb()

# 在处理完大批量图片后显式强制执行垃圾回收释放内存
force_garbage_collect()
```

## 4. 文件与加密工具

- `zip.py` / `zip_2_pwd_version.py`：支持将多文件打包并设置解压密码（常用于绅士资源与大文件的防吞外发）；
- `PDFEncrypt.py`：对生成的漫画或文档 PDF 实施标准权限加密；
- `random_str.py`：生成指定长度的高强度防碰撞随机密钥或会话 Hash。

善用这些框架内置小工具，不仅能让你的插件代码行数缩减一半，还能保证整个 Eridanus 项目风格一致、运行稳如泰山！
