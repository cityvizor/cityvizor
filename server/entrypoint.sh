#!/bin/bash

wait_for_host=''
set_admin=''
mode=''
do_install=''

print_usage() {
  printf "Usage: -w (wait for database to respond) <TARGET_ADDRESS:TARGET_PORT> \
  -a (set default administrator account with admin/admin credentials) \
  -m (set the command executed by npm) \
  -i (install npm dependencies before running anything else)"
}

while getopts 'w:am:i' flag; do
  case "${flag}" in
    w) wait_for_host="${OPTARG}" ;;
    a) set_admin='true' ;;
    m) mode="${OPTARG}" ;;
    i) do_install='true' ;;
    *) print_usage
       exit 1 ;;
  esac
done

if [[ ! -z "$do_install" ]]; then
    npm install
fi

if [[ ! -z "$wait_for_host" ]]; then
    bash src/scripts/wait-for-it.sh "$wait_for_host"
fi

npm run migrate:latest

if [[ ! -z "$set_admin" ]]; then
    npm run create-admin
fi

npm run "$mode"
