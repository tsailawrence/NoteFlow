# Note-flow
## project structure

```
├── node_modules        npm install 載好的 library 在這裡面
    ├── .bin            放下載的 library 提供的可執行檔
    ├── (libraries..)
├── .env                跑程式時會自動 import 的環境變數
├── .eslintrc.json      協助改善你的 Coding & Coding Style
├── .prettierrc         Prettify 你的 Code
├── README.md
├── docker-compose.yml  會直接透過 docker 部署的程式
├                       e.g. MongoDB & PostgreSQL
├── package.json        我們這個 project 的 overview &
├                       我們自行定義的運行腳本 &
├                       所有下載的 library 都會在這邊展示
├── package-lock.json   下載好的 library 具體版本 & dependency
└── src
    ├── app.js          entry point
    └── router.js       router
