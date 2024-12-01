# DoDo App

## Scripts
On Linux & WSL use docker.sh in scripts directory to run compose

## Run in docker compose
### Run backend compose (**you must be in repository root directory**)
```sh
docker compose --env-file="./apps/backend/.env.docker" --profile backend up --build -d
```
### Remove backend compose
```sh
docker compose --env-file="./apps/backend/.env.docker" --profile backend down
```
--------
### Runing frontend compose currently not available