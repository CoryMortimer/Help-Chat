########## FRONTEND BUILD ##########

stop-frontend:
	-docker stop chat-frontend-build-container
	-docker rm chat-frontend-build-container

build-frontend:
	docker build -t chat-frontend-build .

generate: stop-frontend build-frontend
	-rm -rf ./dist
	docker run -ti --name chat-frontend-build-container chat-frontend-build
	docker cp chat-frontend-build-container:/usr/src/app/dist .
	docker rm chat-frontend-build-container

########## SERVER ##########

stop-server:
	-docker stop server
	-docker rm server

build-server:
	docker build -t server-image server

run: stop-server build-server
	docker run -ti -p 3000:3000 -p 3001:3001 --name server server-image

########## Frontend-client ##########

stop-responding:
	-docker stop responding-client
	-docker rm responding-client

build-responding:
	docker build -t responding-client-image responding-client/

dev: stop-responding build-responding
	-docker network create help-chat
	docker run -ti -p 4200:4200 --network help-chat --name responding-client -v $(shell pwd)/responding-client/src:/usr/src responding-client-image ng serve --host 0.0.0.0 --proxy-config proxy.conf.json

########## Whole system ##########

down:
	docker-compose down

up: down stop-responding build-responding
	-docker network create help-chat
	docker create --name responding-client responding-client-image
	docker cp responding-client:/usr/dist proxy
	-docker rm responding-client
	docker-compose up -d --build
