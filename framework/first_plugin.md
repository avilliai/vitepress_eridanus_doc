# 编写你的第一个插件
本文档将教你如何编写一个简单的插件，并将其集成到你的项目中。  
在开始之前，我们假定
- 你已经成功部署了Eridanus，并且能够连接到onebot实现(napcat/llob)
- 你有一个编辑器并配置了Python环境(python3.11)，可以直接使用environments中的python解释器
- 你学习了python的基本语法，可以编写简单的程序
## plugin加载
首先，我们需要知道一个Plugin是如何被机器人加载的。   
当机器人启动时，它会扫描`run`目录下的所有文件夹，并尝试导入它们，如果run/插件名称/xxx.py定义了
```python
def main(bot,config):
    pass  # 你的插件代码
```
那么它将调用`main`函数，并传入`bot`和`config`两个参数。   
`bot`参数是一个`Bot`对象，它代表了机器人的实例，你可以通过它来发送消息、获取用户信息、获取群组信息等。   
`config`参数是一个YAMLManager对象，它包含了机器人的配置文件。
## Hello World
在run目录下创建一个新的文件夹(比如`a_example`)，并在其中创建一个`__init__.py`文件，里面可以不用写任何东西。 
```yaml
run/
├─a_example
│     ├─example.py
│     ├─__init__.py
```
example.py中写入
```python
from developTools.event.events import GroupMessageEvent
from framework_common.framework_util.websocket_fix import ExtendBot
from framework_common.framework_util.yamlLoader import YAMLManager


def main(bot: ExtendBot,config: YAMLManager):
    @bot.on(GroupMessageEvent)
    async def handle_group_message(event: GroupMessageEvent):
        if event.pure_text=="测试":
            await bot.send(event,"Hello World!")
```
在群内发送测试，机器人就会回复Hello World!
## 调用api
### api是啥
api（Application Programming Interface）指应用程序编程接口，你可以通过调用由其他人提供的api服务实现特定功能，而无需编写具体功能的业务实现逻辑。  
打个比方，你是顾客，api是服务员，只要你把要吃的菜告诉服务员，然后等待服务员把菜呈上来就行了，而无需其他操作。   
如果你仍然存在理解上的困难，请自行搜索相关知识，不善用搜索引擎是无法进行开发工作的。            
接下来我们将以 随机柴郡表情包 为例，展示如何调用外部api   
### 选择接口
在api站点找到你想用的接口   
[随机柴郡表情包api](https://api.yujn.cn/?action=interface&id=196)    
只要向`http://api.yujn.cn/api/chaijun.php` 发送get请求，就可以获取到一张柴郡表情包的数据。
### 编写service代码
在插件目录下新建一个service文件夹
```yaml
run/
├─a_example
│     ├─example.py
│     ├─__init__.py
│     └─service/
│       └─chaijun.py
```
在service文件夹下新建chaijun.py，写入下面的内容。
```python
import httpx
async def chaijun():                              #async def是固定前缀，不能变
    url = "http://api.yujn.cn/api/chaijun.php?"   #柴郡图片的api地址
    async with httpx.AsyncClient() as client:      #使用httpx库发送get请求
        r = await client.get(url)             
        path="pic.png"                          #图片保存路径
        with open(path, "wb") as f:              #将图片保存到本地
            f.write(r.content)
        return path                             #返回图片路径
if __name__ == '__main__':
    import asyncio                  #调用测试
    asyncio.run(chaijun())
```
好的，我们顺利地写出了第一个功能函数，运行这个函数吧，你应该会得到一张柴郡表情包的图片。
### 接入主函数
记得上一节我们创建的主函数example.py吗？现在我们可以通过它使用刚才做的柴郡表情包功能了。
```python
from developTools.event.events import GroupMessageEvent
from developTools.message.message_components import Image,Text
from framework_common.framework_util.websocket_fix import ExtendBot
from framework_common.framework_util.yamlLoader import YAMLManager
from run.a_example.service.chaijun import chaijun    #导入的起点是Eridanus根目录，如果你用的是pycharm或vscode，用它们的导入，手打不累吗

def main(bot: ExtendBot, config: YAMLManager):
    @bot.on(GroupMessageEvent)
    async def handle_group_message(event: GroupMessageEvent):
        if event.pure_text == "测试":
            await bot.send(event, "Hello World!")
        if event.pure_text == "柴郡":
            bot.logger.info("找一张柴郡表情包!")
            path = await chaijun()
            await bot.send(event, Image(file=path))
        # 如果你想图文一起发，可以这样写👇
        # await bot.send(event,[Text("柴郡表情包"),Image(file=path)])
```
这样，当你在群里发送 柴郡 的时候，bot就会下载一张柴郡表情包发给你。
## 进阶：函数调用
函数调用允许你在和ai对话过程中，由ai决定是否调用相关功能，从而不再需要写各种机械的指令判断。    
此功能需要在ai_llm plugin中配置了支持函数调用的模型
### 函数集合
在plugin(这里是a_example)目录下新建一个func_collection.py
```yaml
run/
├─a_example
│     ├─__init__.py
│     ├─example.py
│     ├─func_collection.py
│     └─service/
│       └─chaijun.py
```
写入如下内容
```python
from developTools.message.message_components import Image
from framework_common.framework_util.websocket_fix import ExtendBot
from framework_common.framework_util.yamlLoader import YAMLManager
from run.a_example.service.chaijun import chaijun

"""
柴郡表情包不需要额外参数，但为了让初次接触函数调用的开发者更容易理解，这里增加了一个数量参数num，默认为1，表示要找1张柴郡表情包。
每个支持函数调用的函数，必须至少接收bot,event,config三个参数。
"""
async def call_chaijun(bot: ExtendBot,event,config: YAMLManager,num:int=1):
    bot.logger.info(f"找{num}张柴郡表情包!")
    for i in range(num):
        path = await chaijun()
        await bot.send(event, Image(file=path))
        # 如果你想图文一起发，可以这样写👇
        # await bot.send(event,[Text("柴郡表情包"),Image(file=path)])

```
### 初始化声明
plugin_description,dynamic_imports,function_declarations这三个变量是必须的，分别代表插件的描述、导入的函数路径、声明的函数。
```python
plugin_description="柴郡表情包"

dynamic_imports = {   #写明函数的导入路径，以及函数名
    "run.a_example.func_collection": 
        ["call_chaijun"]
}
function_declarations=[    #声明函数
    {
        "name": "call_chaijun", #函数名
        "description": "获取柴郡表情包",  #函数描述
        "parameters": {
            "type": "object",
            "properties": {   #参数
                "num": {   #参数名
                    "type": "Integer",  #参数类型
                    "description": "要获取的表情包数量，可默认输入1"  #参数描述
                },
            },
            "required": [   #如果不是必须参数，可以把required项删除
                "num"    
            ]
        }
    },
]
```
### example还能优化吗
可以的，我们发现example和call_chaijun函数的功能重复了，那么只要让example调用call_chaijun函数就可以了。
```python
from developTools.event.events import GroupMessageEvent
from developTools.message.message_components import Image,Text
from framework_common.framework_util.websocket_fix import ExtendBot
from framework_common.framework_util.yamlLoader import YAMLManager
from run.a_example.func_collection import call_chaijun


def main(bot: ExtendBot, config: YAMLManager):
    @bot.on(GroupMessageEvent)
    async def handle_group_message(event: GroupMessageEvent):
        if event.pure_text == "测试":
            await bot.send(event, "Hello World!")
        if event.pure_text == "柴郡":
            bot.logger.info("找一张柴郡表情包!")
            await call_chaijun(bot, event,config)
        # 如果你想图文一起发，可以这样写👇
        # await bot.send(event,[Text("柴郡表情包"),Image(file=path)])
```
这样以后如果接口有变动，只需要维护func_collection即可。
### 测试
运行bot，然后@bot 给我找3张柴郡表情包
## 配置文件怎么用
在plugin(这里是a_example)目录下新建一个config.yaml
```yaml
run/
├─a_example
│     ├─__init__.py
│     ├─example.py
│     ├─func_collection.py
│     ├─config.yaml
│     └─service/
│       └─chaijun.py
```
写入如下内容
```yaml
柴郡功能所需权限: 0
```
回到func_collection.py，我们可以用config对象读取配置文件，加一个权限检查
```python
from developTools.message.message_components import Image
from framework_common.database_util.User import get_user
from framework_common.framework_util.websocket_fix import ExtendBot
from framework_common.framework_util.yamlLoader import YAMLManager
from run.a_example.service.chaijun import chaijun
"""
config对象包含run目录下的所有yaml文件，访问方式为
config.{插件文件夹名}.{yaml文件名}[yaml文件中配置项]
比如我们案例中的
config.a_example.config["柴郡功能所需权限"]
"""
async def call_chaijun(bot: ExtendBot,event,config: YAMLManager,num:int=1):
    user_info = await get_user(event.user_id)    #获取用户信息
    if user_info.permission >=config.a_example.config["柴郡功能所需权限"]:  #判断用户权限是否足够
        bot.logger.info(f"找{num}张柴郡表情包!")
        for i in range(num):
            path = await chaijun()
            await bot.send(event, Image(file=path))
            # 如果你想图文一起发，可以这样写👇
            # await bot.send(event,[Text("柴郡表情包"),Image(file=path)])
    else:
        bot.logger.info(f"你没有足够权限使用柴郡表情包!")
        await bot.send(event, "你没有足够权限使用柴郡表情包!")

```