# windows快速部署

## 部署onebot实现
常见选择是llob或napcat。    
[其他选择](https://onebot.dev/ecosystem.html#onebot-%E5%AE%9E%E7%8E%B0-1)    
### llob或napcat
- [napcat](https://napneko.github.io/) 优势：低占用，一键包启动方便。
    - 需要手动开启websocketsever服务(见后文)，端口为3001,accessToken留空不要填。
- [llob](https://llonebot.github.io/zh-CN/guide/getting-started) 优势：部署后保持默认配置即可使用

**接下来的教程以Napcat为例**。    
> 基本上，要做的就是在onebot实现侧，设置一个【websocket服务端】，端口3001，access_token为空，这样Eridanus才可以连接到它。   

### 1.部署napcat
请参照[napcat文档部署napcat](https://napneko.pages.dev/)    
### 2.配置napcat
在webui配置ws服务器地址，端口为3001，token留空。
![ws1](/img_1.png)
![ws2](/img_2.png)
## 快速部署Eridanus
从Eridanus [release](https://github.com/avilliai/Eridanus/releases) 下载最新整合包并解压  
如果下载过慢，可前往qq群913122269下载  
- 解压整合包
- 运行【克隆仓库.exe】，选择一个源克隆。
- 进入Eridanus目录，运行【启动脚本.bat】
- 启动eridanus后，浏览器输入`http://localhost:5007`  

**Eridanus webui的初始账号密码均为eridanus**
