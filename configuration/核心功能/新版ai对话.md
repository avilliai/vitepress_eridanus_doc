# 新版ai对话

::: info 提示   
鉴于旧版配置过于复杂，且效果不佳，我们重构了ai对话功能，新的配置方式更为简单，且兼容性更好。     
这些是你需要关注的配置项。  

我们的项目群[低价卖钩子篮子转租二手批发(4群)](https://qm.qq.com/q/4iD3sVJNZe) 为用户提供了免费的第三方中转服务，如有需要可前往获取。  
:::

    
配置文件在webui中为`mai_reply 新版ai对话.config`，在项目文件夹中为`run/mai_reply/config.yaml`。
```yaml

enable: True  # 开启后将自动禁用旧版ai回复
llm:
  provider: openai  #接口类型
  stream: true   # 是否开启流式回复（需要模型支持）
  func_calling: true  # 是否开启函数调用功能（需要模型支持）
  openai:
    api_keys:
      - xxxx
    model: gemini-2.5-pro
    base_url: http://apollodorus.xyz:8080/v1   #可以去我们的开发群1050663831获取免费apikey。
    temperature: 1.1
    max_tokens: 1024
    enable_official_sdk: false   # false=直接发post，true=用openai sdk
  gemini:
    api_keys:
      - YOUR_GEMINI_API_KEY
    model: gemini-2.0-flash-001
    base_url: https://generativelanguage.googleapis.com
    temperature: 1.0
    max_output_tokens: 1024

trigger:  # 基础触发相关配置
  at_trigger: true  #艾特触发
  prefix:     # 前缀触发（列表）
    - ""     # 空字符串=禁用
  private_trigger: true   # 私聊直接触发
  random_reply_probability: 3   # 概率触发（0=关闭，1-100=概率）
trigger_llm:   #ai判断是否触发
  enable: true
  api_key: ""
  base_url: "http://apollodorus.xyz:8080/v1"   # 可以去我们的开发群1050663831获取免费apikey。
  model: "gpt-4o-mini"                # 填入你用于判断的廉价/快速模型
  stream: True
  whitelist_enabled: true  # 是否启用白名单模式，启用后只有在白名单中的群聊才会触发ai回复
  whitelist:
    - 1050663831

persona:  # 人设
  name: ""  # 角色名（可选，留空则读取默认配置
  system_prompt: ""   #系统提示词（留空则使用默认角色卡内容）建议在角色卡里写好system prompt，这里留空即可。
  chara_file: "猫娘.txt"  #角色文件名，放在data/system/chara文件夹内(目前支持txt,json,酒馆角色卡(图片))

```