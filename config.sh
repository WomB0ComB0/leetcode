#!/usr/bin/env bash

# Strict mode for better error handling
set -euo pipefail

# Color constants
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly NC='\033[0m' # No Color

# Language extensions mapping
declare -A LANGUAGE_EXTENSIONS=(
    ["python"]="py"
    ["typescript"]="ts"
    ["javascript"]="js"
    ["java"]="java"
    ["cpp"]="cpp"
    ["c"]="c"
    ["csharp"]="cs"
    ["dart"]="dart"
    ["php"]="php"
    ["go"]="go"
    ["rust"]="rs"
    ["ruby"]="rb"
    ["swift"]="swift"
    ["kotlin"]="kt"
)

# Logging function
log() {
    local level="$1"
    local message="$2"
    local color

    case "$level" in
        "info") color="$YELLOW" ;;
        "success") color="$GREEN" ;;
        "error") color="$RED" ;;
        *) color="$NC" ;;
    esac

    echo -e "${color}[${level^^}] ${message}${NC}" >&2
}

# Configuration file generators
generate_python_config() {
    local configs=("pyproject.toml" "setup.cfg" ".flake8")

    for config in "${configs[@]}"; do
        if [[ -f "$config" ]]; then
            log "info" "Skipping $config (already exists)"
            continue
        fi

        case "$config" in
            "pyproject.toml")
                cat > "$config" << EOF
[tool.black]
line-length = 88
target-version = ['py39']
include = '\.pyi?$'

[tool.isort]
profile = "black"
multi_line_output = 3

[tool.mypy]
python_version = "3.9"
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true

[tool.pytest.ini_options]
minversion = "6.0"
addopts = "-ra -q"
testpaths = ["tests"]
EOF
                ;;
            "setup.cfg")
                cat > "$config" << EOF
[metadata]
description-file = README.md

[flake8]
max-line-length = 88
extend-ignore = E203, W503
exclude = .git,__pycache__,build,dist
EOF
                ;;
            ".flake8")
                cat > "$config" << EOF
[flake8]
max-line-length = 88
extend-ignore = E203, W503
exclude =
    .git,
    __pycache__,
    build,
    dist
EOF
                ;;
        esac

        log "success" "Created $config"
    done
}

generate_typescript_config() {
    local configs=("tsconfig.json" "biome.json")

    for config in "${configs[@]}"; do
        if [[ -f "$config" ]]; then
            log "info" "Skipping $config (already exists)"
            continue
        fi

        case "$config" in
            "tsconfig.json")
                cat > "$config" << EOF
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022", "DOM"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true
  },
  "include": ["**/*.ts", "**/*.js"],
  "exclude": ["node_modules"]
}
EOF
                ;;
            "biome.json")
                cat > "$config" << EOF
{
  "$schema": "https://biomejs.dev/schemas/1.4.1/schema.json",
  "formatter": {
    "enabled": true,
    "indentWidth": 2,
    "lineWidth": 100
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  }
}
EOF
                ;;
        esac

        log "success" "Created $config"
    done
}

generate_rust_config() {
    if [ -d "rust" ]; then
        echo -e "${YELLOW}Configuring Rust...${NC}"

        # Create necessary directories
        mkdir -p rust/src
        mkdir -p rust/tests
        mkdir -p rust/benches
        mkdir -p rust/easy
        mkdir -p rust/medium
        mkdir -p rust/hard

        # Create lib.rs
        cat > rust/src/lib.rs << EOF
//! LeetCode solutions library

pub mod easy;
pub mod medium;
pub mod hard;
EOF

        # Create mod.rs files for each difficulty
        for dir in easy medium hard; do
            mkdir -p rust/src/${dir}
            cat > rust/src/${dir}/mod.rs << EOF
// Solutions for ${dir} problems
EOF
        done

        # Cargo.toml
        cat > rust/Cargo.toml << EOF
[package]
name = "leetcode-solutions"
version = "0.1.0"
edition = "2021"

[dependencies]
anyhow = "1.0"
thiserror = "2.0.6"

[dev-dependencies]
criterion = "0.5"
pretty_assertions = "1.0"

[target.'cfg(target_os = "windows")'.dependencies]
winapi = { version = "0.3.9", features = ["winuser", "wingdi"] }

[workspace]
members = [
    "easy/*",
    "medium/*",
    "hard/*"
]

[[bench]]
name = "benchmarks"
harness = false
EOF

        # Create basic benchmark file
        cat > rust/benches/benchmarks.rs << EOF
use criterion::{criterion_group, criterion_main, Criterion};

fn benchmark(_c: &mut Criterion) {
    // Add benchmarks here
}

criterion_group!(benches, benchmark);
criterion_main!(benches);
EOF

        # Create basic test file
        cat > rust/tests/integration_tests.rs << EOF
use leetcode_solutions;

#[test]
fn it_works() {
    assert!(true);
}
EOF

        # rustfmt.toml
        cat > rust/rustfmt.toml << EOF
max_width = 100
tab_spaces = 4
edition = "2021"
format_strings = true
imports_granularity = "Module"
EOF

        echo -e "${GREEN}Created Rust configuration files${NC}"
    fi
}

generate_go_config() {
    local configs=("go.mod" ".golangci.yml")

    for config in "${configs[@]}"; do
        if [[ -f "go/$config" ]]; then
            log "info" "Skipping go/$config (already exists)"
            continue
        fi

        case "$config" in
            "go.mod")
                cat > "go/$config" << EOF
module project

go 1.21

require (
    github.com/stretchr/testify v1.8.4
)
EOF
                ;;
            ".golangci.yml")
                cat > "$config" << EOF
linters:
  enable-all: true
  disable:
    - exhaustivestruct
    - golint
    - interfacer
    - maligned
    - scopelint

linters-settings:
  govet:
    check-shadowing: true
  gocyclo:
    min-complexity: 15
  dupl:
    threshold: 100
EOF
                ;;
        esac

        log "success" "Created go/$config"
    done
}

generate_java_config() {
    local configs=("pom.xml" ".editorconfig")

    for config in "${configs[@]}"; do
        if [[ -f "java/$config" ]]; then
            log "info" "Skipping java/$config (already exists)"
            continue
        fi

        case "$config" in
            "pom.xml")
                cat > "java/$config" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.project</groupId>
    <artifactId>main</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <version>5.9.2</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>
EOF
                ;;
            ".editorconfig")
                cat > "$config" << EOF
root = true

[*]
charset = utf-8
end_of_line = lf
indent_size = 4
indent_style = space
insert_final_newline = true
max_line_length = 120
trim_trailing_whitespace = true
EOF
                ;;
        esac

        log "success" "Created java/$config"
    done
}

generate_cpp_config() {
    local configs=("CMakeLists.txt" ".clang-format")

    for config in "${configs[@]}"; do
        if [[ -f "cpp/$config" ]]; then
            log "info" "Skipping cpp/$config (already exists)"
            continue
        fi

        case "$config" in
            "CMakeLists.txt")
                cat > "cpp/$config" << EOF
cmake_minimum_required(VERSION 3.20)
project(Project)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Add main executable
add_executable(main main.cpp)

# Enable testing
enable_testing()

# Add Google Test
find_package(GTest REQUIRED)
include_directories(\${GTEST_INCLUDE_DIRS})

# Add test executable
add_executable(test_main test_main.cpp)
target_link_libraries(test_main \${GTEST_LIBRARIES} pthread)
add_test(NAME test_main COMMAND test_main)
EOF
                ;;
            ".clang-format")
                cat > "$config" << EOF
---
Language: Cpp
BasedOnStyle: Google
IndentWidth: 4
ColumnLimit: 100
AllowShortFunctionsOnASingleLine: Empty
AllowShortIfStatementsOnASingleLine: Never
BreakBeforeBraces: Attach
SpaceBeforeParens: ControlStatements
---
EOF
                ;;
        esac

        log "success" "Created cpp/$config"
    done
}

generate_csharp_config() {
    local configs=("Directory.Build.props" "stylecop.json")

    for config in "${configs[@]}"; do
        if [[ -f "csharp/$config" ]]; then
            log "info" "Skipping csharp/$config (already exists)"
            continue
        fi

        case "$config" in
            "Directory.Build.props")
                cat > "csharp/$config" << 'EOF'
<Project>
  <PropertyGroup>
    <TargetFramework>net7.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
    <WarningLevel>5</WarningLevel>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.CodeAnalysis.CSharp" Version="4.5.0" />
    <PackageReference Include="StyleCop.Analyzers" Version="1.2.0-beta.507" />
  </ItemGroup>
</Project>
EOF
                ;;
            "stylecop.json")
                cat > "$config" << 'EOF'
{
  "\$schema": "https://raw.githubusercontent.com/DotNetAnalyzers/StyleCopAnalyzers/master/StyleCop.Analyzers/StyleCop.Analyzers/Settings/stylecop.schema.json",
  "settings": {
    "documentationRules": {
      "companyName": "YourCompanyName"
    }
  }
}
EOF
                ;;
        esac

        log "success" "Created csharp/$config"
    done
}

generate_php_config() {
    if [ -d "php" ]; then
        echo -e "${YELLOW}Configuring PHP...${NC}"

        # composer.json
        cat > php/composer.json << EOF
{
    "name": "leetcode/php",
    "description": "Data Structures and Algorithms in PHP",
    "type": "project",
    "require": {
        "php": ">=7.4"
    },
    "require-dev": {
        "phpunit/phpunit": "^9.5"
    },
    "autoload": {
        "psr-4": {
            "leetcode\\\\": "src/"
        }
    },
    "autoload-dev": {
        "psr-4": {
            "leetcode\\\\Tests\\\\": "tests/"
        }
    }
}
EOF

        # php-cs-fixer config
        cat > php/.php-cs-fixer.php << EOF
<?php
return (new PhpCsFixer\Config())
    ->setRules([
        '@PSR2' => true,
        'array_syntax' => ['syntax' => 'short'],
        'ordered_imports' => ['sort_algorithm' => 'alpha'],
        'no_unused_imports' => true,
    ])
;
EOF
        echo -e "${GREEN}Created PHP configuration files${NC}"
    fi
}

generate_dart_config() {
    if [ -d "dart" ]; then
        echo -e "${YELLOW}Configuring Dart...${NC}"

        # pubspec.yaml
        cat > dart/pubspec.yaml << EOF
name: leetcode
description: Data Structures and Algorithms implementation in Dart.
version: 1.0.0

environment:
  sdk: ">=3.0.0 <4.0.0"

dev_dependencies:
  test: ^1.24.0
  lints: ^3.0.0
EOF

        # analysis_options.yaml
        cat > dart/analysis_options.yaml << EOF
include: package:lints/recommended.yaml

analyzer:
  strong-mode:
    implicit-casts: false
    implicit-dynamic: false
EOF
        echo -e "${GREEN}Created Dart configuration files${NC}"
    fi
}

generate_ruby_config() {
    if [ -d "ruby" ]; then
        echo -e "${YELLOW}Configuring Ruby...${NC}"

        # Gemfile
        cat > ruby/Gemfile << EOF
source "https://rubygems.org"

gem "rspec", "~> 3.12"
gem "rake", "~> 13.0"
gem "rubocop", "~> 1.50"
EOF

        # .rubocop.yml
        cat > ruby/.rubocop.yml << EOF
AllCops:
  NewCops: enable
  TargetRubyVersion: 2.7

Style/Documentation:
  Enabled: false

Metrics/MethodLength:
  Max: 20
EOF
        echo -e "${GREEN}Created Ruby configuration files${NC}"
    fi
}

generate_kotlin_config() {
    if [ -d "kotlin" ]; then
        echo -e "${YELLOW}Configuring Kotlin...${NC}"

        # build.gradle.kts
        cat > kotlin/build.gradle.kts << EOF
plugins {
    kotlin("jvm") version "1.9.0"
}

repositories {
    mavenCentral()
}

dependencies {
    testImplementation(kotlin("test"))
    testImplementation("org.junit.jupiter:junit-jupiter:5.9.2")
}

tasks.test {
    useJUnitPlatform()
}
EOF

        # settings.gradle.kts
        cat > kotlin/settings.gradle.kts << EOF
rootProject.name = "leetcode-kotlin"
EOF
        echo -e "${GREEN}Created Kotlin configuration files${NC}"
    fi
}

generate_swift_config() {
    if [ -d "swift" ]; then
        echo -e "${YELLOW}Configuring Swift...${NC}"

        # Package.swift
        cat > swift/Package.swift << EOF
// swift-tools-version:5.5
import PackageDescription

let package = Package(
    name: "leetcode",
    products: [
        .library(name: "leetcode", targets: ["leetcode"]),
    ],
    targets: [
        .target(name: "leetcode", dependencies: []),
        .testTarget(name: "leetcodeTests", dependencies: ["leetcode"]),
    ]
)
EOF

        # .swiftlint.yml
        cat > swift/.swiftlint.yml << EOF
disabled_rules:
  - trailing_whitespace
opt_in_rules:
  - empty_count
  - missing_docs
line_length:
  warning: 120
  error: 200
EOF
        echo -e "${GREEN}Created Swift configuration files${NC}"
    fi
}

generate_c_config() {
    if [ -d "c" ]; then
        echo -e "${YELLOW}Configuring C...${NC}"

        # CMakeLists.txt
        cat > c/CMakeLists.txt << EOF
cmake_minimum_required(VERSION 3.10)
project(leetcode C)

set(CMAKE_C_STANDARD 11)
set(CMAKE_C_STANDARD_REQUIRED ON)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

# Enable testing
enable_testing()

# Add Unity Test Framework
include(FetchContent)
FetchContent_Declare(
    unity
    GIT_REPOSITORY https://github.com/ThrowTheSwitch/Unity.git
    GIT_TAG v2.5.2
)
FetchContent_MakeAvailable(unity)

# Add source files
file(GLOB_RECURSE SOURCES "src/*.c")
file(GLOB_RECURSE TEST_SOURCES "tests/*.c")

# Create library
add_library(leetcode_lib \${SOURCES})
target_include_directories(leetcode_lib PUBLIC include)

# Create test executable
add_executable(leetcode_tests \${TEST_SOURCES})
target_link_libraries(leetcode_tests PRIVATE leetcode_lib unity)

# Register tests
add_test(NAME unit_tests COMMAND leetcode_tests)
EOF

        # .clang-format
        cat > c/.clang-format << EOF
---
Language: C
BasedOnStyle: LLVM
IndentWidth: 4
UseTab: Never
BreakBeforeBraces: Allman
AllowShortIfStatementsOnASingleLine: false
IndentCaseLabels: false
ColumnLimit: 100
AlignTrailingComments: true
SpaceAfterCStyleCast: true
PointerAlignment: Right
SortIncludes: true
---
EOF

        # .clang-tidy
        cat > c/.clang-tidy << EOF
---
Checks: '*,
        -llvmlibc-*,
        -altera-*,
        -fuchsia-*,
        -llvm-header-guard,
        -modernize-macro-to-enum,
        -cppcoreguidelines-*'
WarningsAsErrors: ''
HeaderFilterRegex: ''
AnalyzeTemporaryDtors: false
FormatStyle: file
CheckOptions:
  - key: readability-identifier-length.MinimumVariableNameLength
    value: 2
  - key: readability-identifier-length.MinimumParameterNameLength
    value: 2
EOF

        # compile_commands.json template
        cat > c/compile_commands.json << EOF
[
  {
    "directory": "\${workspaceFolder}/build",
    "command": "gcc -I\${workspaceFolder}/include -c \${file} -o \${fileDirname}/\${fileBasenameNoExtension}.o",
    "file": "\${file}"
  }
]
EOF

        echo -e "${GREEN}Created C configuration files${NC}"
    fi
}

# Main configuration generator
generate_config() {
    local lang="$1"

    # Validate language
    if [[ ! -d "$lang" ]]; then
        log "error" "Language directory '$lang' not found. Skipping."
        return 1
    fi

    case "$lang" in
        "python") generate_python_config ;;
        "typescript"|"javascript") generate_typescript_config ;;
        "rust") generate_rust_config ;;
        "go") generate_go_config ;;
        "java") generate_java_config ;;
        "cpp") generate_cpp_config ;;
        "c") generate_c_config ;;
        "csharp") generate_csharp_config ;;
        "dart") generate_dart_config ;;
        "php") generate_php_config ;;
        "ruby") generate_ruby_config ;;
        "swift") generate_swift_config ;;
        "kotlin") generate_kotlin_config ;;
        *)
            log "error" "Unsupported language: $lang"
            return 1
            ;;
    esac
}

main() {
    local languages=("${!LANGUAGE_EXTENSIONS[@]}")

    log "info" "Starting configuration file generation..."

    for lang in "${languages[@]}"; do
        generate_config "$lang"
    done

    log "success" "Configuration generation complete!"
}

main "$@"
