# Build sources
echo "1/3 : Building Sources"

cd 'sources' || (echo 'Could not find sources' && exit)

tsc

uglifyjs --compress --output 'build/matrix.min.js' 'build/matrix.js'

# Build site
echo "2/3 : Building Site"

cd ..

tsc

uglifyjs --compress --output 'script.min.js' 'script.js'

# Build examples - MonaLisaFX
echo "3/3 : Building Example - MonaLisaFX"

cd 'examples/MonaLisaFX' || (echo 'Could not find MonaLisaFX' && exit)

tsc

uglifyjs --compress --output 'script.min.js' 'script.js'
