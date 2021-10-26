# commands to get all our kube resources up 

# clean up
kubectl delete -f "./k8/services/auctiondetails.yaml"
kubectl delete -f "./k8/controllers/auctiondetails.yaml"

kubectl apply -f "./k8/services/auctiondetails.yaml"
kubectl apply -f "./k8/controllers/auctiondetails.yaml"
kubectl rollout status deployment/auctiondetails