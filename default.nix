{ pkgs ? import <nixpkgs> { overlays = [ (import ./overlay.nix) ]; } }:

{
  inherit (pkgs.cityvizor)
    server
    server-kotlin
    client
    landing-page;
}
