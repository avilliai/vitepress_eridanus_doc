# Live2D 桌宠与网页形象

这个插件能让你的机器人拥有live2d二次元形象：不仅可以在 Windows/Linux 桌面以透明悬浮窗形态常驻陪伴，还能在浏览器打开专属的 Live2D 网页互动视窗，带着口型同步与你聊天哦！

核心代码位于：`run/live2d/main.py`  
配置文件位于：`run/live2d/config.yaml`

## 源码里真正支持的控制指令

- `/live2d on`：在群内或私聊发送，立即持久化保存配置并拉起桌面 Electron 桌宠进程。
- `/live2d off`：关闭并退出桌面桌宠悬浮窗。
- `/live2d status`：查询当前 Live2D 服务的运行状态（是否开启、当前加载模型等）。

*(注：以上指令受权限控制，默认为 Master 专属或受 `master_only` 控制)*

## 核心配置片段一览（`run/live2d/config.yaml`）

```yaml
enable: false                  # 桌面桌宠总开关（默认关闭，群内发送 /live2d on 会将其写入为 true）
webui_enable: true             # 网页版桌宠开关！开启后可通过浏览器直接访问
webui_password: "eridanus"     # 网页聊天访问凭据
master_only: true              # 纯桌宠模式是否仅限 Master 使用

model_path: "data/yumi"        # 自定义模型文件夹路径（优先生效，留空则回退到内置模型）
model: "hiyori_pro_en"         # 内置备用模型（位于 desktop/models/ 下）

auto_install: true             # 首次启动若缺少 node_modules 则自动运行 npm install
electron_mirror: "https://registry.npmmirror.com/-/binary/electron/" # 国内加速镜像
npm_registry: "https://registry.npmmirror.com/"

lip_sync_parameter_ids:         # Live2D 口型开合绑定参数
  - "ParamMouthOpenY"

chat:
  enable: true                 # 桌宠是否接入对话后端，实现直接打字或语音交互
```

## 如果你想做什么，应该改哪里？

- **不想装桌面客户端，只想在浏览器里看 Live2D？**
  - 保持 `webui_enable: true`，直接在浏览器访问 `http://127.0.0.1:5007/live2dchat`（端口与 WebUI 一致）就可以在网页里看到我啦~
- **想换成你自己喜欢的 Live2D 角色模型？**
  - 把解压好的模型文件夹放入 `data/` 下，然后在 `model_path` 填入对应的相对路径（如 `"data/my_live2d_model"`），重启桌宠就会自动加载新形象。
- **首次启动下载 Electron 慢卡住？**
  - 检查 `electron_mirror` 和 `npm_registry` 是否保持为 npmmirror 镜像源，保证国内网络环境下依赖可以顺畅拉取。
