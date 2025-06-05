{ pkgs ? import <nixpkgs> {}
, chaoszone ? import ./default.nix { inherit pkgs; packageName = "chaoszone"; }
}:

pkgs.mkShell {
  packages = with pkgs; [
    hugo
  ];
}
