# Live2D


实验性功能。动画播放尚且不完善。    
桌宠与webui共享后端，因而可调用大部分Eridanus能通过函数调用触发的功能
![l2d.png](/l2d.png)
## 启用

::: warning 记事本编辑
文件结构较为复杂，webui目前无法渲染。需要手动打开`Eridanus/run/live2d/config.yaml`
:::

打开后是这样，把第一个`false`改成`true`，其他的基本不用管。**改完重启bot**。
```yaml
enable: true             # 默认关闭。开启后会在桌面显示 Live2D 桌宠（或群内 /live2d on）
master_only: true          # 纯桌宠模式
model_path: data/yumi      # 自定义模型文件夹（相对项目根目录或绝对路径），优先生效。留空则用下方内置 model
model: hiyori_pro_en       # 内置模型：desktop/models 下的文件夹名（仅当 model_path 为空时使用）
auto_install: true         # 首次启用时若缺 node_modules 则自动执行 npm install（会下载 Electron）
electron_mirror: "https://registry.npmmirror.com/-/binary/electron/"  # Electron 二进制下载镜像（国内加速）
npm_registry: "https://registry.npmmirror.com/"                       # npm 源（国内加速）
lip_sync_parameter_ids:    # 口型参数 id（不同模型可能不同）
  - ParamMouthOpenY
chat:                      # 桌宠聊天：作为 WS 客户端接入 webui 的 /api/ws（与前端对话同源）
  enable: true             # 在桌宠窗口显示聊天输入框
webui:                     # webui 对话后端（OneBot 反向 ws 集线器）。桌宠对话直接连这里，等价于浏览器前端
  host: 127.0.0.1
  port: 5007




```
## 表情控制
我们项目群提供了免费中转，gpt-4o适合这一工作
```yaml
expression:                # 表情/动作控制：对话后用一个快速模型把回复判定为某种“情绪/场景”，再按下方索引变脸/播动作
  enable: true
  reset_delay_ms: 6000     # 变脸后过这么久(ms)恢复默认待机表情；<=0 表示不自动恢复
  model: gpt-4o-mini       # 响应迅速的小模型
  base_url: "http://apollodorus.xyz:8001/v1"             # 留空则复用 mai_reply 的 trigger_llm 端点
  api_key: ""              # 留空则复用 mai_reply 的 trigger_llm api_key

```
## 语音
目前只做了GPT-Sovits，自行配置。   
```yaml
tts:                       # 桌宠本地语音合成（GPT-SoVITS）：拿到文本后本地合成并播放，确保 100% 出声，
  enable: true             # false=不合成语音（只显示文字气泡）
  api_base: ""             # 留空=复用 tts_v2 的 api_base
  ref_audio_path: ""       # 留空=复用 tts_v2 的参考音频（服务端可访问的路径）
  ref_text: ""             # 留空=复用 tts_v2 的参考文本
```
## 纯桌宠模式使用(不接入QQ)
需要打开`Eridanus/run/common_config/basic_config.yaml`    
将ws_link的值设置为`""`
```yaml
adapter:
  name: "any"   #兼容性选项，如果用Lagrange，则必须填Lagrange，用其他onebot实现则不用动
  ws_client:   #机器人作为websocket客户端
    ws_link: ""  #bot的websocket请求地址
```