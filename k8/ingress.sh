# git checkout mvp-frontend-integration
git checkout useraccounts-updated
docker-compose up -d --build            # rebuild images 
git checkout api-gateway-and-k8-files


# kubectl delete ns ingress-nginx
# kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.0.4/deploy/static/provider/cloud/deploy.yaml

# kubectl delete -f ./k8/services/1-frontend.yaml 
# kubectl delete -f ./k8/services/2-mongodb.yaml 
# kubectl delete -f ./k8/services/3-useraccount.yaml 
# kubectl delete -f ./k8/services/4-auctionroommanager.yaml 
# kubectl delete -f ./k8/services/5-auctiondetails.yaml 

kubectl apply -f ./k8/services/1-frontend.yaml 
kubectl apply -f ./k8/services/2-mongodb.yaml 
kubectl apply -f ./k8/services/3-useraccount.yaml 
kubectl apply -f ./k8/services/4-auctionroommanager.yaml 
kubectl apply -f ./k8/services/5-auctiondetails.yaml 

# 0. make sure ingress controller is installed and runningn 
# 1. get docker-compose running
# 1a curl into the docker machines make sure they work?
# 2. apply all the service and deployments
# 2a kubectl describe svc / deploy
# 3  apply ingress controller
# change nodeports to clusterip if not working

# docker-compose -d 
# kubectl get pods -n ingress-nginx \
#   -l app.kubernetes.io/name=ingress-nginx 

# kubectl get pods -n ingress-nginx \
#   -l app.kubernetes.io/name=ingress-nginx --watch



# FailedToUpdateEndpointSlices 


# kubectl delete -f ./k8/services/5-auctiondetails.yaml 
# kubectl apply -f ./k8/services/5-auctiondetails.yaml 
# curl -I localhost/auctiondetails
# kubectl delete -f ./k8/ingress/unauth-ingress.yaml 
# docker-compose unpause frontend
# kubectl apply -f ./k8/services/1-frontend.yaml 
kubectl delete ing auth-ingress
kubectl delete ing unauth-ingress
kubectl apply -f ./k8/ingress/unauth-ingress.yaml 
kubectl apply -f ./k8/ingress/auth-ingress.yaml 
kubectl get ingress 
kubectl logs -n ingress-nginx ingress-nginx-controller-5c8d66c76d-lwwrf
# kubectl logs ing auction-api-gateway


# done: 
# 1


# ./k8/ingress.sh

# docker-compose pause auctionbackend-auctionroommanager
# docker-compose pause auctionbackend-useraccount


# ppris@Priscilla MINGW64 ~/Downloads/offline-clones/cs3219-project-ay2122-2122-s1-g4 (api-gateway-and-k8-files)
# $ kubectl apply -f ./k8/ingress/unauth-ingress.yaml 
# Error from server (InternalError): error when creating "./k8/ingress/unauth-ingress.yaml": Internal error occurred: failed calling webhook "validate.nginx.ingress.kubernetes.io": Post "https://ingress-nginx-controller-admission.ingress-nginx.svc:443/networking/v1/ingresses?timeout=10s": dial tcp 10.105.184.196:443: connect: connection refused


# ppris@Priscilla MINGW64 ~/Downloads/offline-clones/cs3219-project-ay2122-2122-s1-g4 (api-gateway-and-k8-files)
# $ kubectl delete -A ValidatingWebhookConfiguration ingress-nginx-admission
# validatingwebhookconfiguration.admissionregistration.k8s.io "ingress-nginx-admission" deleted

# ppris@Priscilla MINGW64 ~/Downloads/offline-clones/cs3219-project-ay2122-2122-s1-g4 (api-gateway-and-k8-files)
# $ kubectl apply -f ./k8/ingress/unauth-ingress.yaml
# ingress.networking.k8s.io/auction-api-gateway created


# delteed the validation think. might be caused by version mismatch between that hook and k8 apparently.
# im not sure if the copied version is


# kubectl get all
# status suddenly showed auctiondetails is crashing


# docker exec -it <contname> //bin//bash
# kubectl exec <container> -- curl 


# curl -X POST localhost/useraccount/api/user/login           # 404 cannot post
# curl -X POST localhost/useraccount/api/user/register        # 404 cannot post
# curl localhost/useraccount/api/user/user                    # 404 cannot get
# curl localhost/test-unauth                                  # currently seems like wrong frontend page being served
curl localhost/auctiondetails/api/auctiondetails/:id        # is being directed to default backend
curl -X POST localhost/api/auctiondetails    # is being directed to default backend
curl localhost/auctionroom                                  # is being directed to default backend

# actually, backend 404 should be something different from frontend 404 no?

# curl --header "Content-Type: application/json" \
#   --request POST \
#   --data '{"username":"username1","password":"Pass_word1", "email":"e0411206@u.nus.edu", "confirmpassword":"Pass_word1"}' \
#   http://localhost/api/user/register

# curl localhost/test-auth   

curl -H 'Accept: application/json' -H \
"Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxMTExIiwiZW1haWwiOiJlMDAwMDExMUB1Lm51cy5lZHUiLCJpYXQiOjE2MzU1ODI3MDEsImV4cCI6MTYzNjAxNDcwMX0.JjvVfHEQAJjmM_VBiwuWdl4fPerBwpn1YSoM_y077TA" \
localhost/test-auth  

GET /:username
POST /transaction with body

curl -H 'Accept: application/json' -H \
"Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxMTExIiwiZW1haWwiOiJlMDAwMDExMUB1Lm51cy5lZHUiLCJpYXQiOjE2MzU1ODI3MDEsImV4cCI6MTYzNjAxNDcwMX0.JjvVfHEQAJjmM_VBiwuWdl4fPerBwpn1YSoM_y077TA" \
localhost/api/currency

function verifyIdentity(req, res, next) {
    if (req.headers['username'] !== req.params.username) {
        return res.sendStatus(403);
    }
    next();
}