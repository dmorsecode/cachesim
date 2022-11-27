  _   _   _____            ____   ____       _      _____   _    ___    _ 
 | | | | |  ___|          / ___| |  _ \     / \    |___ /  / |  / _ \  / |
 | | | | | |_     _____  | |     | | | |   / _ \     |_ \  | | | | | | | |
 | |_| | |  _|   |_____| | |___  | |_| |  / ___ \   ___) | | | | |_| | | |
  \___/  |_|              \____| |____/  /_/   \_\ |____/  |_|  \___/  |_|
                                                                          
Dillon Morse
In order to install and compile my cache simulator, you must have NodeJS and NPM installed on your system. If you do, run "npm install" in your terminal when in the project directory. This will install the required npm module dependencies. Once finished, run "npm run build" to compile it, and then "npm run preview" to run the compiled version of this SvelteKit build locally. You will then need to open the page in your browser, presumably at https://127.0.0.1:4173 (your terminal will say). Alternatively, you can skip all of this and go to https://dmorsecachesim.netlify.app/ where I am hosting it already.

In either case, I cannot guarantee it will properly fit your screen size. The built-in graph may be cut off. If so, I recommend zooming out a bit to see it if you want. Do remember that the table showing the cache values can scroll both vertically and horizontally.

Once in the browser, usage should be self explanatory. Beware of entering extreme values (such as max cache size, min block size, and max associativity). They are likely to freeze your webpage will the simulation runs—rest assured, if you just leave it be (no matter how much your browser tells you that the page is frozen and you should close it) it WILL eventually finish and you will see the results.