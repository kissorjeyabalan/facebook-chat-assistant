#!/usr/bin/env bash
set -e
printf "\033c"
docker-compose up -d
printf "\033c"
docker-compose logs -f