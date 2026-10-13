# Stable Diffusion 本地与云端专业绘图

如果你有自己的本地显卡或者搭建好的 SD-WebUI 服务，那这就是最自由、可玩性最高的作画工坊啦！

支持模型切换、LoRA 查看、WD14 识图反推、局部重绘以及任务队列管理，简直就像一个全能的小控制台。

核心代码位于：`run/ai_generated_art/aiDraw.py`  
配置文件位于：`run/ai_generated_art/config.yaml` 的 `ai绘画` 区块

## 源码里真正支持的交互指令

### 基础生图与风格
- `画 <提示词>`：通用文生图（注意“画”后面必须有空格，例如 `画 1girl,whit hair`）
- `dan <Tag>`：Danbooru 英文 Tag 格式生图（例如 `dan 1girl, solo, twintails, smile`）

### 图生图与重绘
- `重绘 <提示词>` 或 `重绘`：进入图生图重绘流程，发送参考底图结合提示词重构
- `局部重绘 <提示词>`：进入局部重绘
- `/clearre`：清空当前已缓存的重绘临时状态与底图

### 模型控制与参数调整（需开启 `sd画图: true`）
- `ckpt`：查看 SD-WebUI 当前所有已安装的模型 Checkpoint 列表
- `ckpt2 <模型名>`：热切换底模（例如：`ckpt2 anime_model_v2.safetensors`）
- `lora`：获取 WebUI 中所有可用的 LoRA 列表与调用名
- `sampler`：查看支持的采样器列表（Euler a、DPM++ 2M 等）
- `scheduler`：查看调度器类型（Karras、Exponential 等）
- `setsd <宽,高>`：动态修改默认生图分辨率（例如 `setsd 1024,1536`）
- `setre <参数>`：动态设置重绘重绘幅度等参数

### 辅助工具与识图
- `tag`：WD14 识图反推！发送 `tag` 随后发送任意二次元插画，自动反推出高质量 Danbooru 标签
- `imginfo`：读取图片元数据 Exif / PNG Info，还原当初生图的完整 Prompt、Seed 和参数
- `interrupt`：立即中止当前正在生成的生图任务
- `skip`：跳过当前生图进度步数

## 核心配置片段一览（`run/ai_generated_art/config.yaml`）

```yaml
# Eridanus项目群提供的api站有免费的sd接口
ai绘画:
  sd画图: true                        # 是否开启 SD 本地生图对接
  sdUrl:                             # 你的 SD-WebUI API 监听地址
    - "http://127.0.0.1:7860"
  apikey: ""                         # WebUI 如设置了 auth 可填
  sd审核和反推api: ""                  # WD14 反推插件地址（可与 sdUrl 相同）
  sd默认启动模型: "waiIllustriousSDXL_v170.safetensors"
  反推和审核使用模型: "wd14-vit-v2-git"
  sd画图默认分辨率: "1024,1536"       # 默认生成分辨率：宽,高（中间不要留空格）
  sd最大分辨率: "1600,1600"           # 限制最大生成尺寸，防止爆显存
  sd队列长度限制: 6                   # 并发等待队列上限，防止刷屏
  sd超时时间: 600                     # 单张图生成超时时间（秒）
  内置ai绘画1开关: true                # 聚合接口免费生图
  内置ai绘画2开关: true                # ModelScope NoobXL 免费生图
```

## 如果你想修改，应该改哪里？

- **画图提示拒绝连接或者超时？**
  - 检查 SD-WebUI 启动时是否添加了 `--api` 和 `--listen` 参数，并在 `sdUrl` 列表里填上正确的 IP 和端口（例如 `http://127.0.0.1:7860`）。
- **生成图片老是超显存（CUDA out of memory）？**
  - 把 `sd画图默认分辨率` 调小一些（例如 `"832,1216"` 或 `"512,768"`），并在启动 SD 时开启 `--medvram` 或 `--xformers` 加速。
# function calling
sd还可以用来让bot发空间，以及随时向你发一张可爱的“自拍”哦~
