{ pkgs ? import <nixpkgs> {}
, self ? ./., packageName ? "chaoszone"
}:
let
  gitignore = dir: pkgs.nix-gitignore.gitignoreSource [] dir;
in
  pkgs.haskellPackages.callCabal2nix packageName (gitignore self) {}
