# zlibrary
如无法使用，则需要在 配置文件`run/common_config/basic_config.yaml` webui中则为 `基础配置.basic_config` 中配置proxy.http_proxy
## 指令
```yaml
搜书{书名/作者名}  #比如 搜书唐士其
下载书{book_id} {hash}     #上一步查询会返回书籍id和hash。比如下载书11964391 06f948
```
## 配置方式
**此功能需要配置proxy**。   
配置文件`run/common_config/basic_config.yaml` webui中则为 `基础配置.basic_config`
### 配置代理
```yaml
proxy:
  http_proxy: ""   #填写你的代理地址
  socks_proxy: ""
```
### 配置文件
`run/resource_collector/config.yaml`webui中则为`资源搜索.config`
```yaml
z_library: #填你的zlib账号
  search_num: 4        #搜索返回结果数量，默认4本书
  email: ""
  password: ""  
  search_operate_level: 0    #书籍搜索所需权限等级
  download_operate_level: 998  #书籍下载所需权限等级
```
### 进阶——函数调用
书籍资源搜索和下载支持函数调用，当config/api.yaml配置了对话模型并启用了函数调用
```yaml
llm:
  func_calling: True #是否开启函数调用功能
```
你可以使用灵活的触发方式。
```
@bot 搜搜唐士其的书  #帮我找找吉尔利波维茨的书
@bot 下载book_id: 11964391 hash: 06f948   #直接把上一步的结果复制给bot也行。 
```
