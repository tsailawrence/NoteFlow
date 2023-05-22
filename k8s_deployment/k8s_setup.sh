source k8s_env.sh
envsubst < k8s-configMap.yml > k8s-configMap.yml
envsubst < k8s-secret.yml.yml > k8s-secret.yml.yml
kubectl apply -f k8s-configMap.yml
kubectl apply -f k8s-secret.yml
kubectl apply -f k8s-developments.yml
kubectl apply -f k8s-service.yml