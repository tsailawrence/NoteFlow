source k8s_env.sh
envsubst < k8s-configMap.yml > k8s-configMapOut.yml
envsubst < k8s-secret.yml > k8s-secretOut.yml
kubectl apply -f k8s-configMapOut.yml
kubectl apply -f k8s-secretOut.yml
kubectl apply -f k8s-pv.yml
kubectl apply -f k8s-deployments.yml
kubectl apply -f k8s-service.yml