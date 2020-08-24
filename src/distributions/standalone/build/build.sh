echo "PWD: ${PWD}"

echo "1/2 : Transpiling TypeScript..."
tsc
echo "1/2 : Done."

echo "2/2 : UglifyJS"
uglifyjs build/build.js -c -m -o build/min.js
echo "2/2 : Done."
