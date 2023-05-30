docker build -t noteflow-backend -f ./dockerfiles/bind.dockerfile .
docker tag noteflow-backend jounglab112a/noteflow-backend:latest
docker push jounglab112a/noteflow-backend:latest