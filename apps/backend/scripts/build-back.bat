@ECHO OFF

ECHO Building docker image and setting up docker compose...
cd ..
docker-compose --env-file=.env.docker --profile backend up --build -d
ECHO Finished