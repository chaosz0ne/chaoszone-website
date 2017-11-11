# chaoszone.cz

The source files for the <https://chaoszone.cz> website.

## New post

to write new posts just invoke `newpost.sh`. This will guide you through the
process.

after you have written and saved the new post, add the post (you can find it in
`site/posts/`) to the repo, commit and push it. The hook shoudl rebuild the site
content.

## Altering building process

For altering the building process, you may edit the `src/Main.hs` file. To
actually see your results, contact me at <nek0@nek0.eu> so I can rebuild the
executable for the static site generator.
