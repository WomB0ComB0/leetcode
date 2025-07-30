#! /bin/bash

dirs=(
  "python"
  "typescript"
  "javascript"
  "java"
  "cpp"
  "c"
  "csharp"
  "dart"
  "php"
  "go"
  "rust"
  "ruby"
  "swift"
  "kotlin"
)

for i in ${!dirs[@]}; do
  rm -rf $dirs[$i]
done