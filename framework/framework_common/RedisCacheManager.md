# redis缓存管理器

先来看redis的工作原理
![raw300](/img_11.png)

由于业务需要，我们需要将一些数据缓存到redis中，以提高访问速度。比如在ai对话时获取用户信息，在Eridanus中，获取用户信息的操作十分频繁。        
但直接连接数据库有一个问题是会导致数据库压力过大，所以我们可以将用户信息缓存到redis中，这样当用户再次访问时，直接从redis中获取即可。      
## RedisCacheManager
RedisCacheManager是Eridanus框架中用于管理redis缓存的类。我们将通过一个简单的业务需求来演示RedisCacheManager的使用。    
比如在一个web场景中，缓存用户对主体颜色的偏好。
```python
from typing import Optional

from framework_common.database_util.RedisCacheManager import create_custom_cache_manager

# 创建用户缓存管理器（db1，TTL 为 120 秒）
cache = create_custom_cache_manager(db_number=3,cache_ttl = 120)
# 示例：缓存用户设置
def cache_user_settings(user_id: int, settings: dict) -> bool:
    # 设置缓存
    cache_key = f"settings:{user_id}"
    success = cache.set(cache_key, settings)

    if success:
        print(f"用户 {user_id} 的设置已缓存")
    else:
        print(f"用户 {user_id} 的设置缓存失败")

    return success


# 示例：获取用户设置
def get_user_settings(user_id: int) -> Optional[dict]:
    # 从缓存获取设置
    cache_key = f"settings:{user_id}"
    settings = cache.get(cache_key)

    if settings:
        print(f"从缓存获取用户 {user_id} 的设置")
        return settings
    else:
        print(f"用户 {user_id} 的设置未在缓存中找到")
        return None


user_settings = {"theme": "dark", "language": "en"}
cache_user_settings(1001, user_settings)  # 设置key和balue
retrieved_settings = get_user_settings(1001)  # 通过key获取缓存
print(retrieved_settings)  # 输出: {'theme': 'dark', 'language': 'en'}
```
好的，恭喜你学会redis了，快去逝世吧！
## RedisCacheManager类
```python
class RedisCacheManager:
    """Redis缓存管理器"""
    .......
    def is_connected(self) -> bool:
        """检查Redis连接状态"""
        return self.redis_client is not None

    def get(self, key: str) -> Optional[Any]:
        """获取缓存数据"""

    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> bool:
        """设置缓存数据"""

    def delete(self, key: str) -> bool:
        """删除指定缓存"""

    def delete_pattern(self, pattern: str) -> bool:
        """删除匹配模式的缓存"""

    def exists(self, key: str) -> bool:
        """检查缓存是否存在"""

    def expire(self, key: str, ttl: int) -> bool:
        """设置缓存过期时间"""

    def get_keys(self, pattern: str = "*") -> List[str]:
        """获取匹配模式的所有键"""

    def flush_db(self) -> bool:
        """清空当前数据库"""

    def get_info(self) -> Dict[str, Any]:
        """获取缓存统计信息"""

    @classmethod
    def get_all_connections_info(cls) -> Dict[int, Dict[str, Any]]:
        """获取所有连接的信息"""

    @classmethod
    def close_all_connections(cls):
        """关闭所有Redis连接"""

    def __del__(self):
        """析构函数 - 清理资源"""
        # 注意：不在这里关闭连接，因为连接是共享的
        pass

    def __repr__(self):
        return f"RedisCacheManager(db_number={self.db_number}, connected={self.is_connected()})"
```
