# Stable Diffusion 本地与云端专业绘图

::: tip 免费接口与多后端并存
我们为 Eridanus 用户准备了若干免费接口（网关在 `http://api.apollodorus.xyz/`，可前往 QQ 群 `1050663831` 获取 API Key）。  
当前 Eridanus 绘图体系由 **[ComfyUI（Illustrious）](./ComfyUI工作流绘图.md)**、**Stable Diffusion WebUI** 与 **[GPTImage2（OpenAI 标准）](./GPTImage2绘画工坊.md)** 三大对等后端共同构成，共享同一套 [衣橱系统与人设锚点](./衣橱系统与人设锚点.md)。
:::

如果你本地或云端搭建了 **SD-WebUI / reForge** 服务，依然可以保留经典的 SD-WebUI 控制台操作（模型切换、LoRA 查看、WD14 识图反推、局部重绘与队列管理）。

- **核心代码**：`run/ai_generated_art/aiDraw.py`、`run/ai_generated_art/service/aiDraw.py`
- **配置文件**：`run/ai_generated_art/config.yaml` 的 `ai绘画` 区块

---

## 交互指令

### 基础生图与风格
- **`画 <提示词>`**：并发触发所有在 `ai绘画` 中开启的后端（`comfyui画图`、`sd画图`、`gptimage2画图`、`novel_ai画图` 与内置免费接口等；若开启 `gptimage2.接管sd: true`，则会转由 GPTImage2 生成）。
- **`dan <Tag>`**：Danbooru 英文 Tag 联想查询（例如 `dan 1girl`）。

### 图生图与重绘
- **`重绘 <提示词>`** / **`重绘`**：进入 SD-WebUI 图生图流程（注：若需调用 ComfyUI 以图生图，请使用 `cf重绘` / `comfy重绘` / `以图生图`，详见 [ComfyUI 工作流绘图](./ComfyUI工作流绘图.md)）。
- **`局部重绘 <提示词>`**：进入局部蒙版重绘。
- **`/clearre`**：清空当前缓存的重绘临时状态与底图。

### 模型控制与参数调整（需开启 `sd画图: true`）
- `ckpt` / `ckpt2 <模型名>`：查看 / 热切换底模
- `lora` / `sampler` / `scheduler`：查看可用 LoRA、采样器（如 `Euler a`）与调度器
- `setsd <参数>` / `setre <参数>`：动态修改文生图与重绘参数（如 `--w 1024 --h 1536 --steps 28`）

### 辅助工具与识图
- `tag`：WD14 识图反推英文标签
- `imginfo`：读取图片 PNG Info 元数据（Prompt / Seed / 参数）
- `interrupt` / `skip`：中止或跳过当前 SD 任务

---

## 核心配置片段一览（`run/ai_generated_art/config.yaml`）

```yaml
# 对话 Function Calling 与 QQ 空间默认绘图后端（可选: "comfyui", "sd", "gptimage2", "nano_banana", "novelai"）
文生图function_calling后端: "sd"

ai绘画:
  sd画图: false                      # SD-WebUI 后端开关（如使用 ComfyUI 请开启上方 comfyui画图）
  comfyui画图: true                  # ComfyUI (Illustrious) 开关
  gptimage2画图: false               # GPTImage2 同级并发生图开关
  novel_ai画图: false                # NovelAI 开关
  内置ai绘画1开关: true              # 免费聚合接口
  内置ai绘画2开关: true              # ModelScope NoobXL 免费生图

  sdUrl:
    - "http://api.apollodorus.xyz"   # 你的 SD-WebUI 地址或网关地址
  apikey: ""                         # 网关/WebUI API Key
  sd审核和反推api: ""                # WD14 反推插件地址（支持与 sdUrl 共用）
  sd默认启动模型: "waiIllustriousSDXL_v170.safetensors"
  反推和审核使用模型: "wd14-vit-v2-git"
  sd画图默认分辨率: "1280,1728"      # 宽,高（推荐 1200-1800 区间）
  sd最大分辨率: "1800,1800"
  sd队列长度限制: 6
  sd超时时间: 600
```

---

## 三大后端如何选择与搭配

- **追求极致二次元手绘线稿与开源自定义 LoRA**：推荐设 `文生图function_calling后端: "comfyui"` 并配置 [ComfyUI 工作流绘图](./ComfyUI工作流绘图.md)。
- **追求自然语言语义理解、多图编辑或省去本地部署**：推荐设 `文生图function_calling后端: "gptimage2"`，参见 [GPTImage2 绘画工坊](./GPTImage2绘画工坊.md)。
- **已有本地 SD-WebUI / reForge 实例**：将 `ai绘画.sd画图` 设为 `true` 并填好 `sdUrl` 即可。
- **QQ 空间配图与角色人设统一管理**：三者均直接读取 [衣橱系统与人设锚点](./衣橱系统与人设锚点.md) 与 `run/ai_generated_art/config.yaml`，无需重复配置。
