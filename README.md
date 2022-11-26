# Dillon Morse — Cache Sim

This SvelteKit-powered website simulates hits and misses in a cache size using trace files as input (either included with the project or provided by the user in the proper format). The cache size, associativity, block size, and replacement method are configurable.

The included graph is a plot of the resulting hit rate with various configurations when parsing the provided gcc.trace file.

You can find an online demo [HERE](https://dmorsecachesim.netlify.app/).

## Trace Format

Traces should be in the following format with lines separated by newline `\n` characters:

```bash
l 0x0000AA40 1
l 0x0000AA40 1
l 0x0000AA40 1
l 0x0000F231 1
l 0x8000AA40 1
```

The first character and last character are ignored and only the HEX address is used in this simulation.

## Line-by-line Delay

This setting changes how fast the simulator will parse a given trace file. Setting it to values at 5ms or higher will allow you to watch the table representing the cache as it goes through the trace file, however for large trace files this will make the simulation time take a minimum of 20 minutes.

Values lower than 4-5 (depending on browser) will result in a delay of ZERO milliseconds due to browser limitations with JavaScript's setInterval() method. Thus, using an extremely low value will have the simulator speed through the trace file as fast as possible, most likely causing your browser to lock up in the meantime. However, it does finish running through the file around ~25x faster in my testing, so there's that.

## Building

To build and compile your own local copy of this Cache Simulator, you must clone this project, install dependencies, and then build with the following commands:

```bash
npm install
npm run build
```

You can preview the production build with `npm run preview`.
To run a development server instead, use `npm run dev` instead.
