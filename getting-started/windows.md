# windows快速部署

## 部署onebot实现
常见选择是llob或napcat。    
[napcat](https://napneko.github.io/),[llob](https://llonebot.github.io/zh-CN/guide/getting-started),[Lagrange.OneBot](https://lagrangedev.github.io/Lagrange.Doc/v1/Lagrange.OneBot/Config/),[其他选择](https://onebot.dev/ecosystem.html#onebot-%E5%AE%9E%E7%8E%B0-1)     
**请在napcat/llob/Lagrange.OneBot/其他选择中任选其一部署**。    
> 基本上，要做的就是在onebot实现侧，设置一个【websocket服务端】，端口3001，access_token为空，这样Eridanus才可以连接到它。   

### napcat
请参照[napcat文档部署napcat](https://napneko.pages.dev/)     
在webui配置ws服务器地址，端口为3001，token留空。
![ws1](/img_1.png)
![ws2](/img_2.png)
### llob
保持默认即可
### Lagrange.OneBot
(推荐Lagrange.OneBot，它可能比其他几个更加稳定)    
[Lagrange.OneBot文档](https://lagrangedev.github.io/Lagrange.Doc/v1/Lagrange.OneBot/Config/)     
从[release下载](https://github.com/LagrangeDev/Lagrange.Core/releases)     
运行`Lagrange.OneBot.exe`，会提示`No exist config file, create it now...
Please Edit the appsettings.json to set configs and press any key to continue`    
此时打开生成的`appsettings.json`,找到`Implementations`项，修改为下面这样并保存       
```
    "Implementations": [
        {
            "Type": "ForwardWebSocket",
            "Host": "127.0.0.1",
            "Port": 3001,
            "HeartBeatInterval": 5000,
            "HeartBeatEnable": true,
            "AccessToken": "",
        }
    ]
```
在Lagrange.OneBot.exe窗口回车，完成扫码登录。
## 快速部署Eridanus
从Eridanus [release](https://github.com/avilliai/Eridanus/releases) 下载最新整合包并解压  
如果下载过慢，可前往qq群913122269下载  
- 解压整合包
- 运行【克隆仓库.exe】，选择一个源克隆。
- 进入Eridanus目录，运行【启动脚本.bat】
- 启动eridanus后，浏览器输入`http://localhost:5007`  

**Eridanus webui的初始账号密码均为eridanus**
