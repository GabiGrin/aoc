# Gabi's AOC Template / Runner

## Running

## Usage
1. Add an "aoc" property with a "day" and "year" attributes. Such as `"aoc": {"year": 2021, "day": 25}`
2. get your aoc `session` cookie value
3. AOC_SESSION='session' npm start

## Features
1. Auto download input as soon as it's ready
2. Auto runs tests in part1-tests / part2-tests
3. Once tests pass, a submission will be made with your real input! if it fails, auto-submit will stop for the day (saved in .aoc file)

## Todo
Think of how to keep just a single version of the solver for simplicty:
- clean test cases 
- mark this state somehow
- fetch the current state on load


