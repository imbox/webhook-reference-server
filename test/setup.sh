#!/bin/bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
(
  cd "$DIR"

  docker-compose down -v
  docker-compose up -d

  SLEEP_TIME=60
  echo "Sleep for $SLEEP_TIME seconds..."
  sleep $SLEEP_TIME
)
