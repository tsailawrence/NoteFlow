1. Access Control
2. Data Protection
3. Encryption
4. Secure Architecture
5. Secure Deployment

## Security Model
我們不可以直接將 Redis 的 TCP Port 或 UNIX Socket 直接暴露在整個網路上，因為這樣會非常地危險。
####
Redis 可以作為一個資料庫、快取或是一個通訊的系統。Redis 可以被用來產生頁面，或是執行用戶要求的動作。我們可以知道 Web Application（例如瀏覽器）就介在使用者和 Redis 之間。我們如果能夠為這個中間層加上一層 ACL，這樣才可以去驗證用戶的輸入，並且決定什麼該做、什麼不該做。
## Network Security
非信任的用戶對於 Redis 的請求必須要一概拒絕（但我們應該不會遇到這樣子嚴重的問題，因為會對 Redis 請求的只有後端）。我們如果把電腦架在虛擬機器上，例如 Linode 或 EC2，Redis 盡量要只能從 Loopback interface 中找到（localhost）。如果對 redis.conf 什麼都不做的
話，會預設進行 Protected Mode，除非你顯性地 bind 所有 interface，那麼你就是想做死，Redis 會同意你的請求。
```bash
# 只有在本機才可以連進 Redis 中 
bind 127.0.0.1
# 必須要做出保護，不然壞人可以用「FLUSHALL」直接把整個資料庫刪除
```
####
（但是如果將 Kubernetes 給納入考慮的話，這個問題就會變得比較麻煩。我應該要想出一個辦法，只把 Redis 暴露給 Kube 集群裡面的其他容器就好，這個時候應該要創建一個 Redis 的 Service 對象。
```bash
# 在 redis.conf 裡面打入這串字
bind 0.0.0.0

# 在 kubectl 中創建一個 service
kubectl create service redis --tcp=6379:6379
```
這個時候會創建一個名字叫做 Redis 的 Service。Service 預設來說都是只會暴露給集群裡面的容器而已（ClusterIP），Kubernetes 會為這個 Service 對象建立分配一個 DNS 名稱，所以這個時候就可以得到：
####
{Redis: redis.\<namespace>.svc.cluster.local}
####
所以當我們輸入以下指令時，便會成功進入 Redis：
```bash
redis-cli -h redis -p 6379
```
（ClusterIP 只會暴露給集群裡面的容器而已，如果想要暴露給整個網路，提供外界服務的話，應該會需要選擇其他 Service 類型 e.g. NodePort, LoadBalancer，或是研究一下 Ingress）

## Authentication
1. 舊方法：修改 Redis.conf，並且透過裡面的 requirepass flag 來給資料庫一個密碼，所有用戶就用這個密碼。這個密碼通常要非常非常長，因為一來是 Redis 運算非常快，二來是去 Redis.conf 拿就好，不需要記起來。之後的用戶都必須要用 AUTH，也不會再服務沒有 AUTH 的用戶。
2. 推薦的方法：使用 [Access Control List](https://redis.io/docs/management/security/acl/)。

## Access Control List
在連接之後，用戶需要提供一個 Username 以及有效的密碼來驗證自己，接著，Redis 會根據 Username 被給予的權限來提供服務。
這次的專案可以不需要用到 ACL。在 RedisClient 在連接的時候，需要提供以下格式的 URL，而如果使用 Legacy 的登入方法，username 即是 default。
####
redis[s]://[[username][:password]@][host][:port][/db-number]
####

## Redis Pub/Sub
[Publish/Subscribe messaging paradigm](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern)
####
會被推播出去的消息們會被分為不同的渠道，Publisher 根據消息的分類丟進分別的渠道裡面、Subscriber 根據自己的喜好選擇渠道。這樣子的 Producer-Consumer 架構可以使得兩方盡可能地解耦，達到更好的 Scalability & 更動態彈性的 Topology

```bash
# 這代表訂閱某個特定的 channel
SUBSCRIBE channel11 4chan(client)
```
之後，進到 Channel11 的消息會隨著被 Publish 的時間點，一個一個被推播給 4chan 知道。
####
在 Redis 的串流協議 RESP2（REdis Serialization Protocol）中，每一個消息都會有一個 Title，他們可能包括：PING, PSUBSCRIBE, PUNSUBSCRIBE, QUIT, RESET, SSUBSCRIBE, SUBSCRIBE, SUNSUBSCRIBE, UNSUBSCRIBE。
####
每一個 Client 只能送 (UN)SUBSCRIBE，上面的這些 Title 都是由系統訂定及發送；在 RESP3 中，這個限制會消失。
####
* 必須要很了解的是，Redis 的 Stream 預設是 At-most-once 的這種運送哲學。也就是說，如果你沒有辦法 handle 收到的訊息而想要重新請求的話，這是做不到的。必須要去研究 [Redis Streams](https://redis.io/docs/data-types/streams-tutorial/)，才可以設計 At-least-once 的 semantic。