{ pkgs
, lib
, nodejs
#, mkYarnPackage
, makeWrapper
, apiBaseUrl ? "/api/v2/service/citysearch"
}:

let
  yarn = pkgs.yarn.override { inherit nodejs; };
  mkYarnPackage = (pkgs.yarn2nix-moretea.override { inherit nodejs yarn; }).mkYarnPackage;
in
mkYarnPackage rec {
  src = pkgs.nix-gitignore.gitignoreSource [] ./.;

  packageJSON = ./package.json;
  yarnLock = ./yarn.lock;
  yarnNix = ./yarn.nix;

  yarnPreBuild = ''
      mkdir -p $HOME/.node-gyp/${nodejs.version}
      echo 9 > $HOME/.node-gyp/${nodejs.version}/installVersion
      ln -sfv ${nodejs}/include $HOME/.node-gyp/${nodejs.version}
    '';

  pkgConfig = {
      node-sass = {
        buildInputs = [ pkgs.python pkgs.libsass pkgs.pkgconfig];
        postInstall = ''
          LIBSASS_EXT=auto yarn --offline run build
          rm build/config.gypi
        '';
      };
  };

  nativeBuildInputs = [ makeWrapper ];
  postBuild = ''
    VUE_APP_API_BASE_URL='${apiBaseUrl}' yarn build
  '';

  installPhase = ''
    mkdir $out
    cp -a node_modules/cityvizor-client-redesign/dist/* $out/
  '';

  distPhase = ":"; # disable useless $out/tarballs directory

  meta = with lib; {
    description = "CityVizor landing-page";
    maintainers = with maintainers; [ sorki ];
    license = licenses.gpl3;
  };

}
