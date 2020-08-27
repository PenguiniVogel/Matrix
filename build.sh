# Build sources
cd 'sources' || (echo 'Could not find sources' && exit)

tsc

uglifyjs --compress --output 'build/matrix.min.js' 'build/matrix.js'

# Build site
cd ..

tsc

uglifyjs --compress --output 'script.min.js' 'script.js'

# Build examples - MonaLisaFX
cd 'examples/MonaLisaFX' || (echo 'Could not find MonaLisaFX' && exit)

tsc

uglifyjs --compress --output 'script.min.js' 'script.js'
