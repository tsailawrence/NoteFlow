FROM --platform=linux/amd64 node:lts
COPY ./noteflow-backend /backend
WORKDIR /backend
RUN rm -r ./node_modules
EXPOSE 3000