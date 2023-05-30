FROM --platform=linux/amd64 node:20.2 as builder
COPY ./noteflow-frontend /frontend
WORKDIR /frontend
RUN yarn && yarn build

## backend

FROM --platform=linux/amd64 node:20.2

COPY --from=builder /frontend/dist ./dist
COPY ./noteflow-backend /backend
WORKDIR /backend

EXPOSE 3000
