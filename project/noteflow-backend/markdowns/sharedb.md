```javascript
// 在 index.js

import { QuillProvider } from "./useQuill";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <QuillProvider>
            <App />
        </QuillProvider>
    </React.StrictMode>
);

// 在想要使用 quill editor 的頁面：

import { useQuill } from "./useQuill";

const SomeReactComponent = () => {
    const { OpenEditor, setIdentity } = useQuill();

    useEffect(() => {
        OpenEditor("richtext");
    }, []);

    return (
        <div id="editor" />
    )
}
```

注意事項：
```javascript
// 在成功登入後 setIdentity, 裡面至少要有 name
setIdentity({..., name: "your name"});
```

[JSON1 Spec](https://github.com/ottypes/json1/blob/master/spec.md)

Three Phases:
1. Pickup phase：把子樹從 JSON 裡面給拿出來
2. Drop phase：把子樹放進 JSON 裡面
3. Edit phase：修改子樹的內容

```bash
## p: pickup 拿起來； d: drop 放進去； e 修改（et: type, es: string, na: number)
[['x', {p: 0}], ['y', {d: 0, es:[5, 'hi']}]]
```
1. ['x', {p: 0}] 把 doc.x 取出來，放在儲物櫃 0
2. ['y', {d: 0}] 把 doc.y 裡面的內容，變成儲物櫃 0 裡面的東西
3. ['y', {es: [5, 'hi']}] 把 doc.y 插入 hi 在第五個位置上

其他範例：
```bash
{ x:5, y:['happy', 'apple'] }

## 插入 z = 6; i: insert literal 插入字元
['z', {i: 6}]
## 把 doc.x 變成 doc.z
[['x', {p: 0}], ['z', {d: 0}]]

[['x', {p: 0}], ['y', 1, {d: 0}]]
-> {y: ['happy', 5, 'apple']}

## 還沒有提到的是 r: remove

## 複合：a.x = 1; a.y = 2;
['a', ['x', {i:1}], ['y', {i:2}]]

## 先處理 doc.x.y 移除的事項, 再處理 doc.x; then doc.z
[['x', {p:0}, 'y', {r:true}], ['z', {d:0}]]

```