# AI图片甄别
检查图片是否为ai生成
## 指令
```yaml
ai图检测  #然后发送图片
#或者
ai图检测[图片] #在发送时带上图片
```
## 进阶——函数调用
ai图片检测支持函数调用，当config/api.yaml配置了对话模型并启用了函数调用
```yaml
llm:
  func_calling: True #是否开启函数调用功能
```
你可以不遵循特定指令格式
```yaml
在对话包含图片时，要求bot检测是否为ai生成即可。
```
## 配置方式
`config/api.yaml`
```yaml
sightengine:       #ai创作图片鉴别，自己去申请https://dashboard.sightengine.com/api-credentials
  api_user: ''
  api_secret: ''
```
自行注册并获取api_user和api_secret。