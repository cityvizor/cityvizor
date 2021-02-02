#!/bin/sh

wait_for_db=""
set_admin=''
mode=''

print_usage() {
  printf "Usage: -w (wait for database to respond) <DB_ADDRESS> \
  -a (set default administrator account with admin/admin credentials) \
  -m (set the command executed by npm)"
}

while getopts 'w:am:' flag; do
  case "${flag}" in
    w) wait_for_db="${OPTARG}" ;;
    a) set_admin='true' ;;
    m) mode="${OPTARG}" ;;
    *) print_usage
       exit 1 ;;
  esac
done

if [[ ! -z "$wait_for_db" ]]; then
    bash src/scripts/wait-for-it.sh -h "$wait_for_db" -p 5432
fi

npm run migrate:latest

if [[ ! -z "$set_admin" ]]; then
    npm run create-admin 
fi

npm run "$mode"
