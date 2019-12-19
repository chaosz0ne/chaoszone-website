let
  hsPkgs = import ./default.nix {};
in
  hsPkgs.chaoszone.components.all
