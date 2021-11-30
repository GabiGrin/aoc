# Advent of code solutions + template 

Whatever managed to solve the day fast I push.
As-is. 0 refactoring. Many variables named "bob"

## Using the template + runtime
1. npm install in root
2. npm start in root
3. choose day and year
4. cd to that folder, and `AOC_SESSION=[your-session] npm start` to start the runtime
5. put some tests cases in the tests folder (expected input and outputs in relevant files)
6. go to `solve.ts` and start hacking! Once your tests pass, it'll try to submit the solution automatically

## Template Runtime Features
1. Auto download input as soon as it's ready
2. Auto runs tests in tests folder
3. Once tests pass, a submission will be made with your real input! if it fails, auto-submit will stop for the day (saved in .aoc file)
4. Once part1 is completed it'll auto backup your solution and reset tests!


