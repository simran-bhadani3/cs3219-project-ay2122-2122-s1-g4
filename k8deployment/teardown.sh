#!/bin/bash 
# ./k8/teardown.sh
# kubectl delete -f ./k8deployment/services/1-frontend.yaml;
# kubectl delete -f ./k8deployment/services/2-mongouseraccounts.yaml; 
# kubectl delete -f ./k8deployment/services/10-mongoauctiondetails.yaml; 
kubectl delete -f ./k8deployment/services/3-useraccount.yaml; 
kubectl delete -f ./k8deployment/services/4-auctionroommanager.yaml; 
kubectl delete -f ./k8deployment/services/5-auctiondetails.yaml;
kubectl delete -f ./k8deployment/services/6-currencymanagement.yaml
kubectl delete -f ./k8deployment/services/7-redis.yaml;
kubectl delete -f ./k8deployment/services/9-auctionroom.yaml
kubectl delete -f ./k8deployment/ingress/unauth-ingress.yaml ;
kubectl delete -f ./k8deployment/ingress/auth-ingress.yaml ;
kubectl delete -f ./k8deployment/ingress/chat-ingress.yaml ;
docker stop auctiondocker;