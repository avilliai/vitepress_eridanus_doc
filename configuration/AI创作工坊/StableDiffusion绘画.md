# Stable Diffusion 专业绘图 (WebUI / API)    

支持接入本地或远程服务器部署的 Stable Diffusion WebUI 实例，支持 Checkpoint 切换、LoRA 调用、采样器调节以及图生图与重绘操作。    

---

![AI绘画与对话联动示意](/aiDrawAndChat.png)    

## 核心功能    

- **文生图 (Txt2Img)**：原生对接 SD API，可自由指定正面词与负面词。    
- **模型与 LoRA 动态管理**：支持在线查询服务器内的 Checkpoint 模型列表与 LoRA 权重，并支持在线指令换模。    
- **采样与调度器配置**：支持自由查询和切换 Sampler 与 Scheduler。    
- **AI 对话 Function Calling 深度联动**：在日常聊天中即可通过自然语言让 AI 自行画图。    

---

## AI 智能对话联动 (Function Calling)    

当开启 `mai_reply` 并且启用工具调用时，支持直接通过大模型调用以下函数：    

| 注册工具名称 | 对应功能说明 | 触发示例 |
| :--- | :--- | :--- |
| `call_text2img` | 文本生成图像（调用本地/远程 SD 或文生图后端） | *“帮我画一只戴耳机的粉发猫娘，坐在窗边看雨”* |
| `image_edit` | 图像修改与编辑重绘 | *“把这张图里的头发改成金黄色”* |

---

## 传统指令触发与使用示例    

在群聊中输入以下指令：    

### 1. 基础生图与重绘    
- **文生图**：`画 [提示词]`（例：`画 1girl, solo, cherry blossoms, 8k`）    
- **图生图 / 重绘**：发送 `重绘 [提示词]` 并附带参考图。    
- **局部重绘**：发送 `局部重绘` 进入蒙版编辑引导流程。    

### 2. 模型与参数管理    
- **查看模型列表**：发送 `ckpt` 列出服务器全部大模型。    
- **切换当前模型**：发送 `ckpt2 [模型名称或序号]`。    
- **查看 LoRA 列表**：发送 `lora` 列出可用 LoRA 权重。    
- **查看采样器与调度器**：发送 `sampler` 或 `scheduler`。    
- **中断当前任务**：发送 `interrupt`（中断当前排队生成的图像）或 `skip`。    

---

## 配置文件说明    

配置文件位于 `run/ai_generated_art/config.yaml`：    

```yaml
ai绘画:
  sd画图: true            # 是否开启 Stable Diffusion 指令
sd_api:
  url: "http://127.0.0.1:7860" # SD WebUI 开启 --api 后的监听地址
  username: ""           # WebUI Basic 鉴权用户名（如开启）
  password: ""           # WebUI Basic 鉴权密码
```
