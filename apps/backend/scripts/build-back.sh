#!/bin/bash

docker compose --env-file="../.env.docker" --profile backend up --build -d