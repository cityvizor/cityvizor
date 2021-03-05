#!/bin/bash

mode='start'
do_install=''

print_usage() {
  printf "Usage: -a (set default administrator account with admin/admin credentials) \
  -m (set the command executed by npm) \
  -i (install npm dependencies before running anything else)"
}

while getopts 'w:am:i' flag; do
  case "${flag}" in
    m) mode="${OPTARG}" ;;
    i) do_install='true' ;;
    *) print_usage
       exit 1 ;;
  esac
done

if [[ ! -z "$do_install" ]]; then
    npm install
fi

npm run "$mode"
