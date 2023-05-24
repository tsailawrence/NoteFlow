# noteflow-backend

## Description
> NTU-IM SDM project

## development tools
### Database
1. postgresql
2. redis
3. mongodb

### backend
1. koa

### Tools
1. docker
2. postman
3. pgadmin4
4. vscode

## How to build up project
1. redis
    ```bash
    ## docker 版的 redis 常常會有連線不順的問題，所以在 docker compose 完後，需要運行另一個腳本：
    ## 1. 先將一般的資料庫起起來
    docker compose --env-file ./config/.env.development up -d
    ## 2. 運行 local 的 redis-server，如果沒有 redis-server 可以 brew install redis
    chmod 777 ./redis/run_redis_local.sh
    ./redis/run_redis_local.sh
    ```
2. database
    - database migrate
    ```bash
    npm run db:migrate
    ```
    - database seed
        ```bash
        npm run db:seed
        ```
    - database rollback
        ```bash
        npm run db:rollback
        ```
3. node.js
    ```bash
    npm run start
    ```
4. docker with environment
    ```bash
    docker compose --env-file ./config/.env.development up -d
    # 可以使用 docker compose down 關閉
    docker compose --env-file ./config/.env.development down
    ```
5. docker with DB mongo
    ```bash
    # 進入docker container-mongodb
    docker exec -it mongo /bin/bash

    # 使用superadmin-user

    mongosh -u user -p
    use noteflow
    db.createUsers(user:"user",pwd:"112a", roles:[{role:"readWrite",db:"noteflow"}])
    ```
6. test
    - 跑單元測試
        ```bash
        npm run test
        ```
    - 跑 code code coverage
        ```bash
        npm run test:coverage
        ```

## environment
### local, development
1. host
    > localhost
2. port
    | port  | services       |
    | ----- | -------------- |
    | 3000  | node.js        |
    | 27017 | mongo          |
    | 8081  | mongo express  |
    | 5432  | postgresql     |
    | 6379  | redis          |
    | 6380  | redis(session) |

### production
#TODO

## Documentation
| No  | docs              | location                                             |
| --- | ----------------- | ---------------------------------------------------- |
| 1   | API doc           | localhost:3000/swagger                               |
| 2   | project structure | [project structure](/markdowns/project_structure.md) |
| 3   | backend notes     | [backend notes](/markdowns/backend_notes.md)         |
