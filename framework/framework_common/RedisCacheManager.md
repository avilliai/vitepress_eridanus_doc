# Redis 缓存管理器 (RedisCacheManager)

高并发聊天、用户状态频繁读写、短时间内重复请求第三方 API……如果每一次都直奔硬盘或数据库，IO 迟早会被挤爆的哦！

`framework_common/database_util/RedisCacheManager.py` 是框架提供的轻量级、面向对象的高性能内存缓存封装。它支持自动连接管理、TTL 超时驱逐、结构化 JSON 自动编解码以及降级保护。

## 1. 创建缓存管理器实例

通过 `create_custom_cache_manager` 工厂函数可以按需获取指定 DB 编号和独立 TTL 的专用管理器：

```python
from framework_common.database_util.RedisCacheManager import create_custom_cache_manager

# 为自己的插件创建专属缓存（使用 DB 3，默认键过期时间 300 秒）
cache_mgr = create_custom_cache_manager(db_number=3, cache_ttl=300)
```

## 2. 常用操作 API

### 存储数据 (`set`)
支持直接存储字符串、字典或列表对象，底层会自动序列化：
```python
# 缓存用户的会话状态
cache_mgr.set("session:10001", {"mode": "drawing", "step": 2}, ttl=60)
```

### 获取数据 (`get`)
```python
session = cache_mgr.get("session:10001")
if session:
    print(session["mode"])
```

### 删除与批量清理 (`delete` / `clear`)
```python
cache_mgr.delete("session:10001")
```

## 3. 实战范例：防刷频与频繁 API 结果缓存

```python
async def query_expensive_api(keyword: str):
    cache_key = f"api_result:{keyword}"
    
    # 1. 优先查缓存
    cached_data = cache_mgr.get(cache_key)
    if cached_data:
        return cached_data
        
    # 2. 缓存未命中，调用耗时网络请求
    real_data = await fetch_from_remote(keyword)
    
    # 3. 写入缓存，保留 10 分钟 (600秒)
    cache_mgr.set(cache_key, real_data, ttl=600)
    return real_data
```

合理利用缓存，既能让机器人的回复速度达到毫秒级响应，又能大幅降低外部 API 的调用开销与服务器负载！
