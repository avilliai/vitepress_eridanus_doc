# config对象
YAMLManager是【Eridanus项目】中提供的类，用来实现动态加载配置文件。
## 用法
### 读取
config对象包含run目录下的所有yaml文件，访问方式为  
```
config.{插件文件夹名}.{yaml文件名}[yaml文件中配置项]   
```
比如我们前面案例中的   
```
config.a_example.config["柴郡功能所需权限"]
```
### 修改与保存
无需重启bot，所有使用了config对象的地方都能够同时获取到新的对应值。
```python
config.a_example.config["柴郡功能所需权限"]=11        #为配置项重新赋值。等号左边仍然是标准数据类型，比如如果是list，那么append和pop等操作也能正常使用。
config.save_yaml("config",plugin_name="a_example")    #保存修改后的配置文件。参数1为文件名，参数2为插件名。
```
