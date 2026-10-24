# 统一语音服务系统（TTS v2）

文字看多了是不是有点无聊？其实我也可以用好听的嗓音把话念给你听哦~

Eridanus 最新版本已彻底淘汰并移除了旧版 `run/ai_voice` 模块，全面统一升级重构为 **`run/tts_v2`（统一语音服务系统）**。它将多引擎语音合成、角色别名映射、自然日文翻译和动态热重载深度融为一体！

核心代码位于：`run/tts_v2/`  
配置文件位于：`run/tts_v2/config.yaml`

---

## 真正的群聊与私聊指令体系

代码在 `run/tts_v2/main.py` 中监听消息事件，支持以下丰富交互指令：

### 1. 查询可用角色列表
直接发送以下任意指令，即可快速获取当前系统加载的所有可用音色与快捷别名：
- `可用角色`
- `语音角色`
- `/可用角色`
- `/语音角色`

### 2. 统一通用发音指令：`/<发音人>说<文本>`
系统支持以任意合法发音人（或其别名）作为前缀快速调用语音合成：

| 指令格式 | 示例 | 说明 |
| :--- | :--- | :--- |
| `/<角色名>说<文本>` | `/natuki说今天天气真好呀` | 默认夏木声线 |
| `/<角色名>说<文本>` | `/Mari说Sensei，今天也要加油哦！` | 碧蓝档案 伊落玛丽声线 |
| `/<角色名>说<文本>` | `/米浴说哥哥大人，米浴会努力的！` | 赛马娘 米浴声线 |
| `/<角色名>说<文本>` | `/MoriCalliope说Sup dead beats` | Hololive 死神声线 |
| `/<角色名>说<文本>` | `/达尼亚说怎么啦，想我了吗？` | 兼容旧版达尼亚说指令 |

源码会智能识别斜杠与“说”字之间的角色候选名，自动匹配对应的 TTS 后端引擎并生成语音消息发送至聊天窗口。

---

## 强大的多发音引擎生态矩阵

`run/tts_v2` 内置支持了多套成熟的声音合成方案，涵盖数百位二次元经典声线：

### 1. 赛马娘 PrettyDerby（Bert-VITS2 直连引擎）
无需复杂中转，本地直连，提供 9 位人气赛马娘角色：
- `natuki`（夏木 / 默认声线）
- `米浴`（别名: `rice_shower`）
- `目白麦昆`（别名: `mejiro_mcqueen`）
- `真机伶`（别名: `curren_chan`）
- `待兼福来`（别名: `matikane_fukukitaru`）
- `待兼诗歌剧`（别名: `matikane_tannhauser`）
- `爱丽数码`（别名: `agnes_digital`）
- `优秀素质`（别名: `nice_nature`）
- `里见光钻`（别名: `satono_diamond`）

### 2. Hololive 虚拟主播（Bert-VITS2 直连引擎）
覆盖全组 51 位 Vtuber 声线（支持原名与常用缩写）：
- **EN 组 / Myth / Council / Advent**：MoriCalliope (`calli`), GawrGura (`gura`), NinomaeInanis (`ina`), TakanashiKiara (`kiara`), AmeliaWatson (`watson`), CeresFauna (`fauna`), OuroKronii (`kronii`), HakosBaelz (`baelz`), NanashiMumei (`mumei`) 等；
- **JP 组**：TokinoSora, SakuraMiko (`miko`), HoshimachiSuisei (`suisei`), MinatoAqua (`aqua`), UsadaPekora (`pekora`), NakiriAyame (`ayame`), HoushouMarine (`marine`), ShirakamiFubuki (`fubuki`), NekomataOkayu (`okayu`), InugamiKorone (`korone`) 等；
- **ID 组**：AyundaRisu, MoonaHoshinova, KureijiOllie, VestiaZeta 等。

### 3. 碧蓝档案 Blue Archive（Bert-VITS2 直连引擎）
收录基沃托斯 95 位学生角色（支持 `JP_角色名` 或直接输入角色名，大小写通用）：
- 如：`Mari` (玛丽), `Arona` (阿洛娜), `Hina` (日奈), `Yuuka` (优香), `Shiroko` (白子), `Aris` (爱丽丝), `Aru` (亚津子/阿露), `Hoshino` (星野), `Koharu` (小春), `Noa` (诺亚), `Saori` (纱织), `Miyako` (宫子), `Miyu` (美游) 等共 95 位。

### 4. 搞笑与整活音源：电棍 OTTO
基于活字印刷音源拼接，生动还原电棍鬼畜语调，适合搞笑、整蛊互动。

### 5. 经典声音克隆：GPT-SoVITS
支持自建或代理的 GPT-SoVITS 声音克隆服务，配备参考音频切片与精准情感复刻。

### 6. Apollodorus 云端语音网关 & 本地 VITS
提供统一云端在线备用通道，以及经典 `VITS-simple-api` 本地兼容支持。

---

## 自动多语言翻译引擎（`lang_type: JP`）

许多高质量日系音色模型在直接朗读中文汉字时容易发音怪异或吞字。  
TTS v2 创新引入了**全自动智能翻译层（`run/tts_v2/service/translator.py`）**：
- 当配置 `lang_type: "JP"` 时，用户输入的中文文本会在毫秒级由轻量 LLM 自动翻译成地道、自然、符合口语语感的日文假名与汉字；
- 随后再送入对应的日语音色引擎进行合成；
- API Key 自动复用 `mai_reply` 中的 `trigger_llm` 配置，无需额外付费或重复配置！

---

## 核心配置一览（`run/tts_v2/config.yaml`）

```yaml
tts: # 全局通用配置
  default_speaker: "natuki"   # 默认发音人（未指定角色时使用）
  length_limit: 150           # 最大单次合成字符长度上限（超长自动截断）
  lang_type: "JP"             # 目标发音语言（JP 会将中文自动翻译为自然日文）
  api_key: ""                 # 翻译/在线接口 API Key，留空则自动继承 mai_reply 中的配置

gpt_sovits:                   # GPT-SoVITS 专属配置
  api_base: ""                # 填入自建或代理服务地址（http://api.apollodorus.xyz/ 提供接口）
  api_key: ""                 # 留空=直连服务端；非空=经过API鉴权
  ref_audio_path: output/slicer_opt/output.wav_0009342720_0009558400.wav
  ref_text: "怎么啊？如果有你在也不放心，那就干脆给我也装个限制器或者炸弹呗。"
  speakers:
    - 达尼亚
  top_k: 15
  top_p: 1
  temperature: 1
  text_split_method: cut1
  speed_factor: 0.91

pretty_derby:
  speaker: "natuki"

holive:
  speaker: "MoriCalliope"

blue_archive:
  speaker: "JP_Mari"

otto:
  endpoint: "https://ottohzys.wzq02.top"

vits:
  speaker: "绫地宁宁"
  base_url: "http://127.0.0.1:5009"

apollodorus:
  base_url: "http://api.apollodorus.xyz/v1"
  api_key: ""
```

## 如果你想修改，应该改哪里？

- **如何与 MaiReply 聊天结合，让 Bot 说话自带语音？**
  - 打开 `run/mai_reply/config.yaml`，设置 `tts.voice_reply_probability: 30`（表示 30% 概率带语音发声），并配置你喜欢的 `speaker`（如 `natuki`、`Mari` 等）。系统采用惰性单例加载机制，TTS 配置更新后实时生效！
- **说话语速太快或者太慢？**
  - 调整 `gpt_sovits.speed_factor`！数值调大说话会更轻快利落，调小会显得更悠闲慵懒哦。
- **不想自动翻译成日文，想直接念中文？**
  - 将 `tts.lang_type` 设为 `ZH`，系统将直接朗读中文原句。
