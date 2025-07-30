#!/bin/bash

# Array of programming language directories to create
directories=(
    "python"
    "typescript"
    "javascript"
    "java"
    "cpp"
    "c"
    "dart"
    "php"
    "csharp"
    "go"
    "rust"
    "ruby"
    "swift"
    "kotlin"
)

for dir in "${directories[@]}"; do
    mkdir -p "$dir"
    touch "$dir/README.md"
    echo "Created directory: $dir"
done

chmod +x setup.sh

echo "Setup complete! Language directories have been created."
