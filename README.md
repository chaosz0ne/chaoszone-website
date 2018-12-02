# chaoszone.cz

The source files for the <https://chaoszone.cz> website.

## Dependencies

This site is built using [Hakyll](https://jaspervdj.be/hakyll).
To be able to build and run this, you need to install the following:

* ghc
* cabal-install
* alex
* happy
* zlib1g-dev

## New post

To write new posts just invoke `newpost.sh`. This will guide you through the
process.

After you have written and saved the new post, add the post (you can find it in
`site/posts/`) to the repo, commit and push it.

## Build and deploy

### NixOS

After cloning the repo and changing into the repo directory,
you can invoke

```bash
nix-shell shell.nix
```

to build a shell with
all dependencies in it. After that, you invoke

```bash
cabal new-run -- chaoszone build && cabal new-run -- chaoszone deploy
```

to build the static sites and eploy them in one step.

### Other \*nix

After cloning the repo, you change into the directory and invoke

```
cabal new-update
```

to initialize your cabal package repository list. After that you can run

```bash
cabal new-run -- chaoszone build && cabal new-run -- chaoszone deploy
```

to build the static sites and eploy them in one step.

## Altering building process

For altering the building process, you may edit the `src/Main.hs` file. To
actually see your results, contact me at <nek0@nek0.eu> so I can rebuild the
executable for the static site generator.
