# ai对话
机器人的核心功能。  
Eridanus的大部分功能支持function calling，即ai会在对话中根据用户需求触发相应功能。  
但**函数调用效果取决于模型本身的能力以及上下文(含人设)，我们并不能对你使用的各厂商提供的模型质量做任何保证，亦无法干涉你的上下文内容。**      
如果你发现你接入的模型效果差，请向你的模型服务提供商反馈，或尝试更换其他模型，此问题不属于Eridanus项目范畴。          
## 触发方式
群聊内：`@bot 你好`  
私聊：`你好`  
前缀触发  
cd持续触发  
算法触发  
概率触发  
## 相关命令
### 清理对话
```yaml
/clear
/clear@某人      # 主人功能
/clearall      # 主人功能
/clear group
```
如开启函数调用，可直接告诉bot【清理当前对话】  
master也可使用【清理所有人的对话记录】之类的话来清理所有人的对话记录。
### SillyTavern角色卡切换
data/system/chara中存放了多个角色模板，你可以继续添加(已兼容txt,json,酒馆角色卡(图片格式))
```yaml
/查人设    #预期返回类似 派蒙.txt 猫娘.txt 这样的文件名列表
/切人设 {角色文件名}  #比如 /切人设 派蒙.txt
/全切人设 {角色文件名}  #切所有用户的人设，主人功能
# 可以使用/切人设 0或/全切人设 0来恢复到默认人设
```
### 函数调用
bot支持通过【函数调用】，实现更灵活的指令触发。  
以书籍搜索为例
> 搜书的原指令为： 搜书{书籍名/作者名} #如  搜书资本主义与现代社会理论  
> 当你开启【函数调用】后，可以通过下面的方式艾特bot触发，不必再拘泥于特定的指令格式。  
> 比如 @bot 帮我找找资本主义与现代社会理论这本书  
> 或者 @bot 资本主义与现代社会理论这本书怎么样  

其他功能同理
## 配置文件
### 认识配置文件
不建议直接编辑配置文件，除非你熟悉yaml语法，webui是一个合格的yaml编辑器，远比你自行编辑配置文件更加方便、安全。  
自己乱改出问题自己解决。    
文件来源`run/ai_llm/config.yaml`它在webui中的名称为`AI LLM Plugin.config`
```yaml
#这里可能和仓库内文件有差异，但关键配置项会在这里讲明白。
llm:
  model: default #选择使用的模型大类。default为自带免费模型，无函数调用，可选openai、gemini。
  system: "你现在是一只猫娘，你的名字是{bot_name}，我的名字是{用户}，是你的主人。注意，你需要在回复时避免使用markdown语法。" #修改后要用【/全切人设 0】(不要带括号，不要带艾特，在群里发)为所有人刷新。
  chara_file_name: 猫娘.txt   #system为""时生效 默认启动的人设文件名，在data/system/chara文件夹内(目前支持txt,json,酒馆角色卡(图片))
  
  func_calling: True  #开启函数调用功能
  表情包发送: true      #记录master发送的表情包并在回复时根据上下文发送。
  单次发送表情包数量: 1  #单次发送最大表情包数量
  联网搜索: false      #官方版本联网搜索，与函数调用不可同时开启
  联网搜索显示原始数据: True   #此处联网搜索基于函数调用实现(非官方)，与上面的联网搜索不同，所以可以同时使用函数调用和实现联网搜索。
  读取群聊上下文: true  #开启上下文读取功能，可读取群聊历史消息，并根据上下文进行回复。
  可获取的群聊上下文长度: 50 # 仁济模式开算法回复务必开上下文
  prefix: #可以用于触发bot的指令前缀
    - "测试机"   #测试机你今天吃饭了吗
    - "."       #.你今天吃饭了吗
  aiReplyCore: True   #请不要关闭此项
  enable_proxy: False
  max_history_length: 40 #机器人记忆长度

  仁济模式:
    随机回复概率: 0  #随机回复概率，0-100，0为不随机。
    算法回复:
      enable: false
      相似度阈值: 30
      频率阈值: 15
      消息列表最小长度: 10
      信息熵阈值: 2.0
      
  Quote: False     #回复时引用
  focus_time: 10    #单次触发对话后持续有效时间
  语音回复几率: 30
  语音回复附带文本: True
  recursion_limit: 10                  #对话模型最大递归深度，出错时自动递归。
  auto_clear_when_recursion_failed: True #对话模型递归失败时自动清除历史记录。
  openai:          #兼容所有openai标准接口。https://platform.openai.com/docs/overview
    enable_official_sdk: True   #是否使用官方sdk，如果不使用，则为直接发送post请求。
    api_keys:   #继续像这样添加apikey
      - YOUR_API_KEY_1
    model: deepseek-reasoner
    quest_url: https://api.deepseek.com   #如使用官方sdk，则只填base_url，否则填完整url。
    temperature: 1.3
    max_tokens: 2048
    CoT: True               #显示思维链
    使用旧版prompt结构: false  #部分模型需要使用旧版prompt结构
  gemini:         #https://ai.google.dev/
    api_keys:  #继续像这样添加apikey
      - YOUR_API_KEY_1
    model: gemini-2.0-flash-001
    base_url: https://generativelanguage.googleapis.com #后面的/v1/beta什么的会自动填充
    temperature: 0.7
    maxOutputTokens: 2048
  腾讯元器:     #极其不建议用，腾子搞得玩意稀烂，而且不支持函数调用。
    智能体ID: ""
    token: ""
core:
  ai_reply_group: 0    #群内ai对话所需权限等级
  ai_reply_private: 0  #私聊ai对话所需权限等级
  ai_change_character: 0  #ai更换角色所需权限等级
  ai_token_limt: 0 #不限制ai对话token所需权限等级
  ai_token_limt_token: 10000 #一般用户限制ai对话token数量
```
### 模型与函数调用
```yaml
llm:
  func_calling: True #是否开启函数调用功能
```
函数调用需要你使用的模型支持才能用，default模型不支持函数调用，所以我们建议你自行配置其他模型。
## gemini配置方式
为什么是gemini  
gemini免费，限额足量且每日刷新，模型支持函数调用和联网搜索。  
### 1、获取gemini apikey
[先获取Gemini apikey](https://ai.google.dev/tutorials/setup?hl=zh-cn) (获取过程需要开启代理，打不开/地区不可用就是你机场不行。)   
文件来源`run/ai_llm/config.yaml`它在webui中的名称为`AI LLM Plugin.config`
```yaml
#这里省略了其他配置项，不代表你可以随便删除其他配置项。
llm:
  model: gemini #选择使用的模型大类。
  system: "你现在是一只猫娘，你的名字是{bot_name}，我的名字是{用户}，是你的主人。"
  enable_proxy: False
  func_calling: True   #建议开启
  gemini:         #https://ai.google.dev/
    api_keys:
      - YOUR_API_KEY_1   #这里填入你的apikey，有几个填几个，多key填写示例如下。
      - YOUR_API_KEY_2
    model: gemini-2.0-flash-001
    base_url: https://generativelanguage.googleapis.com #后面的/v1/beta什么的会自动填充
```
### 2、配置正向代理/反向代理(二选一)
只配置apikey，但不配置proxy是不行的。
#### 反向代理
反向代理配置难度较低，建议使用。    
> 2025.8.14，目前Eridanus用户数量不断增长，我个人搭建和提供的反代明显已经不够用了。
> 建议根据下面的教程自行搭建反代，一键搭建没啥难的。

[反代搭建教程](https://simonmy.com/posts/%E4%BD%BF%E7%94%A8netlify%E5%8F%8D%E5%90%91%E4%BB%A3%E7%90%86google-palm-api.html)     

我们为用户提供了一些反代，在群公告。但由于用户体量庞大，不保证所有人都能用上，因此仍建议自行搭建。     
[qq3群](https://qm.qq.com/q/hjhSSnlBDi)       
[qq4群](https://qm.qq.com/q/xgT88qQOWG)   
```yaml
#省略了其他配置项，不代表你可以随便删除其他配置项。
llm:
  model: gemini 
  enable_proxy: False
  gemini:
    base_url: https://xxxxxx.netlify.app  #填写反代地址
```
#### 正向代理
取决于你自己的代理软件，我不能给你一个准确答案。如果你看不懂就老老实实用反代。  
文件来源`run/ai_llm/config.yaml`它在webui中的名称为`AI LLM Plugin.config`    
```yaml
#省略了其他配置项，不代表你可以随便删除其他配置项。
llm:
  enable_proxy: True 
```
文件来源`run/common_config/basic_config.yaml`它在webui中的名称为`基础配置.config`
```yaml
proxy:
  http_proxy: "http://127.0.0.1:10809"  #本地代理软件的的http代理端口。
```
### 3、函数调用与联网搜索
并非所有模型都支持这两个功能。在[gemini](https://ai.google.dev/gemini-api/docs/models/gemini?hl=zh-cn#gemini-2.0-flash) 查看所有模型与模型对应能力
你可以看到类似下面的内容
#### Gemini 2.0 Flash

Gemini 2.0 Flash 提供新一代功能和增强型功能，包括卓越的速度、原生工具使用、多模态生成以及 100 万个 token 的上下文窗口。
#### 模型详情

| 属性        | 说明                                                                                                                                           |
| --------- |----------------------------------------------------------------------------------------------------------------------------------------------|
| 模型代码      | `models/gemini-2.0-flash-001`                                                                                                                |
| 保存支持的数据类型 | **输入源**：音频、图片、视频和文本，**输出**：音频（即将推出）、图片（即将推出）和文本                                                                                              |
| 令牌限制      | **输入令牌限制**：1,048,576，**输出令牌限制**：8192                                                                                                         |
| 速率限制      | 2,000 RPM，4,000,000 TPM                                                                                                                      |
| 功能        | **函数调用**：支持，**代码执行**：支持，**搜索**：支持                                                                                                            |
| 版本        | 如需了解详情，请参阅[模型版本模式](https://ai.google.dev/gemini-api/docs/models/gemini?hl=zh-cn#model-versions)。最新电子邮件的接收日期：`gemini-2.0-flash-001` |
| 最新更新      | 2025 年 2 月                                                                                                                                   |
| 知识截止分数    | 2024 年 8 月                                                                                                                                   |

**你可以看到，它支持函数调用和联网搜索**。但这里需要注意，**函数调用和联网搜索不能同时开启，否则两个都没法用**。

于是我们得到了最终配置文件
```yaml
#此处省略其他配置项，不代表你可以随便删除。
llm:  
  model: gemini  
  system: "你现在是一只可爱的猫娘，你的名字是{bot_name}，现在与你对话的人的名字是{用户}。"  
  func_calling: true #是否开启函数调用功能  
  联网搜索: false   #官方版本联网搜索，与函数调用不可同时开启  
  联网搜索显示原始数据: true   #此处联网搜索基于函数调用实现。  
  enable_proxy: true   #正向/反向代理配置不再赘述
  gemini:         
    api_keys:  
      - 你的key
    model: gemini-2.0-flash-001  #模型代码中的模型名称
    base_url: https://generativelanguage.googleapis.com #正向/反向代理配置不再赘述
```
文件来源`run/common_config/basic_config.yaml`它在webui中的名称为`基础配置.config`
```yaml
proxy:
  http_proxy: "http://127.0.0.1:10809"  #本地代理软件的的http代理端口。
```
或
```yaml
#此处省略其他配置项，不代表你可以随便删除。
llm:  
  model: gemini  
  system: "你现在是一只可爱的猫娘，你的名字是{bot_name}，现在与你对话的人的名字是{用户}。"  
  func_calling: true #是否开启函数调用功能  
  联网搜索: false   #官方版本联网搜索，与函数调用不可同时开启  
  联网搜索显示原始数据: true   #此处联网搜索基于函数调用实现。  
  enable_proxy: false   #正向/反向代理配置不再赘述
  gemini:         
    api_keys:  
      - 你的key
    model: gemini-2.0-flash-001  #模型代码中的模型名称
    base_url: 反代地址 #正向/反向代理配置不再赘述
```
## openai接口标准模型配置方式
文心、讯飞星火、chatglm、豆包、kimi都可以使用此配置方式  
兼容openai接口标准的模型配置方式都是大差不差，每个都写就是纯纯浪费时间，接下来教程以deepseek为例，希望你能够举一反三。  
如需配置代理，请参照上文gemini
### 接入deepseek
在[deepseek文档](https://api-docs.deepseek.com/zh-cn/)我们可以看到
```yaml
DeepSeek API 使用与 OpenAI 兼容的 API 格式，通过修改配置，您可以使用 OpenAI SDK 来访问 DeepSeek API，或使用与 OpenAI API 兼容的软件。
```
|PARAM|VALUE|
| --- | --- |
|base_url|https://api.deepseek.com|
|api_key|apply for an [API key](https://platform.deepseek.com/api_keys)|

**得到的信息如下**
- 1.deepseek支持openai接口标准
- 2.base_url为https://api.deepseek.com
- 3.api_key申请地址为https://platform.deepseek.com/api_keys

先去[申请apikey](https://platform.deepseek.com/api_keys)，得到`sk-da75a***********************6f47`  
文件来源`run/ai_llm/config.yaml`它在webui中的名称为`AI LLM Plugin.config`
```yaml
#这里省略了其他配置项，不代表你可以随便删除其他配置项。
llm:
  model: openai #模型大类选择openai。
  system: "你现在是一只猫娘，你的名字是{bot_name}，我的名字是{用户}，是你的主人。"
  func_calling: false #deepseek r1截至2025.2不支持函数调用。请阅读deepseek文档确认模型是否支持函数调用。如不支持，则将此项改为false
  openai:
    enable_official_sdk: True   #是否使用官方sdk，如果不使用，则为直接发送post请求。
    api_keys:   #继续像这样添加apikey
      - YOUR_API_KEY_1
    model: deepseek-reasoner
    quest_url: https://api.deepseek.com   #如使用官方sdk，则只填base_url，否则填完整url。
    temperature: 1.3
    max_tokens: 2048
    CoT: false               #显示思维链
    使用旧版prompt结构: false  #部分模型需要使用旧版prompt结构
```
假如存在网络问题需要配置代理，请查阅【gemini配置正向代理】，这里是通用的。
### 接入kimi
阅读[kimi文档](https://platform.moonshot.cn/docs/guide/migrating-from-openai-to-kimi#%E5%85%B3%E4%BA%8E-api-%E5%85%BC%E5%AE%B9%E6%80%A7)，我们可以看到：
```yaml
Kimi API 兼容了 OpenAI 的接口规范，你可以使用 OpenAI 提供的 Python 或 NodeJS SDK 来调用和使用 Kimi 大模型，这意味着如果你的应用和服务基于 openai 的模型进行开发，那么只需要将 base_url 和 api_key 替换成 Kimi 大模型的配置，即可无缝将你的应用和服务迁移至使用 Kimi 大模型，代码示例如下：
```
```python
from openai import OpenAI
 
client = OpenAI(
    api_key = "$MOONSHOT_API_KEY",
    base_url = "https://api.moonshot.cn/v1",
)
 
completion = client.chat.completions.create(
    model = "moonshot-v1-8k",
    messages = [
        {"role": "system", "content": "你是 Kimi，由 Moonshot AI 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。Moonshot AI 为专有名词，不可翻译成其他语言。"},
        {"role": "user", "content": "你好，我叫李雷，1+1等于多少？"}
    ],
    temperature = 0.3,
)
 
print(completion.choices[0].message.content)
```

**得到的信息如下**
- 1.kimi支持openai接口标准
- 2.base_url为https://api.moonshot.cn/v1

[申请apikey](https://platform.moonshot.cn/console/api-keys)，得到`sk-pibXoRr***********************vNUq1`  
文件来源`run/ai_llm/config.yaml`它在webui中的名称为`AI LLM Plugin.config`
```yaml
#这里省略了其他配置项，不代表你可以随便删除其他配置项。
llm:
  model: openai #模型大类选择openai。
  system: "你现在是一只猫娘，你的名字是{bot_name}，我的名字是{用户}，是你的主人。"
  func_calling: true #kimi支持函数调用功能，可以开启。
  openai:
    enable_official_sdk: false   #是否使用官方sdk，如果不使用，则为直接发送post请求。
    api_keys:   
      - sk-pibXoRr***********************vNUq1 #这是个示例，你需要替换为你自己申请的apikey
    model: moonshot-v1-8k #选择使用的模型，这里是moonshot-v1-8k，其他模型需要查看kimi文档。
    quest_url: https://api.moonshot.cn/v1/chat/completions   #当【enable_official_sdk】为false时，需要填完整url。
```
