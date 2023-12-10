{ pkgs ? import <nixpkgs> {}}:

let
  chaoszone_cz =
    pkgs.haskellPackages.callCabal2nix "chaoszone" (gitignore ./.) {};
  gitignore = dir: pkgs.nix-gitignore.gitignoreSource [] dir;
in
  pkgs.haskellPackages.shellFor {
    packages = p: [ chaoszone_cz ];
    withHoogle = true;
    buildInputs = with pkgs.haskellPackages; with pkgs; [
      haskell-language-server
      ghcid
      cabal-install
      vim
    ];
  }
