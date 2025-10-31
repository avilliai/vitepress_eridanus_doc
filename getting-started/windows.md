---
next:
  text: 'WebUI初次使用'
  link: '/configuration/webui/初次使用'
---

# Windows快速部署

## 部署onebot实现    
[napcat](https://napneko.github.io/)  ,[llob](https://llonebot.github.io/zh-CN/guide/getting-started)  ,[Lagrange.OneBot](https://lagrangedev.github.io/Lagrange.Doc/v1/Lagrange.OneBot/Config/)  ,[其他选择](https://onebot.dev/ecosystem.html#onebot-%E5%AE%9E%E7%8E%B0-1)     
**请在napcat/llob/Lagrange.OneBot/其他选择中任选其一部署**。    
> 基本上，要做的就是在onebot实现侧，设置一个【websocket服务端】，端口3001，access_token为空，这样Eridanus才可以连接到它。

### llob
保持默认配置即可    
[llob](https://llonebot.github.io/zh-CN/guide/getting-started)

### Lagrange.OneBot

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
> Lagrange.onebot的消息格式与napcat/llob等存在部分不一致，因此需要修改Eridanus配置文件以适配。    
```
#后续搭建Eridanus后，在run/common_config/basic_config.yaml中，将adapter.name修改为Lagrange
adapter:
  name: "Lagrange"   #兼容性选项，如果用Lagrange，则必须填Lagrange，用其他onebot实现则不用动
```
### napcat
请参照[napcat文档部署napcat](https://napneko.pages.dev/)     
在webui配置ws服务器地址，端口为3001，token留空。
![ws1](/img_1.png)
![ws2](/img_2.png)
## 快速部署Eridanus
从Eridanus [release](https://github.com/avilliai/Eridanus/releases) 下载最新整合包并解压  
如果下载过慢，可前往qq群913122269下载  
- 解压整合包
- 运行【克隆仓库.exe】，选择一个源克隆。
- 进入Eridanus目录，运行【启动脚本.bat】
- 启动eridanus后，访问WebUI进行下一步操作。参阅[WebUI初次使用](/configuration/webui/初次使用.md)
