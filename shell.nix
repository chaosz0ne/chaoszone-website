{ pkgs ? import <nixpkgs> {}
, chaoszone ? import ./default.nix { inherit pkgs; packageName = "chaoszone"; }
}:

pkgs.haskellPackages.shellFor {
  packages = p: [ chaoszone ];
  withHoogle = true;
  buildInputs = with pkgs.haskellPackages; with pkgs; [
    haskell-language-server
    ghcid
    cabal-install
    vim
  ];
}
