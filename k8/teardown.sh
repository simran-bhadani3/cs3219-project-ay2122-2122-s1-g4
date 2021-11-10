#!/bin/bash 
# ./k8/teardown.sh
kubectl delete -f ./k8/services/2-mongodb.yaml; 
# comment out mongodb stuff to keep persistent info
kubectl delete -f ./k8/services/2-mongouseraccounts.yaml; 
kubectl delete -f ./k8/services/10-mongoauctiondetails.yaml; 
kubectl delete -f ./k8/services/3-useraccount.yaml; 
kubectl delete -f ./k8/services/4-auctionroommanager.yaml; 
kubectl delete -f ./k8/services/5-auctiondetails.yaml;
kubectl delete -f ./k8/services/6-currencymanagement.yaml
kubectl delete -f ./k8/services/7-redis.yaml;
kubectl delete -f ./k8/services/9-auctionroom.yaml
kubectl delete -f ./k8/ingress/unauth-ingress.yaml ;
kubectl delete -f ./k8/ingress/auth-ingress.yaml ;
kubectl delete -f ./k8/ingress/chat-ingress.yaml ;
# docker rm auctiondocker;
# docker stop auctiondocker;