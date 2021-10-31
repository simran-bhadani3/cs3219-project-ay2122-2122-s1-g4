#!/bin/bash
# run using ./k8/setup1.sh
# kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.0.4/deploy/static/provider/cloud/deploy.yaml;
# kubectl apply -f ./k8/services/1-frontend.yaml;
kubectl apply -f ./k8/services/2-mongodb.yaml; 
# redis server needs to start before auctionroom
kubectl apply -f ./k8/services/7-redis.yaml ;
kubectl apply -f ./k8/services/3-useraccount.yaml; 
kubectl apply -f ./k8/services/4-auctionroommanager.yaml; 
kubectl apply -f ./k8/services/5-auctiondetails.yaml;
kubectl apply -f ./k8/ingress/unauth-ingress.yaml ;
kubectl apply -f ./k8/ingress/auth-ingress.yaml ;
kubectl apply -f ./k8/ingress/chat-ingress.yaml ;
# run this if frontend container has not been built
# docker run --publish 8080:3000 --name auctiondocker -i  -t auctionfrontend:latest  
docker container start auctiondocker