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