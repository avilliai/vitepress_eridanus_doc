# steam
## steam游戏查询
### 指令
```yaml
steam查询 星际拓荒
```
### 函数调用
```yaml
看看steam游戏星际拓荒
```
## steam视奸好友
> '在这里你可以通过bot随时随地[title]视奸[/title]你朋友的steam状态\n[des]但是要小心使用，至少经过朋友同意或者不影响他人哦'
### 指令
```
steambind [Steam ID 或 Steam好友代码]（可艾特）  #绑定Steam账号：
steaminfo （可艾特或者直接发送Steam ID or Steam好友代码） #查询Steam最近游玩内容：
steamadd（可艾特）    #添加到当前群进行视奸
steamremove（可艾特）  #取消视奸
steamcheck           #查看当前群视奸列表
```
>    '注意注意！要先绑定自身的steamid才能进行视奸哦～～当然你也可以帮别人绑定哦（逃'
>                                                Function By 漫朔
### 配置文件
`run/anime_game_service/config.yaml`webui中则为`Anime Game Service.config`
```yaml
steamsnooping:
  is_snooping: False   #是否开启Steam视奸功能
  steam_api_key:      #需要您自行申请写入一个或多个Steam Api Key，申请地址：https://partner.steamgames.com/doc/webapi_overview/auth
    - None
  game_white:
    - 1
```