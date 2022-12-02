# Advent of Code Runner, Solver, and Solutions

- A [scaffolder](https://github.com/galElmalah/scaffolder) template that includes a CLI helper + useful library for solving AoC using 
TypeScript. Uses 
- My solutions

_Note: most solution code is committed as-is, and is optimized for solution speed and nothing else. This means mutations, loops, and many other things I'll never do in production code :)_


## Features
- Auto downloads input file 
- Auto submits the real answer once test cases pass
- if the real submission fails, auto-submit will stop for the day (saved in .aoc file)
- Once part 1 is completed it'll auto-backup your solution and reset test outputs
- Built-in common utils (vectors, math, graphs, matrices) 
- [WallabyJS](https://wallabyjs.com/) support


## Using the template + runtime
1. npm install in the root folder
2. `AOC_SESSION=[your-session] npm start`
3. choose the day
4. the solver will start running
5. put some tests cases in the tests folder (expected input and outputs in relevant files)
6. go to `solve.ts` and start hacking! Once your tests pass, it'll try to submit the solution automatically

Note: to run it afterward just `AOC_SESSION=[your-session] npm start` to start the runtime

**ProTip™** - add to your `bashsrc`/`zshrc` `export AOC_SESSION="[session here"]` to avoid having to pass the session explicitly. Remember to remove it afterward though.



