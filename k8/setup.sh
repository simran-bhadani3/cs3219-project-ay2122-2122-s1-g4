# commands to get all our kube resources up 
kubectl apply -f ./k8/services/1-frontend.yaml 
kubectl apply -f ./k8/services/2-mongodb.yaml 
kubectl apply -f ./k8/services/3-useraccount.yaml 
kubectl apply -f ./k8/services/4-auctionroommanager.yaml 
kubectl apply -f ./k8/services/5-accountdetails.yaml
kubectl apply -f ./k8/ingress/unauth-ingress.yaml 
kubectl apply -f ./k8/ingress/auth-ingress.yaml 

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

# to view logs
# kubectl logs -n ingress-nginx ingress-nginx-controller-5c8d66c76d-lwwrf

# URLs that should work if yaml files are working correctly | status 
curl -X POST localhost/api/user/login                       # 404 cannot post
curl -X POST localhost/api/user/register                    # 404 cannot post
curl localhost/api/user/user                                # 404 cannot get
curl localhost/test-unauth                                  # currently seems like wrong frontend page being served
curl localhost/test-auth                                    # same as above
curl localhost/to-throw-error                               # correctly delivers the default backend. need specific link to 404 page 
curl localhost/auctiondetails/api/auctiondetails/:id        # is being directed to default backend
curl -X POST localhost/auctiondetails/api/auctiondetails    # is being directed to default backend
curl localhost/auctionroom                                  # is being directed to default backend
