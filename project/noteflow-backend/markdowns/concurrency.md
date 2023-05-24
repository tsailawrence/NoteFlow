## 事件委派

[知乎對於事件委派的詳解](https://blog.csdn.net/zn740395858/article/details/122157745#:~:text=%E4%BA%8B%E4%BB%B6%E5%A7%94%E6%B4%BE%EF%BC%9ARea,%E4%BB%B6%E7%9B%91%E5%90%AC%E5%92%8C%E5%A4%84%E7%90%86%E5%87%BD%E6%95%B0)

``` javascript
/*
ChatGPT: 如果您希望整個介面中的所有元素都能夠被拖動，那麼將事件監聽器添加到每個元素上可能會非常麻煩。幸運的是，您可以使用事件委派來將事件監聽器添加到父元素上，以便在所有子元素上觸發事件時處理該事件。

以下是一個使用事件委派來處理拖放事件的例子：
*/

import { useEffect, useRef } from 'react';

function MyComponent() {
    const dragContainerRef = useRef(null);

    useEffect(() => {
    const handleDragStart = (e) => {
    console.log('Drag started!', e.target);
    };

    const handleDrop = (e) => {
      e.preventDefault();
      console.log('Drop!', e.target);
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      console.log('Drag over!', e.target);
    };

    dragContainerRef.current.addEventListener('dragstart', handleDragStart);
    dragContainerRef.current.addEventListener('drop', handleDrop);
    dragContainerRef.current.addEventListener('dragover', handleDragOver);

    return () => {
        dragContainerRef.current.removeEventListener('dragstart', handleDragStart);
        dragContainerRef.current.removeEventListener('drop', handleDrop);
        dragContainerRef.current.removeEventListener('dragover', handleDragOver);
    };

    }, []);

    return (
    <div ref={dragContainerRef}>
    {/_ 所有可拖動的元素都在這裡 _/}
    </div>
    );
}
```

在 Flow 心智圖的部分
```javascript
/* 與創造元素相關 */
function ON_CREATE(e)
function ON_DELETE(e)

/* 與變動現成元素相關 */
function ON_CHOOSE(e) // 選擇的時候其他人要看到變色（變透明？）
function DE_CHOOSE(e) // 取消變色
function MOUSE_DOWN(e)
function DRAG_START(e) // 檢查別人有沒有 lock, 沒有的話取得 lock, 有的話會在 MOUSEUP 的時候取得 fail 的資訊，返回到 Server 現在認知的位置
function DROP(e)
function DRAG_OVER(e) // 跟 DROP 可能是一樣的，總之，會取得 success 或 fail 的資訊，如果 success 的話，會同步到其他的裝置上
function MOUSE_UP(e)

/* 與變動 Markdown 相關 */
function ON_EDITING(e)
// 其他可能必須仰賴 ot.js or sharedb
```
#### [ot.js-Github](https://github.com/Operational-Transformation/ot.js)
#### [sharedb-npm](https://www.npmjs.com/package/sharedb)