#!/bin/bash

export NODE_ENV=development
export VITE_DEV=1
export NOTEFLOW_BACKEND=backend
export PHOTO_FS=noteflow.live
export BACKEND_EXPOSE_PORT=3000
export FRONTEND_EXPOSE_PORT=7415
export MONGO_EXPRESS_EXPOSE_PORT=8082

export MONGO_HOST=localhost
export MONGO_DB=noteflow
export MONGO_INITDB_ROOT_USERNAME=root
export MONGO_INITDB_ROOT_PASSWORD=112a
export MONGO_NOTEFLOW_USERNAME=jounglab
export MONGO_NOTEFLOW_PASSWORD=112a
export MONGO_PORT=27017

export MONGO_EXPRESS_HOST=mongo-express
export MONGO_EXPRESS_USERNAME=jounglab112a
export MONGO_EXPRESS_PASSWORD=112a

export POSTGRES_HOST=localhost
export POSTGRES_DB=noteflow
export POSTGRES_USER=user
export POSTGRES_PASSWORD=112a
export POSTGRES_PORT=5432

export REDIS_HOST=localhost
export REDIS_PORT=6383
export REDIS_ACCOUNT=default
export REDIS_PASSWORD=ntuim-sdm-6

export secret=secret

export S3_BUCKET_REGION=ap-northeast-1

export EMAIL_HOST=https://localhost
export EMAIL_USER=sdmnoteflow@gmail.com
export EMAIL_PASSWORD=jounglab112a
export REFRESH_TOKEN=1//04vU3MLSFDeuHCgYIARAAGAQSNwF-L9IrVWpGmc-faTN90oNZhAmsz6bSihr37YJOdwlzRybSY697OZCe0VHQh0vQYTHfpAJckbQ
export CLIENT_SECRET=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
export CLIENT_ID=390935399634-bpk359lp2lks426la19bk11b1hv9c4m8.apps.googleusercontent.com

npm run coverage