FROM --platform=linux/amd64 node:20.2
COPY ./noteflow-backend /backend
COPY ./noteflow-frontend/dist /backend/dist
WORKDIR /backend
RUN rm -r ./node_modules
EXPOSE 3000