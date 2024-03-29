#!/bin/bash

set -e

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
BASE="${SCRIPT_DIR}/.."

docker-compose -f ${BASE}/compose.yaml -f ${BASE}/compose.dev.yaml down --volumes

docker-compose -f ${BASE}/compose.yaml -f ${BASE}/compose.dev.yaml -f ${BASE}/compose.migration.yaml up --attach server.cityvizor --build server.cityvizor pgadmin.cityvizor