kubectl apply -f ./k8/hpametrics-server.yaml
docker-compose build
./k8/setup.sh
./k8/teardown.sh
cd ./frontend
yarn add
yarn start
curl localhost:3000
cd ..