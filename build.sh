#!/usr/bin/env bash
set -e
printf "\033c"
docker-compose up --build -d
printf "\033c"
docker-compose logs -f
