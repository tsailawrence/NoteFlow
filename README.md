# Noteflow
[![CI - unit-test](https://github.com/tsailawrence/NoteFlow/actions/workflows/node.js.yml/badge.svg)](https://github.com/tsailawrence/NoteFlow/actions/workflows/node.js.yml)

[![CD - Deploy to GKE](https://github.com/tsailawrence/NoteFlow/actions/workflows/gke_deployment.yml/badge.svg)](https://github.com/tsailawrence/NoteFlow/actions/workflows/gke_deployment.yml)

## 前後端開發

```bash
docker compose --env-file .env.local up -d
## frontend will be open on 7415 by default.
## but for same origin policy, you must not specify port when you want to access noteflow.
## you need to install and configure nginx for non-port support.
## (as a result, typing "localhost" into browser is sufficient to enter into noteflow.)
## if you want to change port, feel free to change .compose.env
## where variable name is *-EXPOSE-PORT.
## but you should edit the port at nginx.conf either.

docker compose --env-file .env.local down
## compose for the first time will take longer time
## because it has to install all the dependencies.
## you can always use "docker logs <container name>" to see how it is going.
```

開發完畢，build docker

```bash
./backend.build.sh      ## build backend
./frontend.build.sh     ## build frontend
```

Configure Nginx in MacOS

```bash
## install nginx using brew, in Linux, try using apt-get install.
brew install nginx

## try default nginx to see whether it works.
nginx

## move our server config into nginx configuration directory.
mkdir /opt/homebrew/etc/nginx/servers
sudo mv ./template/noteflow.nginx.conf /opt/homebrew/etc/nginx/servers/noteflow.conf
## furthermore, you need to edit noteflow.conf where it is left unfilled.
## e.g. <cert_file> & <key_file>. you can fill the path of cert & key in frontend folder.

## make nginx test to see whether the new conf is valid
nginx -t

## if it is valid, kill original nginx and open new one.
lsof -i :8080
kill <pid>
nginx
```
