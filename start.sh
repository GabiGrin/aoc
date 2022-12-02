YEAR=2022

echo Day?
read DAY

echo Scaffolding for day $DAY of year $YEAR

npx scaffolder-cli create new-day day=$DAY year=$YEAR
cd $DAY

code solution/solve.ts
code tests/case1-output
code tests/case1-input

echo Starting solver

npm start