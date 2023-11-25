{ pkgs ? import <nixpkgs> {}}:

let
  chaoszone_cz =
    pkgs.haskellPackages.callCabal2nix "chaoszone" (gitignore ./.) {};
  gitignore = dir: pkgs.nix-gitignore.gitignoreSource [] dir;
in
  chaoszone_cz.env
