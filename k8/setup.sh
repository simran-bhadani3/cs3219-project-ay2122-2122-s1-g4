# commands to get all our kube resources up 
kubectl apply -f ./k8/services/1-frontend.yaml 
kubectl apply -f ./k8/services/2-mongodb.yaml 
kubectl apply -f ./k8/services/3-useraccount.yaml 
kubectl apply -f ./k8/services/4-auctionroommanager.yaml 
kubectl apply -f ./k8/services/5-accountdetails.yaml
kubectl apply -f ./k8/ingress/unauth-ingress.yaml 

# clean up
kubectl delete deployment frontend
kubectl delete service frontend

kubectl delete deployment useraccount
kubectl delete service useraccount

kubectl delete deployment auctionroommanager
kubectl delete service auctionroommanager

kubectl delete deployment accountdetails
kubectl delete service accountdetails

kubectl delete deployment mongodb
kubectl delete service mongodb

kubectl delete -f ./k8/ingress/unauth-ingress.yaml 

# kubectl rollout status deployment/auctiondetails
# kubectl get ingress  --watch
# kubectl delete ing auth-ingress
# kubectl delete ing unauth-ingress
