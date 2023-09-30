#!/bin/bash

set -e

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
BASE="${SCRIPT_DIR}/.."

docker-compose -f ${BASE}/docker-compose.yml -f ${BASE}/docker-compose.dev.yml down --volumes

docker-compose -f ${BASE}/docker-compose.yml -f ${BASE}/docker-compose.dev.yml -f ${BASE}/docker-compose.migration.yml up --attach server.cityvizor.otevrenamesta --build server.cityvizor.otevrenamesta pgadmin.cityvizor.otevrenamesta