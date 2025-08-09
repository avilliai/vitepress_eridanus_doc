---
sidebar_position: 5
---
# AI绘画
## 指令
### novel_ai绘图指令
```yaml
n4 prompt  #比如 n4 an anime girlish
n3 prompt  #比如 n3 an anime girlish
# 在prompt中随便一个地方加入横或方或竖就会变成画横图或方图或竖图，默认竖图
```
### sd绘图指令
```yaml
画 xxxxx
# 在prompt中随便一个地方加入横或方或竖就会变成画横图或方图或竖图，默认竖图
```
### tag反推
```yaml
tag
```
然后发送图片；或者引用图片使用，需要先部署`https://github.com/spawner1145/wd14-inference-webui.git`或者给webui安装`https://github.com/spawner1145/stable-diffusion-webui-wd14-tagger.git`插件
### 重绘
```yaml
重绘 prompt   # 比如 重绘 1girl,solo,loli
n3re prompt  # nai3重绘
n4re prompt  # nai4重绘
# 在prompt中随便一个地方加入横或方或竖就会变成画横图或方图或竖图，默认自适应
# 在重绘的提示词内加入--left 114/--right 114/--left 114/--right 114这种语法会触发扩图，代表往哪个方向延展多少个像素
# 扩图状态下如果在提示词中包含--full，会对扩展后的图像进行全图重绘，而不仅仅是扩展部分重绘，一般来说衔接更好
```
然后发送图片；或者引用图片使用
### 局部重绘
```yaml
局部重绘 prompt # sd局部重绘
# 在prompt中随便一个地方加入横或方或竖就会变成画横图或方图或竖图，默认自适应
```
然后先后发送图片和你蒙版过(用黑色覆盖你要重绘的地方)的图片；或者引用图片使用
### 读原图的tag之类的各种参数信息
```yaml
imginfo
```
然后发送图片；或者引用图片使用
### 指令设置参数（在后面还会讲到高级用法）
```yaml
setsd xxxx   #设置sd参数(比如setsd --w 1024 --h 1600就会把宽设为1024，高设为1600)（注意空格和"--"）
setre xxxx   #设置重绘参数
# 目前可用的参数:--w(宽，值要求为整数) --h(高，值要求为整数) --d(重绘幅度，0到1之间的小数) --p(正向提示词) --n(负面提示词)
# setsd 0或setre 0可以回到默认设置
# 注:优先级是关键词中含有横或方或竖最高，其次你自定义的分辨率，nai相关部分不受自定义分辨率影响，同时自定义横和宽不能超过1600
```
### 重绘中断指令
如果你在图片输入之前突然不想要重绘了，可以发送这条指令
```yaml
/clearre
```
### 查询指令
```yaml
lora
ckpt
scheduler
sampler
```
### 切换模型
```yaml
ckpt2 {modelname}
```
### 查询danbooru词条
```yaml
dan {你要查的tag，可以是各种语言}
```
### 获取抽卡可用词条(具体用法后面会讲)
```yaml
getwd
```
### 中断与跳过(master可用)
```yaml
interrupt  # 中断当前任务
skip   # 把当前任务的结果直接发出来
```
## 进阶用法
### ai对话体验优化
在对话中，bot将根据对话画出特定的场景。
`如何实现这样的效果?`
```yaml
#你应该还记得我们的config/api.yaml中，有让你编写人设的部分，不要小看它的作用。
#(该文件其他部分省略，此处仅展示所需配置项)
llm:
  model: gemini #选择使用的模型大类。可选openai、gemini。
  system: "你现在是一只猫娘，你的名字是{bot_name}，正在和你对话的人叫做{用户}，xxx是你的主人。你的基本形象特征为{}，当且仅当对话进入某个全新场景或者发生某个重要事件时，你将调用绘图函数绘制相应画面。"
  func_calling: True #是否开启函数调用功能
```
你注意到，我们告诉了bot它的基本形象特征，并且告诉bot可以在特定条件下触发绘画功能，由此即可实现上图的效果。
```yaml
#一个示例
llm:
  model: gemini #选择使用的模型大类。可选openai、gemini。
  system: "你现在是一只猫娘，你的名字是{bot_name}，正在和你对话的人叫做{用户}，xxx是你的主人。你的基本形象特征为general, sensitive, questionable, explicit, 1girl, solo, hair ornament, flower, hair flower, looking at viewer, long hair, ahoge, virtual youtuber, ribbon, blue eyes, dress, bow, off shoulder dress, detached collar, bangs, multicolored hair, upper body, white flower, blush,  grey hair, hair ribbon, white hair,white bow dress,{lolita dress},blue hair,{{Rella}},{chen bin},Rella，当且仅当对话进入某个全新场景时，你将调用绘图函数绘制相应画面。在绘制以{bot_name}为主角的图片时，务必注意保持{bot_name}的基本特征。"
  func_calling: True #是否开启函数调用功能
```
### 函数调用
```yaml
llm:
  func_calling: True #是否开启函数调用功能
```
直接告诉bot要绘制的内容
### 关于抽卡(wildcard)功能
```yaml
getwd # 可以获得所有能够抽取的wildcard
getwd xxx # 你给一串提示词，还给你抽卡处理过后的句子
```

#### 注意:后面的wd指令是当作提示词用的
```yaml
<wda:x=y>
```
此指令会固定从名为x的wildcard中抽取y项，附加a的固定权重

```yaml
<wda-b:x=y>
```
此指令会从名为x的wildcard中抽取y项，附加a到b范围内的随机权重
如果权重参数（a-b或a）出现问题，默认为权重范围0到1

举例：
```yaml
画 1girl,<wd1:artist=1> # 随机抽一个画师，权重为1，例如wlop
画 1girl,<wd1:artist=2> # 随机抽两个画师，权重为1，例如wlop,torino aqua
画 1girl,<wd0.5:artist=2> # 随机抽两个画师，权重为0.5，例如(wlop:0.5),(torino aqua:0.5)
画 1girl,<wd0.4-0.5:artist=3> # 随机抽3个画师，权重为0.4到0.5中的随机数，例如(a:0.4111),(b:0.4231),(c:0.4342)
画 1girl,<wd1:artist=2>,<wd0.6:artist=3> # 随机抽五个画师，两个权重为1，三个权重为0.6
```
wildcard文件可以当成预设文件用，比如你创建一个a.txt，把你的预设提示词串粘贴到一行，并保持只有一行，再次使用```<wd1:a=1>```就相当于在使用你的预设提示词串，可以大大简化输入和收集提示词串的流程，存放wildcard在plugins/aidraw/wildcards文件夹下，为txt格式
### setsd和setre的参数重设
基础的这里就不讲了，这里是一些进阶用法

注意nai部分也可使用setsd和setre调整参数，只有分辨率不受影响

接下来以setsd为例，setre同理

重置指定项指令
```yaml
setsd --w 1024 --h
```
这里的--h后面没有定义值，所以高度会被重置回默认值

重设正面或负面提示词
```yaml
setsd --p masterpiece,best quality,amazing quality,very aesthetic,absurdres,newest,
```
这上面的会把默认正面提示词设为masterpiece,best quality,amazing quality,very aesthetic,absurdres,newest,然后你以后每次画画的词加在这句话的前面


但是我们有时候不想要输入的词在句首，那么我们可以用一个空的大括号来表示你之后输入的词插入的位置
```yaml
setsd --p masterpiece,{},best quality,{},amazing quality,very aesthetic,absurdres,newest,
```
在上面的例子里，我们在两个地方插入了大括号

那么接下来，假设你使用了"画 1girl"

实际上的整句话就是
```yaml
masterpiece,1girl,best quality,1girl,amazing quality,very aesthetic,absurdres,newest,
```
注意，setsd和setre中的--p和--n参数可以处理wildcard，所以可以在setsd和setre指令中出现wildcard语法，从而达到每次画图都抽卡的效果
## 配置文件
### 概览
配置文件`run/ai_generated_art/config.yaml` webui中则为`ai绘画.config`   
**默认服务端启动模型名称需要与配置文件中的`sd默认启动模型`保持一致，否则会启动失败。**
```yaml
ai绘画:
  sdUrl:
    - '' #你自己搭建的sd，地址，示例http://127.0.0.1:3529（示例≠你能直接填示例用），部署https://www.bilibili.com/video/BV1iM4y1y7oA/'' 
  sd审核和反推api: ''        # 如果你的sd有反推插件https://github.com/spawner1145/stable-diffusion-webui-wd14-tagger.git，可以直接使用你的sdurl的api
  nai_key: ''
# 注意，假设你的webui启动时设置了--api-auth 账号:密码 参数，那么假设你的sdapi是"http://127.0.0.1:7860"，改成 "http://127.0.0.1:7860 账号:密码" 这种格式
  sd画图: true
  sd默认启动模型: 'miaomiao_1_4.safetensors'
  反推和审核使用模型: 'wd14-vit-v2-git' # 可填的选项见文档https://eridanus-doc.netlify.app/docs/%E6%8B%93%E5%B1%95%E5%8A%9F%E8%83%BD/ai%E7%BB%98%E7%94%BB
  sd图片是否保存到生图端: true   #是否将生成的图片保存在webui的outputs里
  novel_ai画图: false
  sd画图默认分辨率: '1024,1536' # 宽,高（别带空格）
  sd最大分辨率: '1600,1600'
  sd队列长度限制: 6     #防止有人刷绘图指令。
  ai绘画所需权限等级: 0 # sd绘图权限
  内置ai绘画1开关: true  #聚合接口
  内置ai绘画2开关: true  #NoobXL-V-pred-v1.0，来自modelscope。
  内置ai绘画1所需权限等级: 0  #默认聚合绘图功能所需等级
  内置ai绘画2所需权限等级: 0  #NoobXL-V-pred-v1.0

  禁止nsfw: false
  allow_nsfw_groups:               #允许色图的群号，禁止nsfw开启时有效
    - 123
  其他默认绘图参数: # 各参数见文档https://eridanus-doc.netlify.app/docs/%E6%8B%93%E5%B1%95%E5%8A%9F%E8%83%BD/ai%E7%BB%98%E7%94%BB#%E6%89%80%E6%9C%89%E5%8F%AF%E8%B0%83%E8%8A%82%E5%8F%82%E6%95%B0%E5%88%97%E8%A1%A8
      --w 1024 # 宽
      --h 1536 # 高
      --d 0.7 # 重绘幅度
      --p {},rating:general, best quality, very aesthetic, absurdres   # 正面预设词
      --n blurry, lowres, error, film grain, scan artifacts, worst quality, bad quality, jpeg artifacts, very displeasing, chromatic aberration, logo, dated, signature, multiple views, gigantic breasts  # 负面预设词
      --steps 15   # 迭代步数
      --sampler Restart   # 采样器
      --scheduler Align Your Steps      # 去噪算法
      --nai-sampler k_euler_ancestral   # 采样器(nai)
      --nai-scheduler karras   # 去噪算法(nai)
      --cfg 6.5     # 提示词引导系数
      --nai-cfg 5    # 提示词引导系数(nai)
      --ns     # 扩图功能高级参数，默认是5,代表扩图初始区域与原图边缘的相似度，数值越大差异越大
      --nf     # 扩图功能高级参数，默认是20,代表离原图边缘越远图像和原图边缘的差异度，数值越大差异越大
      --overmask     # 部分扩图(提示词中无--full)时遮盖原图的长度，默认64，你觉得碍事可以改成0
```
### 反推与审核用模型相关
```yaml
反推和审核使用模型可选:'wd14-vit-v2-git'，'wd14-convnext-v2-git'，'wd14-swinv2-v2-git'，'wd-vit-v3-git'，'wd14-convnext-v3-git'，
'wd14-swinv2-v3-git'，'wd14-large-v3-git'，'wd14-eva02-large-v3-git'
前提是你webui安装的插件是spawner1145的https://github.com/spawner1145/stable-diffusion-webui-wd14-tagger.git
(也可以单独启动https://github.com/spawner1145/wd14-inference-webui.git这个项目把他的网址当作api用)
否则只能使用'wd14-vit-v2-git'
```
