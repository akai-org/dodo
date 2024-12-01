#!/bin/bash

# Functions
function get_dodo_containers_info() {
    echo "[RUNNER] Checking already running services"
    docker ps -a --filter name=dodo --format "table {{.Names}}\t{{.Status}}"
}

# Init
cd ..
get_dodo_containers_info
echo -e "--------------------\n"

while [ true ]; do
    echo -n "Which compose profile? [db/backend/exit]: "
    read profile
    case $profile in
        backend)
            composeProfile=$profile
            break ;;
        db)
            composeProfile=$profile
            break ;;
        # frontend)
        #     composeProfile=$profile
        #     break ;;
        exit) exit 0 ;;
        *) echo "Wrong option!";;
    esac
done

while [ true ]; do
    echo -n "What would you like to do with compose? [up/down/exit]: "
    read operation
    case $operation in
        up)
            composeOper=$operation
            break ;;
        down)
            composeOper=$operation
            break ;;
        exit) exit 0 ;;
        *) echo "Wrong option!";;
    esac
done

echo "[RUNNER] Compose $composeOper - $composeProfile profiled"
addOper=""
if [ $composeOper == "up" ] ; then
    addOper="--build -d"
fi


docker compose \
--env-file="./apps/backend/.env.docker" \
--profile $composeProfile $composeOper $addOper

echo "Done"