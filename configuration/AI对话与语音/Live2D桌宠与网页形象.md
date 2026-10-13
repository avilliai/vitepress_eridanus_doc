# Live2D 桌面宠物与网页虚拟形象

想让你的看板娘真正“活”在桌面上或者浏览器里吗？    
Eridanus 内置了 **Live2D 联动系统**（位于 `run/live2d`），它不仅支持基于 Electron 的透明背景桌面宠物，还提供开箱即用的网页版实时交互窗口！    

---

## 核心亮点

1. **同源大脑**：    
   - 桌宠直接连接本地 `5007` 端口（WebUI 的 OneBot 反向 WebSocket 集线器），与你在 QQ、网页里的上下文和好感度完全打通。    
2. **口型同步（Lip-Sync）**：    
   - TTS 语音输出时，桌宠模型会根据音频动态计算音量与频谱，精准联动 Live2D 口型开合参数（如 `ParamMouthOpenY`）。    
3. **网页版交互面板**：    
   - 访问 `http://localhost:5007/live2dchat` 即可在任何浏览器端打开全功能的 2D 看板娘聊天界面！    

---

## 配置文件详解

配置文件位于 `run/live2d/config.yaml`：    

```yaml
enable: false             # 是否随 Eridanus 启动时自动开启桌宠窗口
webui_enable: true        # 是否开启浏览器访问网页桌宠（http://localhost:5007/live2dchat）
model_path: "data/yumi"   # 自定义模型文件夹（放你的 Live2D 模型文件）
model: "hiyori_pro_en"    # 默认内置模型
auto_install: true        # 首次启动若缺少 Electron 则自动通过 npm 国内镜像下载

chat:
  enable: true            # 是否在桌宠界面附带输入框

tts:
  enable: true            # 桌宠是否在本地同步播放语音
```

---

## 常用操作

- **群聊或私聊远程启动**：    
  - 发送 `/live2d on`：在托管机器人的主机屏幕上唤起桌宠窗口；    
  - 发送 `/live2d off`：关闭当前运行中的桌宠窗口。    


![Live2D 桌面宠物形象展示](/l2d.png)    
