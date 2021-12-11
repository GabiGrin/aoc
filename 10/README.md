# Gabi's AOC Template / Runner

## Running

## Usage
1. Add an "aoc" property with a "day" and "year" attributes. Such as `"aoc": {"year": 2021, "day": 25}`
2. get your aoc `session` cookie value
3. AOC_SESSION='session' npm start
4. npm start
5. put some tests cases in the tests folder (expected input and outputs in relevant files)
6. go to `solve.ts` and start hacking! Once your tests pass, it'll try to submit the solution automatically

## Features
1. Auto download input as soon as it's ready
2. Auto runs tests in tests folder
3. Once tests pass, a submission will be made with your real input! if it fails, auto-submit will stop for the day (saved in .aoc file)
4. Once part1 is completed it'll auto backup your solution and reset tests!



