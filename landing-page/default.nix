{ pkgs ? import <nixpkgs> {} }:

pkgs.callPackage ./landing-page.nix {}
