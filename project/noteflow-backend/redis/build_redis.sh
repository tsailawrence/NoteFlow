if ["$(basename "$(pwd)")" = "redis"]; then
    echo "Current folder is redis!"
else
    cd redis
fi

cp redis.example.conf redis.conf
REDIS_PORT_=$(grep -E '^REDIS_PORT=[0-9]+$' ../config/.env.development | cut -d '=' -f 2)
echo "\n" >> redis.conf
echo "port ${REDIS_PORT_}" >> redis.conf

docker build -t noteflow-redis-ws .

cp redis.example.conf redis.conf
REDIS_SESS_PORT_=$(grep -E '^REDIS_SESSION_PORT=[0-9]+$' ../config/.env.development | cut -d '=' -f 2)
echo "\n" >> redis.conf
echo "port ${REDIS_SESS_PORT_}" >> redis.conf

docker build -t noteflow-redis-session .
