{ pkgs ? import <nixpkgs> {} }:

pkgs.callPackage ./server.nix {}
