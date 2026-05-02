# gptimage2
目前最强大的图像编辑模型
## 指令
```
/图像编辑   #随后发送文本和图像
/生图 xxxxx
/表情包制作   #随后发送图片和文本，基于【图像编辑】实现。生成3*3的表情包然后自动分割
```
## 配置方式
`run/ai_generated_art/config.yaml` webui中为ai绘画.config
```yaml
gptimage2:
  权限要求: 0   #使用gptimage2功能所需的权限等级，超过此等级不受次数限制
  model: "gpt-image-2"   # 模型名称，当前可用的模型有 "gpt-image-2" 和 "nano-banana-2" 建议gpt-image-2，效果更好。nanobanana将消耗双倍配额
  apikey: ''  # 项目群中获取
  aspect_ratio: '1:1'  # 生成图像的宽高比，常见的有 '1:1', '16:9', '4:3' 等，根据需要调整
  resolution: "1K"  #2k双倍配额消耗，且很可能生图失败。
  接管sd: false  #开启后将接管sd画图功能，使用gptimage2的接口进行画图（需要sdurl和apikey配置正确），不开启则正常使用sd接口画图
  bot_oc: "data/system/bot_oc.png" # bot的形象设定png，当要画bot自己时，依据此图像生成。
  extra_prompt: "赛璐璐风格。不必绘制过于繁复的服饰细节和发丝，不用完全还原参考图细节，保持角色可识别即可。允许简化。保持图片清晰"   #这两块建议ai生成
  character_anchor: "的固定外貌特征如下：粉色和蓝色渐变眼睛；少女体型；标志性服装为白色不对称吊带礼裙，腰间系蓝色细带蝴蝶结，裙摆呈不规则燕尾形；白色过膝袜配白色高跟鞋"
```
apikey前往api.apollodorus.xyz或项目群中获取，为项目用户准备了一些小小福利。