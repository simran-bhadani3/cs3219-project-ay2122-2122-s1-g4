# commented out everything that's not needed to setup the api gateway
# run using ./k8/setup.sh

# commands to get all our kube resources up 
kubectl apply -f ./k8/services/1-frontend.yaml 
kubectl apply -f ./k8/services/2-mongodb.yaml 
kubectl apply -f ./k8/services/3-useraccount.yaml 
kubectl apply -f ./k8/services/4-auctionroommanager.yaml 
kubectl apply -f ./k8/services/5-accountdetails.yaml
kubectl apply -f ./k8/ingress/unauth-ingress.yaml 
kubectl apply -f ./k8/ingress/auth-ingress.yaml 


# clean up
# kubectl delete deployment frontend
# kubectl delete service frontend

# kubectl delete deployment useraccount
# kubectl delete service useraccount

# kubectl delete deployment auctionroommanager
# kubectl delete service auctionroommanager

# kubectl delete deployment accountdetails
# kubectl delete service accountdetails

# kubectl delete deployment mongodb
# kubectl delete service mongodb

# kubectl delete -f ./k8/ingress/unauth-ingress.yaml 
# kubectl delete -f ./k8/ingress/auth-ingress.yaml 


# to view logs
# kubectl logs -n ingress-nginx <controllername>


# cURLs for quick testing if yaml files are working correctly | status 
# curl -X POST localhost/api/user/login                       # works, just throws error because no body
# curl -X POST localhost/api/user/register                    # ^
# curl localhost/api/user/user                                # ^
# curl localhost/test-auth                                    # same as above
# curl localhost/to-throw-error                               # 404
