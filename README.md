# chaoszone.cz

The source files for the <https://chaoszone.cz> website.

# hugo

- hugo is a static site generator
- to start the development server 
  - with docker: ```docker run --rm -p 1313:1313 -v ./:/src hugomods/hugo:exts-non-root server -D``` 
  - local: ```hugo server```
- to build the website 
  - with docker: ```docker run --rm -v ./:/src hugomods/hugo:exts-non-root build``` 
  - local: ```hugo```


## todo

- ascii art: https://designs.events.ccc.de/Hackover_2017/Hackover_2017-Visual.png
- play section
  - game of live
  - raindrop: https://experiments.p5aholic.me/day/005/
  - pong
  - space invader: https://designs.events.ccc.de/GPN8/GPN8-Visual.png
  - poly play: Wasserleck https://flashmuseum.org/poly-play/
  - alien attack: https://www.asciiart.eu/ascii-games/minigames
- subpages
  - projects
    - cookbook
    - Bezirksschilder
    - sampler
    - E-Paper ink
  - events