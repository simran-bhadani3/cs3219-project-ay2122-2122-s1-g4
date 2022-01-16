# CS3219: e_Auction Website

# To our users

Hi auctioneer, welcome to the github repo of the e_auction website! 

Head over to our auction homepage to get started with your auction: http://34.124.196.146/

# For graders  

Please find our report [4-FinalReport-1.pdf](4-FinalReport-1.pdf) in our repo's root directory.

# For developers 

If you want to manually setup the entire project and run everything locally, here are the steps.

Assuming the repo has been cloned locally and docker desktop with kubernetes enabled is available, 

1. Go to the root folder and run 'docker-compose build' to build images. 
2. To run the metrics server for the HPA to work run `kubectl apply -f ./k8/hpa/metrics-server.yaml` from the root folder.
3. Also, ensure that nginx-ingress controller is configured properly by running `kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.0.4/deploy/static/provider/cloud/deploy.yaml`

4. Make sure the `./k8/setup.sh` and `./k8/teardown.sh` files are in LF mode for End of line sequence
5. Then from a wsl/linux terminal, run `./k8/setup.sh` . This will ensure that the backend microservices are running in the docker-desktop Kubernetes cluster and are exposed through the Ingresses we configured.
6. To run the frontend, go to the ./frontend directory from the root folder.
7. Run yarn add all to install the necessary node modules.
8. Finally, run yarn start to run the frontend. The frontend client should be running on [http://localhost:3000/](http://localhost:3000/)


