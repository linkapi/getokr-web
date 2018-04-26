#!/bin/bash

# exclusão dos containers
docker rm -f getokr_front

# exclusão das imagens
docker rmi -f getokr/getokr_front

docker build -f Dockerfile -t getokr/getokr_front .

#executa o front
docker run --restart=always -d -p 80:80 \
        --name getokr_front getokr/getokr_front

