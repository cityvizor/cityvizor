#!/usr/bin/env nix-shell
#! nix-shell -i bash -p nodePackages.node2nix

set -eu -o pipefail

exec node2nix \
    --nodejs-12 \
    --development \
    -i package.json \
    -o node-packages.nix \
    -c node-composition.nix
