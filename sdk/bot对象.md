# bot对象
注释挺全的，就不一一讲了。

简而言之，都可以通过`await bot.函数名`的方式调用。
```yaml
await bot.send(event,"Hello World")
await bot.send_like(184009492)
```

## 自定义action
```
    async def _call_api(self, action: str, params: dict, timeout: int = 20) -> dict:
        """
        发送请求并异步等待响应。
        """
```
[napcat](https://napcat.apifox.cn/5430207m0)有一些专有接口，出于通用性(懒)考虑，eridanus暂时没有进行对接，但你可以自己发送action以实现相应功能。

以设置个性签名为例，接口为`/set_self_longnick`，参数为`{"longNick": "唔，瓦拉瓦拉"}`，那么就可以这样调用。
```python
await bot._call_api("set_self_longnick",{"longNick": "唔，瓦拉瓦拉"})
```

## 发送消息
```
    async def send(self, event: EventBase, components: list[Union[MessageComponent, str]],Quote: bool=False):
        """
        构建并发送消息链。
    
        Args:
            components (list[Union[MessageComponent, str]]): 消息组件或字符串。
        """
```
目前event仅限GroupMessageEvent和PrivateMessageEvent，后面会提供更多兼容。

components见下一章节。
```
#调用示例
await bot.send(event,[Text("你好"),Image(file=path)])
await bot.send(event,Record(file=path))
```
## 发送私聊消息
```yaml
  async def send_friend_message(self, user_id: int, components: list[Union[MessageComponent, str]]):
```
基本同上。
## 发送群聊消息
```yaml
  async def send_group_message(self, group_id: int, components: list[Union[MessageComponent, str]]):
```
## 获取状态
```yaml
    async def get_status(self):
        """
        获取服务状态
        :return:
        """
```
## 撤回消息
```yaml
    async def recall(self, message_id: int):
        """
        撤回消息
        :param message_id:
        :return:
        """
```
## 上传私聊文件
```yaml
    async def upload_private_file(self,user_id: int,file: str,name: str=None):
        """
        上传私聊文件
        :param user_id:
        :param file:
               "file": "https://www.yujn.cn/api/heisis.php",
                // 本地文件
                // "file": "file://d:\\1.mp4"

                // base64文件
                // "file": "base64://xxxxxxxxxxxxx"
        :param name:
        :return:
        """
```
## 资料卡点赞
```yaml
    async def send_like(self,user_id:int):
        """
        发送点赞
        :param user_id:
        :return:
        """
```
## 获取好友列表
```yaml
    async def get_friend_list(self):
        """
        获取好友列表
        :return:
        """
```
## 删除好友
```yaml
    async def delete_friend(self,user_id: int):
        """
        删除好友
        :param user_id:
        :return:
        """
```
## 处理好友请求
```yaml
    async def handle_friend_request(self,flag: str,approve: bool,remark: str):
        """
        处理好友请求
        :param flag: 消息源中有
        :param approve:  状态
        :param remark:  备注
        :return:
        """
```
## 设置好友备注
```yaml
    async def set_friend_remark(self,user_id: int,remark: str):
        """
        设置好友备注
        :param user_id:
        :param remark:
        :return:
        """
```
## 设置好友分组
```yaml
    async def set_friend_category(self,user_id: int,category_id: int):
        """
        设置好友分组
        :param user_id:
        :param category_id:
        :return:
        """
```
## 获取陌生人信息
```yaml
    async def get_stranger_info(self,user_id: int):
        """
        获取陌生人信息
        :param user_id:
        :return:
        """
```
## 设置QQ头像
```yaml
    async def set_qq_avatar(self,file: str):
        """
        设置QQ头像
        :param file: http://，base64://,file://
        :return:
        """
```
## 获取群列表
```yaml
    async def get_group_list(self):
        """
        获取群列表
        :return:
        """
```
## 获取群信息
```yaml
    async def get_group_info(self,group_id: int):
        """
        获取群信息
        :param group_id:
        :return:
        """
```
## 获取群成员列表
```yaml
    async def get_group_member_list(self,group_id: int):
        """
        获取群成员列表
        :param group_id:
        :return:
        """
```
## 获取群成员信息
```yaml
    async def get_group_member_info(self,group_id: int,user_id: int):
        """
        获取群成员信息
        :param group_id:
        :param user_id:
        :return:
        """
```
## 群戳一戳
```yaml
    async def group_poke(self,group_id: int,user_id: int):
        """
        群戳一戳
        :param group_id:
        :param user_id:
        :return:
        """
```
## 处理入群请求
```yaml
    async def set_group_add_request(self,flag: str,approve: bool,reason: str):
        """
        处理加群请求
        :param flag: 请求id
        :param approve:
        :param reason:
        :return:
        """
```
## 退出群聊
```yaml
    async def quit(self,group_id: int):
        """
        退出群聊
        :param group_id:
        :return:
        """
```
## 设置管理员
```yaml
    async def set_group_admin(self,group_id: int,user_id: int,enable: bool):
        """
        设置群管理员
        :param group_id:
        :param user_id:
        :param enable: 设置/取消
        :return:
        """
```
## 设置群名片
```yaml
    async def set_group_card(self,group_id: int,user_id: int,card: str):
        """
        设置群名片
        :param group_id:
        :param user_id:
        :param card:
        :return:
        """
```
## 禁言群成员
```yaml
 async def mute(self,group_id: int,user_id: int,duration: int):
        """
        禁言群成员
        :param group_id:
        :param user_id:
        :param duration: 秒，0为解除禁言
        :return:
        """
```
## 全体禁言
```yaml
    async def set_group_whole_ban(self,group_id: int,enable: bool):
        """
        设置全员禁言
        :param group_id:
        :param enable:
        :return:
        """
```
## 设置群名称
```yaml
    async def set_group_name(self,group_id: int,group_name: str):
        """
        设置群名称
        :param group_id:
        :param group_name:
        :return:
        """
```
## 设置群头衔
```yaml
    async def set_group_special_title(self,group_id: int,user_id: int,special_title: str):
        """
        设置群头衔
        :param group_id:
        :param user_id:
        :param special_title:
        :return:
        """
```
## 踢出群成员
```yaml
    async def set_group_kick(self,group_id: int,user_id: int,reject_add_request: bool=True):
        """
        踢出群成员
        :param group_id:
        :param user_id:
        :param reject_add_request:
        :return:
        """
```
## 获取群荣誉信息
```yaml
    async def get_group_honor_info(self,group_id: int):
        """
        获取群荣誉信息. 壁画王。
        :param group_id:
        :return:
        """
```
## 获取群精华列表
```yaml
    async def get_essence_msg_list(self,group_id: int):
        """
        获取精华消息列表
        :param group_id:
        :return:
        """
```
## 设置群精华消息
```yaml
    async def set_essence_msg(self,message_id: int):
        """
        设置精华消息
        :param message_id:
        :return:
        """
```
## 删除群精华消息
```yaml
    async def delete_essence_msg(self,message_id: int):
        """
        删除精华消息
        :param message_id:
        :return:
        """
```
## 获取群文件目录列表
```yaml
    async def get_group_root_files(self,group_id: int):
        """
        获取群根目录文件列表，暂时看不出来有啥用
        :param group_id:
        :return:
        """
```
## 上传群文件
```yaml
    async def upload_group_file(self,group_id: int,file: str,name: str=None):
        """
        上传群文件。传好东西
        :param group_id:
        :param file:
        :param name:
        :return:
        """
```
## 删除群文件
```
    async def delete_group_file(self,group_id: int,file_id: str):
        """
        删除群文件。那个id是上传的时候给的
        :param group_id:
        :param file_id:
        :return:
        """
```
## 创建群文件夹
```yaml
 async def create_group_file_folder(self,group_id: int,name: str):
        """
        创建群文件夹
        :param group_id:
        :param name:
        :return:
        """
```
## 删除群文件夹
```yaml
    async def delete_group_folder(self,group_id: int,folder_id: str):
        """
        删除群文件夹
        :param group_id:
        :param folder_id:
        :return:
        """
```
## 获取群文件下载链接
```yaml
    async def get_group_file_url(self,file_id: str):
        """
        获取群文件下载链接,估计不大好用
        :param file_id:
        :return:
        """
```
## 发送群公告
```yaml
    async def _send_group_notice(self,group_id: int,content: str,image: str):
        """
        发送群公告
        :param group_id:
        :param content:
        :param image:  支持http://, file://, base64://
        :return:
        """
```
## 获取群公告
```yaml
    async def _get_group_notice(self,group_id: int):
        """
        获取群公告
        :param group_id:
        :return:
        """
```
## 获取群组忽略的加群请求
```yaml
    async def get_group_ignore_add_request(self,group_id: int):
        """
        获取群组忽略的加群请求
        :param group_id:
        :return:
        """
```
## 发送群签到
```yaml
    async def send_group_sign(self,group_id: int):
        """
        发送群签到
        :param group_id:
        :return:
        """
```
## 获取语音
```yaml
  async def get_record(self,file: str,out_format="mp3"):
```
## 获取视频
```yaml
async def get_video(self,url:str,path:str)
```