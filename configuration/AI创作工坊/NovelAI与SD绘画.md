# NovelAI 与 Stable Diffusion 绘图

想要在群里直接召唤高质量的二次元大作吗？    
Eridanus 内置了完善的绘图分发矩阵（位于 `run/ai_generated_art`），支持 NovelAI V3/V4 直连、Stable Diffusion WebUI / ComfyUI 后端，并附带多重鉴黄与图片安全审核。    

---

## 核心功能与画图模式

1. **NovelAI V3 / V4 高清二次元生成**：支持官方及中转 API，精准识别各类动漫角色与画风 Tag。    
2. **Stable Diffusion 本地/远程生成**：支持切换 Checkpoint 模型、调整采样步数与 CFG Scale。    
3. **图生图与局部重绘**：在既有画面基础上迭代，修复肢体细节或变换姿势服装。    
4. **内置图片审核**：自动调用 SightEngine 或本地图像鉴黄过滤敏感内容，安全防炸群。    

---

## 真实指令与用法

注意！所有指令均严格对齐 `run/ai_generated_art/aiDraw.py`：    

- **通用画图**：    
  - `画 <提示词/Tag>`    
  - 示例：`画 1girl, white hair, cat ears, highly detailed`    
- **NovelAI 快捷绘图**：    
  - `n4 <Tag>`：使用 NovelAI V4 模型极速生图。    
  - `n3 <Tag>`：使用 NovelAI V3 模型生图。    
- **Danbooru 标签辅助**：    
  - `dan <角色名/关键词>`：自动检索 Danbooru 热门标签并辅助生图。    
- **图生图与重绘**：    
  - 发送 `重绘` 或 `重绘 <参数>`，并在后续交互中发送垫图；    
  - `n4re <Tag>` 或 `n3re <Tag>`：NovelAI 专属图生图；    
  - `局部重绘 <参数>`：圈定特定区域进行局部重绘。    
- **模型切换（仅 SD 模式）**：    
  - `setsd <模型名称>`：切换 SD 基底模型。    
  - `ckpt2 <模型名称>`：快捷切换次级权重。    


![AI 生图与对话互动效果](/aiDrawAndChat.png)    

![生图参数示例](/ai_draw/args.png)    
