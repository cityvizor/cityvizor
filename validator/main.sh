#!/bin/bash
set -e

if [ ! -d "validator-venv/" ]; then
  echo "Initialising virtualenv - this is one off"
  virtualenv -p python3 validator-venv
  echo "virtualenv initialisation done"
fi

source validator-venv/bin/activate
pip3 install -U -r requirements.txt
python3 main.py "$@"
deactivate
