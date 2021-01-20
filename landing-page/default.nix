{ pkgs ? import <nixpkgs> {} }:

pkgs.callPackage ./landing-page.nix { nodejs = pkgs.nodejs-12_x; }
