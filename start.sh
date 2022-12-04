YEAR=2022

echo Day?
read DAY

echo Scaffolding for day $DAY of year $YEAR

npx scaffolder-cli create new-day day=$DAY year=$YEAR
cd $DAY

code .
code tests/case1-input
code tests/case1-output
code solution/solve.ts

echo Starting solver

npm start