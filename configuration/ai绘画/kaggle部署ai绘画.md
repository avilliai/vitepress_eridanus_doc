
# kaggle部署ai绘画服务
kaggle每周有30h免费gpu时长，每个脚本一次可以运行12h，所以当你有7个号的时候，就可以无限续杯了。   
[kaggle注册](https://www.kaggle.com/code/spawnerqwq/qqbot-simple-reforge-spawner)，记得`在profile界面`  **绑定手机号**，不然用不了gpu和联网。
## kaggle脚本修改
**frp和cpolar二选一，如果你用了其中一个，就可以跳过另一个的教程**   
[双卡脚本](https://www.kaggle.com/code/spawnerqwq/qqbot-simple-reforge-spawner) 
### 使用frp
#### 申请frp隧道
免费frp有很多，以[chml](https://panel.chmlfrp.cn/tunnelm/manage)为例。在其官网注册登录，并完成实名验证(怕个人信息泄漏的换别的frp服务也行，流程基本一样)。
![fc8578c69e33882d300b258902051516.png](/frp1.png)    
第一个隧道，端口7860，创建后再创建一个，端口选7861(第二个不再演示)    
![image.png](/frp2.png)    
![frp3](/img_6.png)    
#### 配置到kaggle脚本
打开[双卡脚本](https://www.kaggle.com/code/spawnerqwq/qqbot-simple-reforge-spawner) 后，点击白色的copy&edit，跳转到新页面后你可以看到：  
![image.png](/img_7.png)    
用你两条隧道的配置文件，分别替换图中两处。
#### 配置到Eridanus
让我们回到chml，**在【隧道列表】记录【连接地址】**
![image.png](/img_8.png)    
两个地址看起来应该都是这样
```yaml
hb.fuck.you:114514
hb.fuck.you:191980 
```
那我们就**记录**下面的内容。
```yaml
http://hb.fuck.you:114514  #加上了http://
http://hb.fuck.you:191980   #加上了http://
```
打开配置文件`run/ai_generated_art/config.yaml` webui中则为`ai绘画.config`
```yaml
#仅展示关键配置项，不代表你可以随便删除其他配置项。
ai绘画:
  sdUrl:
    - 'http://hb.fuck.you:114514' 
    - 'http://hb.fuck.you:191980'
  sd审核和反推api: 'http://hb.fuck.you:114514'        # 两个地址随便填一个
# 注意，假设你的webui启动时设置了--api-auth 账号:密码 参数，那么假设你的sdapi是"http://127.0.0.1:7860"，改成 "http://127.0.0.1:7860 账号:密码" 这种格式
  sd画图: true
```
修改配置后重启机器人。
### 使用cpolar
#### 申请cpolar密钥
去[cpolar](https://dashboard.cpolar.com/get-started)注册(选免费套餐)，然后点验证，复制你的隧道 Authtoken 。    
它看起来像`YTMgojjgnagtnbvjppf`(这是我乱打的，你并不能偷懒直接拿去用)    
#### 配置到kaggle脚本
打开[双卡脚本](https://www.kaggle.com/code/spawnerqwq/qqbot-simple-reforge-spawner)后，点击白色的copy&edit，跳转到新页面后往下找到：
![kaggle.png](/img_9.png)    
把图中的`cpolar密钥`换成你上面申请的隧道AuthToken，看起来应该是这样
```python  
cpolar_use = False
if cpolar_use:
    !curl -L https://www.cpolar.com/static/downloads/install-release-cpolar.sh | sudo bash
    !cpolar version
    !cpolar authtoken Y2IyNsdfafsaFUIHGGUAHOFMxYmE0
    def iframe_thread_1():
        !cpolar http 7860    #网页
    t1=threading.Thread(target=iframe_thread_1)
    t1.start()
    !wget -q -O - ipv4.icanhazip.com
    author = 'spawner'
```  
#### 配置到Eridanus
打开配置文件`run/ai_generated_art/config.yaml` webui中则为`ai绘画.config`
```yaml
#仅展示关键配置项，不代表你可以随便删除其他配置项。
ai绘画:
  sdUrl:
    - 'http://127.0.0.1:7853'     #用cpolar就填这个。 
  sd审核和反推api: 'http://127.0.0.1:7853'     #用cpolar就填这个。
# 注意，假设你的webui启动时设置了--api-auth 账号:密码 参数，那么假设你的sdapi是"http://127.0.0.1:7860"，改成 "http://127.0.0.1:7860 账号:密码" 这种格式
  sd画图: true
```
修改配置后重启机器人。
## 设为公开脚本
点击页面右上角的share，将脚本设置为公开，这是为了其他账号能够正常访问。  
![kaggle1.png](/kaggle1.png)    
**记录下这里的public url**，然后点击save。
```yaml  
https://www.kaggle.com/code/xxxx/qqbot-simple-reforfsdafsf  
```  
这个【分享链接】我们待会会用到。
> 同一脚本如果save version次数过多，打开时会非常卡顿，将影响achernar正常工作。建议在save version超过30后更换新的shared_notebook链接。

## 更多备用账号
注册更多kaggle账号，记录好账号密码。    
**你注册的所有账号都需要能够通过 email+密码 登录，并且完成了手机号验证**     
验证码部分你可以找[接码平台](https://sms-activate.ru/?ref=12747914)，建议使用加拿大地区手机号。     
**这些账号注册后，只要完成手机号验证就可以，不用别的操作。**    
但要注意，不要出现同一台设备同时登陆了两个kaggle账号的情况，可能会被封，换号时注意退出登录。
## 部署Achernar
[Achernar](https://github.com/avilliai/Achernar)
### 拉取项目源码
```
git clone https://github.com/avilliai/Achernar
或使用镜像源  
git clone --depth 1 https://mirror.ghproxy.com/https://github.com/avilliai/Achernar
其他镜像源(推荐)  
git clone --depth 1 https://github.moeyy.xyz/https://github.com/avilliai/Achernar
```
不会用git自己看[avilliai/Achernar: kaggle账号自动切换+运行项目/cpolar隧道本地反向代理](https://github.com/avilliai/Achernar)页面右上角有个绿色按钮，点了下载zip压缩包。
### 安装python
[安装python3.11](https://mirrors.huaweicloud.com/python/3.11.0/python-3.11.0-amd64.exe)    
记住第一步勾选add to path，剩下全默认。
### 安装依赖
运行`一键部署脚本.bat`

### 编辑Achernar配置文件
`Achernar/config.yaml`
```yaml
proxy: ""     #别动这项。 
quest_proxy: ""  #一般不用配。sd api请求时使用的代理地址，如果开启代理后，Achernar反代不能正常工作请填写此项。你代理软件的http代理地址。取决于具体情况，clash一般http://127.0.0.1:7890  
port: 3529       
headless: true   
#在shared_notebook填入你记录的【分享链接】  
shared_notebook: ""  
enable_kaggle_extension: true  
enable_cpolar_extension: true    #使用frp就将这个改成false
cpolar_check_interval: 180  
kaggle_change_account_interval: 39600  
  
kaggle_accounts:  
  - email: "你的邮箱"  
    password: "你的密码"  
  - email: "你的第二个邮箱"  
    password: "你的第二个密码"  #以此类推  
cpolar:                  #使用frp不用填
  email: "cpolar的邮箱"  
  password: "cpolar的密码"  
  
  
```  
**运行Achernar主程序**，有条件的话，建议开启代理，并设置为pac模式/规则代理模式，将有助于稳定运行。    
kaggle脚本从启动到服务可用大概需要10分钟。

此时部署完成，群内发送绘画指令机器人就会响应。    
你也可以直接用浏览器打开你获取的请求地址，使用绘画服务。   
如果你是开发者，可以自行对接，其他使用sd api的项目也可以接入。        
如果你使用cpolar，就以http://127.0.0.1:3529作为base_url，发送绘图请求。        
如果你使用frp，以在frp配置步骤记录的【连接地址】(加上http://)作为base_url，发送绘图请求。    
url=f'{base_url}/sdapi/v1/txt2img     

Achernar的原型脚本和kaggle脚本均来自[spawner](https://github.com/spawner1145)
## 进阶配置
### 如果你不用Achernar，可以使用手动启动脚本
这里假设你已经搞好了前面的步骤，有了一个脚本了

先确保你在用t4 x 2的显卡，然后点右上方save versions，如图设置
![image](https://github.com/user-attachments/assets/45206cc9-be90-45b6-98d1-f400b48eb48b)
点save，然后你会看到左下角有个黄标，这说明代码启动了
![image](https://github.com/user-attachments/assets/7f66cc64-3a96-42bf-9722-a2f45df8cd62)
点一下，然后点三个小圆点的那个，会看到open logs in viewer，你点一下就可以查看代码运行的状态了
![image](https://github.com/user-attachments/assets/7a14b209-98d5-4155-9356-8afd3198599b)

### 关于kaggle笔记本的lora和大模型下载
打开[c站civitai](https://civitai.com/)    
注册一个账号（这个网站要梯子）   
登录以后右上角点头像，点齿轮的那个图标    
往下滑，你会看到API KEYS    
![image](https://github.com/user-attachments/assets/a511e5a7-120b-486e-95b8-675af17cad46)   
创建一个api key，记住，待会要用（注意不是让你取的名字），比如说我搞了一个api key为aeb1d64b7c43f84ed1a131ba5bb9b40d（这个不是真的）    
回到你的kaggle笔记   
![image](https://github.com/user-attachments/assets/366e98a6-e78f-4537-a019-920372f626b0)   
这个单元格里面全是下载链接   
我们以大模型下载为示例   
找到sd_model_urls   
![image](https://github.com/user-attachments/assets/7821a760-dfa8-4c98-9875-1fb40f32d2ff)   
去c站找你要的模型，我们先随便找一个模型，比如[NoobAI-XL (NAI-XL)](https://civitai.com/models/833294/noobai-xl-nai-xl)    
你会发现一个大大的下载按钮(不是create！)，对它右键，在弹出的窗口，你会看到复制链接这个选项，点击会复制链接下载链接，就像https://civitai.com/api/download/models/1190596?type=Model&format=SafeTensor&size=full&fp=bf16    
这时候我们要用上我们刚才获得的api key，把网址变成https://civitai.com/api/download/models/1190596?type=Model&format=SafeTensor&size=full&fp=bf16&token=aeb1d64b7c43f84ed1a131ba5bb9b40d
（这个token是假的）    
可以发现，我们在原网址后面加了一个&token=你的api key，把它变成了一个新网址    
回到你的kaggle脚本，把这个新网址加进去(注意英文引号和逗号必须加)   
![image](https://github.com/user-attachments/assets/068b0d14-3572-4e69-843c-96758cd16a90)
现在你的sd就可以用这些模型了，lora这种也是一样的，不过注意只有c站后面需要加token参数，如果你从别的网站链接下载，直接把链接搞过来就行    
现在你还可以通过把https://civitai.com/api/download/models/1190596?type=Model&format=SafeTensor&size=full&fp=bf16&token=aeb1d64b7c43f84ed1a131ba5bb9b40d    
变为    
abcd.safetensors@https://civitai.com/api/download/models/1190596?type=Model&format=SafeTensor&size=full&fp=bf16&token=aeb1d64b7c43f84ed1a131ba5bb9b40d    
从而将下载下来的文件命名为abcd.safetensors（所以要注意重命名时后缀名！！！）    
在这里你可以更改你默认启动加载的模型和一些别的启动参数，自己探索吧     
![image](https://github.com/user-attachments/assets/68addd0e-bd1e-49f4-8762-3ee83d62e395)
