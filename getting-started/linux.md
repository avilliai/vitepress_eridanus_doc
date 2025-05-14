# linux快速部署
[脚本](https://gitee.com/laixi_lingdun/eridanus_deploy)

linux部署可能遇到初始化失败。      
此时需要打开bypassinitcheck.txt，将文件中数值修改为1，由此可以绕过初始化检查。  
随后即可正常启动   
请在启动后访问webui即`localhost:5007`或手动进入run目录下各plugin文件夹修改配置文件   
目前修改后需要重启，近期将加入配置文件热重载
