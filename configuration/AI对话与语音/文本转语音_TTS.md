# 文本转语音系统（TTS_v2）

光看文字怎么够生动？Bot 当然要有属于自己的个性化声音啦！    
Eridanus 采用基于 **GPT-SoVITS** 的高表现力语音合成系统 `run/tts_v2`，能够完美还原少女声线的轻快、撒娇、促狭与呼吸感。    

---

## 核心优势与架构

- **GPT-SoVITS v2 深度适配**：支持基于参考音频（Ref Audio）的一句话零样本声音克隆。    
- **智能文本切片**：内置多种断句策略（`cut1`、`cut5` 等），智能处理标点符号与语气助词，彻底告别机器人断句的机械感。    
- **音频缓存队列**：合成后的音频自动落盘缓存于 `data/voice/cache/`，相同回复秒级命中，极大节省服务端算力。    
- **双工作模式**：    
  - **伴随对话发声**：在 MaiReply 判定允许语音时，自动伴随文字输出发送语音消息条；    
  - **独立触发指令**：群友可以通过指令让机器人朗读指定内容。    

---

## 配置文件详解

配置文件位于 `run/tts_v2/config.yaml`：    

```yaml
gpt_sovits:
  api_base: "http://apollodorus.xyz:3529/tts"  # TTS 服务端接口地址
  api_key: ""   # 留空为直连，非空为带 Bearer 鉴权网关
  ref_audio_path: "output/slicer_opt/output.wav_0009342720_0009558400.wav" # 参考音频
  ref_text: "怎么啊？如果有你在也不放心，那就干脆给我也装个限制器或者炸弹喽。" # 参考音频文本
  speakers:
    - "达妮娅"   # 默认播音员
  top_k: 15
  top_p: 1.0
  temperature: 1.0
  text_split_method: "cut5" # 推荐切片算法
  speed_factor: 0.97        # 语速调节（0.9~1.0 最自然）
  media_type: "wav"
```

---

## 触发与使用指令

- **独立语音合成指令**（由 `run/ai_voice/text2voice.py` 提供）：    
  - `/说 <你想让机器人说的话>`    
  - 示例：`/说 赖哥快点去洗澡啦，水都放好了！`    


![Online VITS 语音引擎配置](/onlinevits.png)    
