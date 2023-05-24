FROM mongo:6.0.5
COPY ./mongo/mongo-init.js /docker-entrypoint-initdb.d/mongo-init.js:ro
WORKDIR /frontend
RUN rm -r ./node_modules
EXPOSE 7414