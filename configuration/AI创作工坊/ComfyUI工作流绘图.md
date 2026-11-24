# ComfyUI 工作流绘图（Illustrious）

::: tip 免费算力网关接入
我们为 Eridanus 用户提供可直连的云端 ComfyUI api：  
- **获取 API Key**：前往开发 QQ 群 `1050663831` 在网关面板申请 `sk-` 密钥  
- **网关地址**：`http://api.apollodorus.xyz/comfyui`（或直接填写 `http://api.apollodorus.xyz`）
:::

Eridanus 已将 ComfyUI 默认底模切换为二次元光辉系列 **WAI-NSFW-Illustrious v17.0（SDXL）**，并原生支持与 [衣橱系统](./衣橱系统与人设锚点.md) 联动、`<lora:模型名:权重>` 自动提取串联、`pixel_shuffle` 加密图像本地无损解密，以及对等用于自然对话生图和 QQ 空间动态配图。

- **核心代码**：`run/ai_generated_art/service/comfyui_drawer.py`、`run/ai_generated_art/service/prompt_optimizer.py`
- **配置文件**：`run/ai_generated_art/config.yaml` 的 `comfyui` 与 `ai绘画` 区块

---

## 交互指令

### 1. 群聊文生图
- **`画 <描述或关键词>`**：当开启 `ai绘画.comfyui画图: true` 时，会调用 ComfyUI 并行生图。
- **自然对话 Function Calling**：聊天时让 Bot 画图或自拍，若 `文生图function_calling后端: "comfyui"`，将自动通过 `text2img` 走 ComfyUI 并注入衣橱角色锚点、当前着装与画风 LoRA。

### 2. ComfyUI 专属以图生图（img2img）
支持 **图文同发**、**引用带图消息回复** 或 **先发指令再发底图**：
- **`cf重绘 <修改需求>`** / **`comfy重绘 <修改需求>`**
- **`cf以图生图 <修改需求>`** / **`comfy以图生图 <修改需求>`**
- **`以图生图 <修改需求>`** / **`图生图 <修改需求>`**
- *(当 `文生图function_calling后端: "comfyui"` 时，额外支持 `重绘`、`垫图` 前缀；为避免与传统 SD `重绘` 指令重叠，推荐优先使用 `cf重绘` / `comfy重绘`。)*

指令后的中文需求会经过 `optimize_prompt_for_img2img` 自动转译为纯英文 Danbooru Tag，并自动评估推荐 `denoise` 重绘幅度（`0.2~0.85`，默认 `0.65`）。

---

## 核心配置一览（`run/ai_generated_art/config.yaml`）

### 方式 A：使用项目网关（推荐，免部署零门槛）
```yaml
文生图function_calling后端: "comfyui"

comfyui:
  url: "http://api.apollodorus.xyz/comfyui"   # 或直接填 http://api.apollodorus.xyz
  apikey: "sk-xxxxxxxxxxxxxxxxxxxxxxxx"        # 网关 API Key（请求头自动附带 Bearer Token）
  comfyui画图: true
  default_ckpt: "waiIllustriousSDXL_v170.safetensors"
  clip_skip: -2
  default_lora: "DeniaV1-Nuclear1811-IL.safetensors"
  default_lora_strength: 0.3
  fixed_loras: []                              # 留空时由衣橱 art_anchor 中的 <lora:...> 自动串联
  default_steps: 28
  default_cfg: 5.5
  default_sampler: "euler_ancestral"
  default_scheduler: "normal"
  default_width: 1280
  default_height: 1728
  decrypt_encrypted_image: true
  decrypt_password: "1234"
```

### 方式 B：直连自建 ComfyUI
将 `comfyui.url`（兼容 `base_url` 字段）设为你的 ComfyUI 地址（如 `http://127.0.0.1:8188` 或 Cloudflare Tunnel URL），`apikey` 留空即可。

### 可选进阶：大模型控制生图
将 `comfyui.主模型控制生图` 设为 `true` 后，可利用 `llm_config`（留空默认复用 `core_reply` 主模型）自动优化英文 Tag、挑选适配的 LoRA 与采样参数，同时保留衣橱的防畸变负面约束。

---

## 常见问题排查

1. **网关返回 401 / 429 报错**
   - 检查 `comfyui.apikey` 是否填写正确、是否以 `sk-` 开头，或今日 ComfyUI 配额是否已用完（网关仅在 `POST /prompt` 提交生图时扣减次数，轮询 `/history` 与下载 `/view` 不消耗配额）。
2. **自定义采样器写成 `euler_a` 报错**
   - ComfyUI 节点只识别全称 `euler_ancestral`（它与 SD WebUI 的 `Euler a` 效果完全一致），请勿填成 `euler_a`。
3. **传回马赛克 / 像素打乱图片**
   - 说明服务端启用了 `pixel_shuffle` 防和谐加密，请确认 `decrypt_encrypted_image: true` 且 `decrypt_password` 与服务端一致（默认 `"1234"`）。
