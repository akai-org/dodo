#!/bin/bash

docker compose --env-file="../.env.docker" --profile frontend up --build -d