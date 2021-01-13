{ pkgs, nodejs, stdenv, lib, ... }:

let
  packageName = "cityvizor-server";

  nodePackages = import ./node-composition.nix {
    inherit pkgs nodejs;
    inherit (stdenv.hostPlatform) system;
  };

  components = [ "index" "server" "worker" ];
in
nodePackages.package.override {
  nativeBuildInputs = [ pkgs.makeWrapper ];

  postInstall = lib.flip lib.concatMapStrings components (comp: ''
    makeWrapper '${nodejs}/bin/node' "$out/bin/${comp}" \
       --add-flags "$out/lib/node_modules/${packageName}/dist/${comp}.js"
  '');

  shellHook = ''
    echo 'Entering ${packageName} shell'
    export PATH="$(pwd)/dist/bin:$(npm bin):$PATH"
    npm install
  '';

  meta = with lib; {
    description = "CityVizor server";
    maintainers = with maintainers; [ sorki ];
    license = licenses.gpl3;
  };
}
