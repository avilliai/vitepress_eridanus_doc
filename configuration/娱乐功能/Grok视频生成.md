# Grok2API图片视频生成
::: info 使用方法   
触发指令：/grok视频、/grok图片

取消指令：/grok取消、/grok退出、/grok cancel

管理员指令：/QQ号+次数（如：/123456+10，为指定用户增加额外使用次数。）
:::
## 1.部署Grok2API(二选一)
### 命令
在Eridanus根目录打开cmd
```
.
├─ Eridanus
│  └─ 一大堆乱七八糟的东西
├─ environments
│  ├─ MinGit
│  │  └─ cmd
│  │     └─ git.exe
│  └─ Python311
│     └─ python.exe

```
依次输入命令
```cmd
environments\MinGit\cmd\git.exe clone https://github.com/chenyme/grok2api
cd grok2api
..\environments\Python311\python.exe -m pip install -U uv
..\environments\Python311\python.exe -m uv sync
..\environments\Python311\python.exe -m uv run main.py
```
以后的启动命令：在grok2api目录打开cmd，输入
```
..\environments\Python311\python.exe -m uv run main.py
```
如果你嫌麻烦，新建个`启动脚本.bat`把这行命令写进去，以后双击就完事了。
### 脚本
`使用此脚本需要你自己环境变量中有python和git。此脚本由功能作者提供。`    
在群里面下载，或者[点击下载](https://wwbqn.lanzouw.com/if8683hryf9g)（密码：123456）名为“<span style="color: green;">一键部署及启动Grok2api</span>”的部署脚本，将它放在一个地方，随便在哪都行，然后双击运行它，程序会自动帮你下载部署，你只需要等待部署成功即可。

或者你也可以去[Github](https://github.com/chenyme/grok2api)上自行下载部署，二选一吧。   
## 2.获取cookie
打开[Grok官网](https://grok.x.ai)，登陆自己的账号后。你会进入这个界面，如图。   
>![Grok演示图](/Grok1.png)
> 确认登录账号了后，在此界面按下键盘的<span style="color: green;">F12</span>，或是用鼠标在此界面，右键点击<span style="color: green;">检查</span>进入开发者模式。    
它的右边会出现这样一个界面，如图。   
>![Grok演示图](/Grok2.png)
> 接下来请点击箭头所指的<span style="color: green;">应用程序</span>选项上。
> 
它会出现这个界面，如图。
>![Grok演示图](/Grok3.png)
> 按照箭头上面的步骤完成后，接下来就可以去创建API秘钥了（其实sso和sso-rw随便记一个就行了，他们都一样的。）
> 
打开[API秘钥创建页面](https://console.x.ai/team/473d5d36-c88f-402a-97a4-14c1f2e52d9a/api-keys)，生成自己的API秘钥后，就可以接下来的部署工作了。
> 
## 3.配置Grok2API

部署成功后，按照窗口显示的网址进入这个界面，如图。（目前是`localhost:8000/admin`，默认密码`grok2api`）
>![Grok演示图](/Grok5.png)
> 
点击屏幕上方的配置管理选项，填写你的APi秘钥和代理地址就可以了，其他内容保持默认。
>![Grok演示图](/Grok6.png)
> 
>![Grok演示图](/Grok7.png)
> 其他内容保持默认即可。
> 
接下来，回到Token列表，点击添加，添加刚才所记录的cookie信息即可。    
大部分用户都是普通账户，类型选择默认的ssoBasic即可。    
>![Grok演示图](/Grok8.png)
> 
接下来，打开`Eridanus/run/grok2api/config.yaml`，或在webui中打开grok2api.config。     
将里面的`API_KEY: "xai-26QZ1aXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXPj8bH64GgT"`，填写成与你grok2api配置的apikey。    

 填写完后就可以在群里面测试啦！`此处指令已更改，以开头最新指令为准`
>![Grok演示图](/Grok10.png)  
> 
## 常见问题以及注意事项！！！！必看！！！！
grouk2api是支持添加多账号的，也就是填写对应账号的cookie就行。     
但是要注意，如果你登出账号，那么这个账号的cookie就会失效，你需要重新添加这个账号的cookie才行。     
那我们要怎么才能在不退出原本账号的情况下，登录新的grok账号获取cookie呢？

有的兄弟有的。    
方法一：换浏览器即可，一个账号一个浏览器。    
方法二：我这里以Edge浏览器为例，点击左上角的头像，再在弹出的窗口点击：<span style="color: green;">添加其他配置文件----设置新的工作或学校个人资料</span>

这样你就有了一个新的浏览器账户了，这个账户不需要登录以及同步微软数据，只需要按上面的步骤重新获取一遍cookie即可。     
获取完后切记不要登出，否则会导致cookie失效，想要添加其他账号以此类推即可。    
>![Grok演示图](/Grok11.png)

添加其他账户需要更换api秘钥吗？
> 不需要。




