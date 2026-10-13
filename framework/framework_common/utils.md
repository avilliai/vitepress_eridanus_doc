---
prev:
  text: '项目架构与目录拓扑'
  link: '/framework/项目结构'
next:
  text: 'Redis 缓存管理器'
  link: '/framework/framework_common/RedisCacheManager'
---

# 框架公共工具库与 Util 全能门面

在写插件的时候，经常需要下载网络图片、把图片转 Base64 喂给大模型、打包加密 zip 文件、拼接多段音频、或者随机搞一个请求头……如果你每次都在插件里自己手写一遍 `requests` 或 `zipfile`，不仅容易踩内存泄露的坑，还会让代码变得臃肿不堪！

不要重复发明轮子啦！Eridanus 在 `framework_common/ToolKits/` 里为我们备好了一整套开箱即用的**瑞士军刀**——**`Util` 门面类**，以及配套的统一日志、内存管理与依赖热装工具！

---

## 一、全能瑞士军刀：`Util` 单例门面类

位于 `framework_common/ToolKits/util.py` 的 `Util` 类采用了经典的**外观模式（Facade）与单例模式**。它把分散在各处的文件、图像、网络、文本工具整合为统一的入口，并且所有子处理器均为**懒加载（Lazy Property）**，随用随实例化，性能极高！

### 1. `Util` 类的源码结构

```python
# 位于 framework_common/ToolKits/util.py

from typing import Optional
from .file import FileProcessor
from .image import ImageProcessor
from .network import NetworkProcessor
from .text import TextProcessor

class Util:
    _instance: Optional["Util"] = None

    def __new__(cls):
        """单例模式保证全局只存在一份门面对象"""
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._init_fields()
        return cls._instance

    @classmethod
    def get_instance(cls) -> "Util":
        return cls()

    @property
    def network(self) -> NetworkProcessor:
        """网络与 HTTP 相关工具"""
        if self._network is None:
            self._network = NetworkProcessor()
        return self._network

    @property
    def image(self) -> ImageProcessor:
        """图像编解码与转换工具"""
        if self._image is None:
            self._image = ImageProcessor()
        return self._image

    @property
    def file(self) -> FileProcessor:
        """文件处理、压缩与音频拼接工具"""
        if self._file is None:
            self._file = FileProcessor()
        return self._file

    @property
    def text(self) -> TextProcessor:
        """文本随机串生成与多源翻译工具"""
        if self._text is None:
            self._text = TextProcessor()
        return self._text
```

### 2. 标准调用范式
在任何插件代码中，只需要一行导入即可召唤全套武器库：

```python
from framework_common.ToolKits.util import Util

util = Util() # 直接实例化即可获取全局单例
```

---

## 二、四大子处理器 API 全解与实战

### 1. `util.network`：网络请求与下载核心 (`NetworkProcessor`)

封装了基于 `httpx` 的异步 HTTP 客户端，自带 UA 池和代理支持：

- **`util.network.random_headers()` -> `dict`**：
  随机生成仿 Chrome/Firefox/Safari 的高拟真 User-Agent 请求头，爬取防爬站点的利器。
- **快捷请求方法（开箱即用）**：
  - `await util.network.get(url, params=None, headers=None, cookies=None)`
  - `await util.network.post(url, data=None, files=None, headers=None)`
  - `await util.network.post_json(url, json=None, headers=None)`
- **`await util.network.download_file(url, path, proxy=None) -> str`**：
  异步流式下载大型文件（安装包、视频、音频），支持指定 Socks5/HTTP 代理，下载完成后返回本地保存绝对路径。

#### 实战调用：
```python
# 1. 抓取带随机 UA 的网页 JSON
headers = util.network.random_headers()
res = await util.network.get("https://api.example.com/data", headers=headers)
data = res.json()

# 2. 异步下载远程大文件并带本地代理
save_path = await util.network.download_file(
    url="https://example.com/sound.mp3",
    path="data/cache/sound.mp3",
    proxy="http://127.0.0.1:7890"
)
```

---

### 2. `util.image`：图像处理与转换核心 (`ImageProcessor`)

专为二次元表情包制作、生图和多模态大模型交互量身打造：

- **`await util.image.Image2Base64(url) -> str`**：
  支持直接传入网络 URL、本地路径或 Data URI，自动下载并编码为标准的 Base64 字符串（调用 Claude/GPT-4V 视觉模型时特别省事！）。
- **`await util.image.download_img(url, path=None, gray_layer=False, proxy=None, headers=None) -> str`**：
  下载图片并保存至目标路径；若 `gray_layer=True`，会自动通过 Pillow 将图片转为黑白二值化或灰度处理（适合打印或黑白漫画排版）。

#### 实战调用：
```python
# 将群友发的图片转为 base64 喂给视觉模型：
img_base64 = await util.image.Image2Base64(event.get("image")[0]["url"])

# 下载壁纸到本地：
local_img = await util.image.download_img(
    url="https://img.example.com/banner.jpg",
    path="data/banner.jpg"
)
```

---

### 3. `util.file`：文件压缩与音视频合并 (`FileProcessor`)

- **`util.file.sanitize_filename(name, replacement="_") -> str`**：
  自动剔除并替换 Windows/Linux 路径中的非法字符（如 `\ / : * ? " < > |`），防止文件名报错。
- **`util.file.compress_files(sources, output_dir, zip_name="archive.zip")`**：
  将单个文件或多个目录打包为标准 ZIP 归档。
- **`util.file.compress_files_with_pwd(sources, output_dir, zip_name, password)`**：
  **神仙功能！** 使用 `pyzipper` 与 AES-256 高强度加密打包 ZIP。在外发漫画、同人志或长文档时设置解压密码，能够 100% 免疫群管关键字扫描与拦截！
- **`util.file.merge_audio_files(audio_files: list, output_file: str) -> str`**：
  基于 `pydub` 无损合并音频文件列表（支持 `.wav`, `.mp3`, `.flac` 跨格式无缝拼接）。在多角色语音合成中常用于把不同角色的台词拼成一段连贯广播剧！
- **`await util.file.encrypt_pdf_file(input_path, output_path, password)`**：
  异步对 PDF 文档注入权限保护密码。

#### 实战调用：
```python
# 1. 安全打包绅士资源并上锁
util.file.compress_files_with_pwd(
    sources=["data/manga/chapter1", "data/manga/cover.jpg"],
    output_dir="data/output",
    zip_name="secret_package.zip",
    password="eridanus_yucca"
)

# 2. 拼接两段语音并发送
merged_wav = util.file.merge_audio_files(
    audio_files=["voice1.wav", "voice2.wav"],
    output_file="data/combined.wav"
)
await bot.send(event, Record(file=merged_wav))
```

---

### 4. `util.text`：随机字符与多源翻译 (`TextProcessor`)

- **`util.text.generate_random_str(length: int = 6) -> str`**：
  随机生成指定长度的高强度字母数字防碰撞字符串（用于验证码、一次性 Session ID 或临时文件名）。
- **`await util.text.translate(text, mode="ZH_CN2JA") -> str`**：
  内置多源智能容灾翻译！先走高速 API，遇限流自动无缝降级切换到备用翻译节点。在 NovelAI / Stable Diffusion 绘图插件中，群友输入的中文 Prompt 都是靠它一键译为地道二次元日文/英文的！

#### 实战调用：
```python
# 1. 生成一次性临时任务 ID
task_id = util.text.generate_random_str(8) # 例如 "a9Xk2L1m"

# 2. 将用户描述翻译为日文用于画图
jp_prompt = await util.text.translate("银发双马尾猫娘少女在星空下微笑", mode="ZH_CN2JA")
# 得到高质量翻译文本
```

---

## 三、框架核心基础设施工具

除了 `Util` 门面之外，框架还在 `framework_common/utils/` 下提供了三大系统级底座：

### 1. 统一高颜值彩色日志：`system_logger`

严禁在插件里直接裸写 `print()`！使用统一的 `get_logger` 可以获得带有时间戳、彩色等级标签以及按日自动切片保存的高颜值日志：

```python
from framework_common.utils.system_logger import get_logger

logger = get_logger("MyPlugin")

logger.info("常规运行日志信息喵~")
logger.warning("这是一条警告日志！")
logger.error("发生未捕获异常！", exc_info=True)  # 自动输出完整报错堆栈
```

### 2. 依赖自动静默热装：`install_and_import`

如果你写的插件需要用到第三方库（比如 `cloudscraper`, `pytesseract`），不想强迫每个用户去手动敲 `pip install`，可以使用它：

```python
from framework_common.utils.install_and_import import install_and_import

# 若检测到未安装，会自动调用国内阿里云镜像源静默安装并动态导入返回
cloudscraper = install_and_import("cloudscraper")
```

### 3. 内存健康与自动垃圾回收：`GCTool` 与 `MemoryMonitor`

面对长时间挂机、频繁生成大分辨率长图或跑 ComfyUI 的机器人，防止内存泄露至关重要：

```python
from framework_common.utils.GCTool import force_garbage_collect
from framework_common.utils.MemoryMonitor import get_current_memory_mb

# 实时查询当前 Python 进程物理内存占用 (MB)
current_mem = get_current_memory_mb()
logger.info(f"当前内存占用: {current_mem:.2f} MB")

# 在生成完大图或批量任务结束后，显式触发全量 GC 回收
force_garbage_collect()
```
