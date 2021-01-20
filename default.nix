{ pkgs ? import (builtins.fetchTarball {
    url = "https://github.com/NixOS/nixpkgs/archive/a141de9f3a0d3c22f4dd6c8f1b8e7b90c245ea7a.tar.gz";
    sha256 = "0dcd4z36xy82kdm381vgxfpw33dp8wpd0464mbg7s8krns607ij1";
  })
  { overlays = [ (import ./overlay.nix) ]; }
}:

{
  inherit (pkgs.cityvizor)
    server
    server-kotlin
    client
    landing-page;
}
