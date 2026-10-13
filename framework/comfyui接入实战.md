# ComfyUI 图像工作流深度接入实战

（轻挽衣袖，眼神中透着自信与专注）如果说 WebUI 的 SD 绘图是老老实实按模子烤蛋糕，那 ComfyUI 就是随心所欲拼装魔法回路的顶级工坊！无论是高精度的 ControlNet、FLUX 极速渲染、还是多重二次元 LoRA 叠加，只要通过 API 工作流，都能无缝接入 Eridanus！

本篇实战将结合源码，手把手教你如何将 ComfyUI 的节点图导出为 API 并由机器人驱动生图。

---

## 核心接入流程三步法

1. **导出 API 工作流**：在 ComfyUI 界面将节点网格导出为纯 JSON API 描述文件；
2. **参数变量化**：将提示词、随机种子、长宽尺寸转换为 Python 可动态注入的插槽；
3. **框架接口调用**：通过 WebSocket 与 HTTP 轮询调度任务并回传群聊。

---

## 第一步：从 ComfyUI 导出 API 工作流

在 ComfyUI 网页界面中：
1. 点击右上角或设置面板，开启 **“Enable Dev mode Options”（启用开发者模式选项）**；
2. 此时控制面板会出现 **“Save (API Format)”（保存为 API 格式）** 按钮；
3. 点击导出，你会得到一个纯节点字典结构的 `.json` 文件。

以经典采样工作流为例，导出的节点片段如下：
```json
{
  "3": {
    "inputs": {
      "seed": 156680208700286,
      "steps": 20,
      "cfg": 8,
      "sampler_name": "euler",
      "scheduler": "normal",
      "denoise": 1,
      "model": ["4", 0],
      "positive": ["6", 0],
      "negative": ["7", 0],
      "latent_image": ["5", 0]
    },
    "class_type": "KSampler"
  },
  "6": {
    "inputs": {
      "text": "1girl, solo, anime, masterpiece, best quality",
      "clip": ["4", 1]
    },
    "class_type": "CLIPTextEncode"
  }
}
```

---

## 第二步：在插件中动态注入生图参数

在 Python 插件中，读取该 JSON 模板并修改关键节点的 `inputs`：

```python
import json
import random
import httpx
import websockets

def build_workflow(prompt_text: str, negative_text: str, width: int = 832, height: int = 1216):
    with open("data/comfyui_templates/sdxl_workflow_api.json", "r", encoding="utf-8") as f:
        workflow = json.load(f)
        
    # 动态注入正面提示词（节点 6）
    workflow["6"]["inputs"]["text"] = prompt_text
    # 动态注入负面提示词（节点 7）
    workflow["7"]["inputs"]["text"] = negative_text
    # 动态随机种子（节点 3）
    workflow["3"]["inputs"]["seed"] = random.randint(1, 10**14)
    # 动态修改画幅（节点 5）
    workflow["5"]["inputs"]["width"] = width
    workflow["5"]["inputs"]["height"] = height
    
    return workflow
```

---

## 第三步：调度 ComfyUI 任务与图片回传

通过 ComfyUI 标准接口提交 Prompt 并等待结果：

```python
from developTools.message.message_chain import MessageChain
from developTools.message.message_components import Image, Text, At

COMFYUI_HOST = "127.0.0.1:8188"

async def generate_and_send(bot, event, user_prompt: str):
    prompt_workflow = build_workflow(user_prompt, "lowres, bad anatomy, bad hands, text, blurry")
    
    await bot.send(event, "正在连接 ComfyUI 算力工坊，请稍候片刻喵~ 🎨")
    
    async with httpx.AsyncClient() as client:
        # 1. 提交任务队列
        res = await client.post(
            f"http://{COMFYUI_HOST}/prompt",
            json={"prompt": prompt_workflow}
        )
        prompt_id = res.json()["prompt_id"]
        
        # 2. 轮询历史记录等待生成完成
        while True:
            await asyncio.sleep(2)
            hist_res = await client.get(f"http://{COMFYUI_HOST}/history/{prompt_id}")
            hist_data = hist_res.json()
            if prompt_id in hist_data:
                # 提取输出图片文件名
                outputs = hist_data[prompt_id]["outputs"]
                # 遍历找到 SaveImage 节点
                for node_id, output in outputs.items():
                    if "images" in output:
                        img_info = output["images"][0]
                        filename = img_info["filename"]
                        subfolder = img_info.get("subfolder", "")
                        
                        # 拼接完整图片下载地址
                        img_url = f"http://{COMFYUI_HOST}/view?filename={filename}&subfolder={subfolder}&type=output"
                        
                        # 回发群聊
                        await bot.send(event, MessageChain([
                            At(qq=event.sender.user_id),
                            Text("
✨ 你的 ComfyUI 魔法画作已经渲染完成啦！"),
                            Image(file=img_url)
                        ]))
                        return
```

按照这套标准模板，无论是换脸、扩图、高清修复还是视频生成模型，都能像行云流水般接入你的 Eridanus 机器人！
