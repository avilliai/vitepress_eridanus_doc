# linux 快速部署教程


::: warning 小白警告
如果你选择使用`Linux`，请确保你有一定的`Linux`使用经验，能够自行解决可能遇到的问题。
否则推荐使用`Windows`系统进行部署。
:::

## 1. 安装机器人本体

[机器人本体部署脚本](https://gitee.com/laixi_lingdun/eridanus_deploy)


执行完成**机器人本体部署脚本**后，请前往`安装目录/start`，执行`./gui.sh`启动机器人管理界面。

::: tip onebot安装
机器人脚本只是负责安装机器人本体，你需要参考下面教程安装`onebot`实现机器人与平台对接。
:::




## 2. 安装onebot
**onebot实现** 市面上较多请自行选择。本**教程**和**机器人项目**不对任何**onebot实现负责**。
本文只针对`Napcat`进行说明，如果你是使用其他onebot请参考对应教程。

这里有一份更详细的教程可供参考

[安装教程.pdf](../部署文档.pdf)


这里给出一些onebot的安装地址：
1. [Napcat](https://napcat.napneko.icu/guide/boot/Shell)
2. [Lagrange](https://lagrangedev.github.io/Lagrange.Doc/v1/Lagrange.OneBot/Config/) 近期似乎不可用
### 稳定方案 | docker文件夹映射
经实测，目前最稳定的是docker napcat    
如果Eridanus被安装在了napcat所在容器外~~【不建议在napcat所在容器内安装Eridanus，会很麻烦】~~，将导致napcat找不到Eridanus要发送的文件资源。此时我们需要在部署napcat时增加文件夹映射。     
```
docker run -d \
  -e NAPCAT_GID=$(id -g) \
  -e NAPCAT_UID=$(id -u) \
  -p 3000:3000 \
  -p 3001:3001 \
  -p 6099:6099 \
  -v /root/Eridanus/data:/root/Eridanus/data \
  --name napcat \
  --restart=always \
  mlikiowa/napcat-docker:latest
```
我们加上了`-v /root/Eridanus/data:/root/Eridanus/data \`参数，笔者的Eridanus安装在/root/Eridanus，你需要根据你的Eridanus实际安装位置进行调整。仅映射data文件夹即可。
## 3. 配置onebot
以`Napcat`为例，假设你已经安装好了`Napcat`。

请进入你的onebot的配置界面。
### 1. 新建配置

根据图片所示，新建一个**WebSocket服务器**配置

![新建配置](/onebot/1.png)

## 2. 配置参数
根据**图片所示**，填写参数。
![配置参数](/onebot/2.png)
::: tip Token
请保留 **Token** 中填写的内容，后续需要用到。
:::

## 3. 配置Eridanus

> 配置管理员账户

在启动`Eridanus`机器人后，在机器人的日志中你可以看到`webui`的**地址**和**账户密码**

在浏览器中访问`webui`，输入账户密码登录。

然后根据图片所示进入设置界面修改机器人的管理员账户。


![配置参数](/onebot/3.png)




> 配置OneBot连接

找到`ws_link`这一配置选项，填写你的`onebot`的`WebSocket`地址和`Token`
例如：

```bash
ws://127.0.0.1:3001?access_token={aMCj...}
```


`{aMCj...}`**需要替换**为你实际填写的`Token`。

![配置参数](/onebot/3.1.png)

## 4. 重启机器人
点击保存之后，重启机器人。您可以在你的管理员账户中看到机器人主动发送的消息，表示连接成功。

至此机器人已经全部部署完成。

## 安全配置项

安全配置不是部署部分，但强烈建议配置以保障机器人和服务器的安全。

### 1. 修改`webui`默认管理员账户密码

![配置参数](/onebot/webuipasswd.png)


### 2. 修改`onebot`的默认端口

请参考对应`onebot`的教程修改默认端口，然后把`Eridanus`中的`ws_link`配置项也一并修改。

防止端口扫描导致的安全问题。

更进一步如果你的机器人和`onebot`不在同一台服务器上，可以考虑把`onebot的端口`只允许机器人服务器访问本地访问。
