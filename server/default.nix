{ pkgs ? import <nixpkgs> {} }:

pkgs.callPackage ./server.nix { nodejs = pkgs.nodejs-12_x; }
