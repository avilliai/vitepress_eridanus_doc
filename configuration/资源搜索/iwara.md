# iwara
如无法使用，则需要在 配置文件`run/common_config/basic_config.yaml` webui中则为 `基础配置.basic_config` 中配置proxy.http_proxy
## iwara功能
```yaml
iwara搜{关键字}   #比如 iwara搜菲比
iwara下载{视频id}  #比如 iwara下载ciGDn8TIwYvfgR
iwara最新
iwara热门
iwara趋势
```
### 配置
`run/resource_collector/config.yaml`webui中则为`资源搜索.config`
```yaml
iwara:
  iwara_search_level: 0  #iwara搜索功能所需权限等级
  iwara_download_level: 998  #iwara下载功能所需权限等级
```