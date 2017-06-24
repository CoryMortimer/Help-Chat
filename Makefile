stop:
	-docker stop chat-frontend-build-container

build:
	docker build -t chat-frontend-build .

run: stop build
	-rm -rf ./dist
	docker run -ti --name chat-frontend-build-container chat-frontend-build grunt
	docker cp chat-frontend-build-container:/usr/src/app/dist .
	docker rm chat-frontend-build-container