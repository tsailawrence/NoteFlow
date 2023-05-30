FROM node:lts
COPY ./noteflow-frontend /frontend
WORKDIR /frontend
RUN yarn
RUN yarn build
EXPOSE 7414

CMD ["yarn", "preview"]