FROM node:lts
COPY ./noteflow-frontend /frontend
WORKDIR /frontend
RUN rm -r ./node_modules
EXPOSE 7414