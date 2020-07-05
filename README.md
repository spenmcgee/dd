# dd

## dev mode

* install dependencies: `yarn add`
* install nodemon: `yarn add nodemon -g`
* run: `nodemon`
* go to: `http://localhost:3000/`

## build

* `DOCKER_HOST=<ip/host> docker build -t <namespace>/dd .`
* `DOCKER_HOST=<ip/host> docker push <namespace>/dd`

## deploy

* on node: `docker pull <namespace>/dd`
* `docker rm -f dd1`
* `docker run --restart=always -d -v /var/dd:/var/dd -p 80:3000 -p 3001:3001 -e "DATA_ROOT=/var/dd" --name=dd1 <namespace>/dd`
