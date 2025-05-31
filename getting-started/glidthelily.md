# 折腾版
## 部署onebot实现
先安装onebot实现   
你可以选择   
[napcat](https://napneko.github.io/)，[llob](https://llonebot.github.io/zh-CN/guide/getting-started)，[其他onebot实现](https://onebot.dev/ecosystem.html#onebot-%E5%AE%9E%E7%8E%B0-1)     
> 基本上，要做的就是部署onebot实现并在onebot实现侧，创建一个【websocket服务端】，端口3001，access_token为空，这样Eridanus才可以连接到它。   

## 部署Eridanus
```
以下命令任选其一
git clone --depth 1 https://github.com/avilliai/Eridanus.git
或使用镜像源
git clone --depth 1 https://mirror.ghproxy.com/https://github.com/avilliai/Eridanus.git
其他镜像源(推荐)
git clone --depth 1 https://github.moeyy.xyz/https://github.com/avilliai/Eridanus.git

git clone --depth 1 https://ghfast.top/https://github.com/avilliai/Eridanus.git

git clone --depth 1 https://gh.llkk.cc/https://github.com/avilliai/Eridanus.git
```
windows用户装[python3.11](https://mirrors.huaweicloud.com/python/3.11.0/python-3.11.0-amd64.exe)，需要勾选add to path    
linux用户同样需要安装python3.11并配置环境变量
## 安装依赖
### windows用户
运行Eridanus/一键部署脚本.bat  
运行Eridanus/启动脚本.bat  
### linux用户
装完python3.11后，cd到Eridanus，pip install -r requirements.txt  
自己再装个redis，配置好环境变量       
python main.py  
