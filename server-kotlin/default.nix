{ pkgs ? import <nixpkgs> {} }:

pkgs.callPackage ./server-kotlin.nix {}
