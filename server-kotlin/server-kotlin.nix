{ stdenv, nix-gitignore, gradle }:

stdenv.mkDerivation {
  name = "server-kotlin";
  src = nix-gitignore.gitignoreSource [] ./.;

  buildInputs  = [ gradle ];

  buildPhase = ''
    export GRADLE_USER_HOME=$(mktemp -d)
    gradle --no-daemon build -x test
  '';

  installPhase = ''
    mkdir $out
    cp build/libs/server-0.0.5.jar $out/
  '';

  outputHashAlgo = "sha256";
  outputHashMode = "recursive";
  outputHash = "0p67md5mlznhjcac3rb1x9i4n3g4pvbdfm105fz6q9m41bdypcgj";
}
