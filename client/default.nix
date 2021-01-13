{ pkgs ? import <nixpkgs> {} }:

pkgs.callPackage ./client.nix {}
