docker build -t noteflow-frontend -f ./dockerfiles/frontend.dockerfile .
docker tag noteflow-frontend jounglab112a/noteflow-frontend:latest
docker push jounglab112a/noteflow-frontend:latest