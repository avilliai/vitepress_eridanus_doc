# asmr100
如无法使用，则需要在 配置文件`run/common_config/basic_config.yaml` webui中则为 `基础配置.basic_config` 中配置proxy.http_proxy
## asmr功能
需要安装ffmepg，并配置好环境变量。   
预计之后会将ffmepg的一键安装包并入Eridanus整合包。    
此功能需要配置卡片签名，卡片签名地址：https://ss.xingzhige.com/music_card/card    
napcat和llob都有配置卡片签名的地方，自己找。
### 指令
```yaml
随机奥术
随机asmr
最新asmr
热门asmr
```
### 函数调用
```yaml
帮我下载https://asmr.one/work/RJ01275524
```
### 配置
`run/resource_collector/config.yaml`webui中则为`资源搜索.config`
```yaml
asmr:
  with_url: false  #是否附带同作品集其他作品的url
  with_file: false #是否合并并发送音频文件
  max_merge_file_num: 10 #最大合并文件数
  gray_layer: true #是否开启灰度图功能
  asmr_level: 0

  send_type: file   #record或者file，record是语音，file是文件
  channels: #频道来源。此功能需要配置proxy，并通过tools完成登录。
    - '@emococh'
    - '@-gabisroom-4153'
```