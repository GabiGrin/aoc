echo Day?
read day

echo Year?
read year

echo Scaffolding for day $day of year $year

mkdir -p $year

npx scaffolder-cli create new-day day=$day year=$year --entry-point $year

cd $year/$day

code .

echo Starting solver

npm start