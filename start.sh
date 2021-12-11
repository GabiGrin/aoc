YEAR=2021

echo Day?
read DAY

echo Scaffolding for day $DAY of year $YEAR

npx scaffolder-cli create new-day day=$DAY year=$YEAR
cd $DAY

code .

echo Starting solver

npm start