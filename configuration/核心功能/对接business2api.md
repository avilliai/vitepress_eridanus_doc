# 对接business2api
business2api接口不支持函数调用，但有的吃就不错了。
## fork仓库
打开[Dreamy-rain/gemini-business2api: OpenAI-compatible API for Gemini Business with multi-account load balancing and image generation | 将 Gemini Business 转为 OpenAI 兼容接口，支持多账户负载均衡与图像生成、视频生成](https://github.com/Dreamy-rain/gemini-business2api)       
点击fork
![](https://raw.githubusercontent.com/avilliai/imgBed/master/images/20260205141617.png)
## 部署到zeabur
### 部署
打开[Projects - Zeabur](https://zeabur.com/projects)       
没号的自己注册个，注册完需要绑定手机号，绑就完事了。   
点击右上角创建项目
![](https://raw.githubusercontent.com/avilliai/imgBed/master/images/20260205141933.png)
选择【共享集群】-【腾讯云】-【创建项目】     
进入新界面，选择第一个【从github仓库部署】，选中刚才fork到你账号下的gemini-business2api
![](https://raw.githubusercontent.com/avilliai/imgBed/master/images/20260205142127.png)
### 配置环境变量
先搞个数据库，打开[Neon Serverless Postgres — Ship faster](https://neon.com/)，注册完选择【新建项目/new project】，名称随意，其他配置不用动。     
完事点击connecting string
![](https://raw.githubusercontent.com/avilliai/imgBed/master/images/20260205142620.png)
把遮挡的部分记下来，它看起来像
```
postgresql://neondb_owner:xxxxx@xxxxxxxxx?sslmode=require&channel_binding=require
```

然后我们回到zezbur，在环境变量部分依次添加

| 变量名            | 必填  | 说明                |
| -------------- | --- | ----------------- |
| `ADMIN_KEY`    | ✅   | 管理面板登录密钥，随便设置     |
| `DATABASE_URL` | 推荐  | 上面那串stgresql开头的东西 |
![](https://raw.githubusercontent.com/avilliai/imgBed/master/images/20260205142831.png)
回到**服务状态页面点击重新部署**。
### 设置域名
在【网络】这里，随便输入个你喜欢的域名。    
比如我们的`fuckgoogle.zeabur.app`
![](https://raw.githubusercontent.com/avilliai/imgBed/master/images/20260205143107.png)
## 配置business2api
在部署完成后，打开刚才的设置的域名，比如`fuckgoogle.zeabur.app`。输入先前设置的admin-key的值即可进入面板。    
进入【系统设置页面】
![](https://raw.githubusercontent.com/avilliai/imgBed/master/images/20260205143455.png)
### api密钥
随便设置一个，后续bot调用需要。
### 邮箱服务
我用的moemail，你可以打开[business2api作者提供的moemail](https://moemail.nanohajimi.mom)。    
创建一个apikey，填入邮箱处标红的地方即可。    

**记得保存设置**。
## 批量注册账号
步骤 2：开始注册     
前往"账户管理"页面：    
- • 点击"添加账户"按钮
- • 选择"自动注册"标签
- • 设置注册数量
- • 勾选同意声明
- • 点击"开始注册"
## 配置代理
原作者提供了十分详细的教程[关于注册失败、刷新失败、收不到验证码、多账户短时间全部429解决方法 · Issue #46 · Dreamy-rain/gemini-business2api](https://github.com/Dreamy-rain/gemini-business2api/issues/46)。    
此处仅作补充。   
### mihomo配置文件？
实际上就是clash配置文件。你自己把你clash内核的代理软件配置文件复制过去就能用。但要注意这几个配置项
```yaml
mode: rule
mixed-port: 7890
socks-port: 10808
port: 10807
allow-lan: true
log-level: info
secret: ''
external-controller: 0.0.0.0:9090
```
如果你从来没接触过clash，也不知道去哪买订阅。用这个[sailing.pro](https://my.sailingnet.pro/zh/auth/signup?referrer=9Q3veQMx)。
### mihomo面板怎么进
和business2api一样，在部署完mihomo镜像后，需要注册个域名。     
打开[https://metacubexd.pages.dev/](https://metacubexd.pages.dev/)将域名输入进去即可，不用带端口。

最后不要忘了在business2api面板设置代理。原作者那里有。
## 如何让Eridanus对接
仅显示必要配置项
```yaml 
llm:  
  model: openai   
  openai:  
    enable_official_sdk: true   #是否使用官方sdk，如果不使用，则为直接发送post请求。 
    api_keys:   #继续像这样添加apikey  
    - 【系统设置】里面的api密钥  
    model: gemini-auto     #模型随便改business2api支持的都行。
    quest_url: https://xxxx.zeabur.app/v1 #你的business2api域名。  
```
