# nano banana
谷歌最新发布的图像编辑模型
## 指令
```
#nano   #使用此命令开始绘画，并发送图片和文本
#ok     #发送文本和图片后，发送此命令以开始绘图
```
## 配置
配置文件路径`run/ai_generated_art/config.yaml`，webui中则为`ai绘画.config`
```
#后续我们将增加更多可选配置项
ai绘画:
  nano_banana_key: # 就是冲了米的gemini key。或是在https://openrouter.ai/google/gemini-2.5-flash-image-preview:free申请。
  -  ""   #可继续添加更多apikey
  原生gemini接口: false  #如果用gemini官方apikey，则打开此项，使用上面openrouter或其他openai标准的中转api则无需打开。
```
