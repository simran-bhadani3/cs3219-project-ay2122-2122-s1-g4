#!/bin/bash
# run using ./k8/setup1.sh
# run this if nginx ingress not configured
# kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.0.4/deploy/static/provider/cloud/deploy.yaml;
# changed to individual mongodb containers
kubectl apply -f ./k8/services/2-mongodb.yaml; 
kubectl apply -f ./k8/services/2-mongouseraccounts.yaml; 
kubectl apply -f ./k8/services/10-mongoauctiondetails.yaml; 
# redis server needs to start before auctionroom
kubectl apply -f ./k8/services/7-redis.yaml ;
kubectl apply -f ./k8/services/3-useraccount.yaml; 
kubectl apply -f ./k8/services/5-auctiondetails.yaml;
kubectl apply -f ./k8/ingress/unauth-ingress.yaml ;
kubectl apply -f ./k8/ingress/auth-ingress.yaml ;
kubectl apply -f ./k8/ingress/chat-ingress.yaml ;
kubectl apply -f ./k8/services/6-currencymanagement.yaml
kubectl apply -f ./k8/services/9-auctionroom.yaml
# comment this out if first time running auctiondocker container(doesn't exists)
# docker rm auctiondocker;
# run this if frontend container has not been built(if the first time running this script)
# docker run -d --publish 3000:3000 --name auctiondocker -i  -t auctionfrontend:latest  
# docker container start auctiondocker
# wait for redis to start first
sleep 20s
kubectl apply -f ./k8/services/4-auctionroommanager.yaml; 
