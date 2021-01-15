{ pkgs, nodejs, stdenv, lib, ... }:

let
  packageName = "cityvizor-client";

  nodePackages = import ./node-composition.nix {
    inherit pkgs nodejs;
    inherit (stdenv.hostPlatform) system;
  };

in
nodePackages.package.override {
  src = pkgs.nix-gitignore.gitignoreSource [] ./.;

  nativeBuildInputs = [ pkgs.makeWrapper ];

  prePatch = ''
    # required otherwise (angular/cli) build fails
    # on prompt for agreement with analytics
    export NG_CLI_ANALYTICS=false
  '';

  postInstall = ''
    # for ng build to work
    patchShebangs .

    # node2nix only runs `npm run rebuild`
    # and we also need `run build` which calls `ng build --prod`
    npm run build

    # we are only interested in `dist`
    cp -a dist/* $out/
    rm -rf $out/lib
  '';

  shellHook = ''
    echo 'Entering ${packageName} shell'
    export PATH="$(pwd)/dist/bin:$(npm bin):$PATH"
    npm install
  '';

  meta = with lib; {
    description = "CityVizor client";
    maintainers = with maintainers; [ sorki ];
    license = licenses.gpl3;
  };
}
