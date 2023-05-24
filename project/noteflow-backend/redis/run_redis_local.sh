#!/bin/bash
if [ "$(basename "$(pwd)")" = "redis" ]; then
    echo "Current folder is redis!"
else
    cd redis
fi

REDIS_PORT_=$(grep -E '^REDIS_PORT=[0-9]+$' ../config/.env.development | cut -d '=' -f 2)
REDIS_PID=$(lsof -t -i :${REDIS_PORT_})
if [ -n ${REDIS_PID} ]; then
    echo "PID ${REDIS_PID} is currently working at ${REDIS_PORT_}, kill."
    kill ${REDIS_PID}
fi


REDIS_SESS_PORT_=$(grep -E '^REDIS_SESSION_PORT=[0-9]+$' ../config/.env.development | cut -d '=' -f 2)
REDIS_PID2=$(lsof -t -i :${REDIS_SESS_PORT_})
if [ -n ${REDIS_PID2} ]; then
    echo "PID ${REDIS_PID2} is currently working at ${REDIS_SESS_PORT_}, kill."
    kill ${REDIS_PID2}
fi

sleep 1

redis-server --port ${REDIS_PORT_} --daemonize yes --loglevel verbose
redis-server --port ${REDIS_SESS_PORT_} --daemonize yes --loglevel verbose

echo "Two servers are currently working at port ${REDIS_PORT_} and ${REDIS_SESS_PORT_}!"