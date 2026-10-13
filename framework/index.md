---
next:
  text: '项目架构与目录拓扑'
  link: '/framework/项目结构'
---

# Eridanus 架构与进阶开发
 
欢迎来到 Eridanus 的开发文档！如果你不仅满足于使用现成的 50+ 个功能插件，而是想自己动手编写强大的业务插件、深度改造 MaiReply 人格、或者接入 ComfyUI 专属工作流，那么本章就是你的大本营啦！

---

## 🌟 架构指引全景

在左侧侧边栏中，我们为你梳理了清晰的三层递进路线：

1. **🛠️ Eridanus 开发者 SDK (`/sdk/`)**：
   - 面向初学者与轻量插件作者，基于独立解耦的 `developTools`，10 秒即可写出一个具备事件监听、消息回复与群管控制的轻量 Bot。
2. **🧱 框架核心与进阶架构 (`/framework/`)**：
   - 深入 Eridanus 核心骨架，包含完整的模块拓扑树、`YAMLManager` 0.3s 防抖配置热重载、生命周期与协程自启、`ExtendBot` 三维黑白名单过滤、以及 `dynamic_imports` + `function_declarations` 的 Function Calling 调度体系。
3. **🧰 公共服务与实战库 (`/framework/framework_common/`)**：
   - 包含面向插件开发者的开箱即用军火库：统一日志系统 `system_logger`、动态依赖热装 `install_and_import`、Redis 高性能缓存、`manshuo_draw` 声明式画板以及 ComfyUI API 工作流对接。

---

## 🚀 开启你的开发之旅

从这里开始探索吧：
- **[👉 查看项目架构与目录拓扑](/framework/项目结构)**
- **[👉 了解 Config 配置管理对象与热重载](/framework/config对象)**
- **[👉 编写你的第一个进阶插件](/framework/first_plugin)**
