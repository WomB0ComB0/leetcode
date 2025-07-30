#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check internet connectivity
# Function to check internet connectivity
check_internet() {
    echo -e "${YELLOW}Checking internet connection...${NC}"

    # For Windows (Git Bash)
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        if ! ping -n 1 8.8.8.8 > nul 2>&1; then
            echo -e "${RED}No internet connection. Please check your network and try again.${NC}"
            exit 1
        fi
    else
        # For Unix-like systems
        if ! ping -c 1 8.8.8.8 &> /dev/null; then
            echo -e "${RED}No internet connection. Please check your network and try again.${NC}"
            exit 1
        fi
    fi

    echo -e "${GREEN}Internet connection available.${NC}\n"
}

# Function to install package manager if missing
install_package_manager() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${YELLOW}Installing $1...${NC}"
        case $1 in
            pip)
                if ! command -v python3 &> /dev/null; then
                    echo -e "${RED}Python3 is not installed. Installing Python3...${NC}"
                    sudo apt-get update && sudo apt-get install -y python3
                fi
                curl -sS https://bootstrap.pypa.io/get-pip.py | python3
                ;;
            bun)
                curl -fsSL https://bun.sh/install | bash
                source ~/.bashrc
                ;;
            cargo)
                curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
                source $HOME/.cargo/env
                ;;
        esac
    fi
}

# Function to install linter
install_linter() {
    local linter=$1
    local installer=$2
    local command=$3

    if ! command -v $linter &> /dev/null; then
        echo -e "${YELLOW}Installing $linter...${NC}"
        eval $command
    fi
}

# Check internet connectivity first
check_internet

# Install package managers
install_package_manager pip
install_package_manager bun
install_package_manager cargo

# Install linters
install_linter black "pip" "pip install black"
install_linter biome "bun" "bun add -d @biomejs/biome"
install_linter checkstyle "curl" "curl -o checkstyle.jar https://github.com/checkstyle/checkstyle/releases/download/checkstyle-10.3.4/checkstyle-10.3.4-all.jar"
install_linter clang-tidy "apt" "sudo apt-get install -y clang-tidy"
install_linter dotnet "curl" "curl -sSL https://dot.net/v1/dotnet-install.sh | bash"
install_linter dart "curl" "curl -fsSL https://github.com/dart-lang/sdk/archive/refs/heads/main.zip -o dart-sdk.zip"
install_linter php-cs-fixer "composer" "composer global require friendsofphp/php-cs-fixer"
install_linter golangci-lint "go" "go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest"
install_linter rubocop "gem" "gem install rubocop"
install_linter swiftlint "brew" "brew install swiftlint"
install_linter ktlint "curl" "curl -sSLO https://github.com/pinterest/ktlint/releases/download/0.45.2/ktlint && chmod a+x ktlint && sudo mv ktlint /usr/local/bin/"

echo -e "${YELLOW}Starting linting process...${NC}\n"

# Python (using Black)
if [ -d "python" ]; then
    echo -e "${YELLOW}Formatting Python files with Black...${NC}"
    black python/ || echo -e "${RED}Python formatting failed${NC}"
fi

# TypeScript/JavaScript (using Biome)
if [ -d "typescript" ] || [ -d "javascript" ]; then
    echo -e "${YELLOW}Linting TypeScript/JavaScript files with Biome...${NC}"
    bunx biome check --write ./typescript/**/*.ts ./javascript/**/*.js || echo -e "${RED}Biome linting failed${NC}"
fi

# Java
if [ -d "java" ]; then
    echo -e "${YELLOW}Linting Java files...${NC}"
    java -jar checkstyle.jar -c /google_checks.xml java/**/*.java || echo -e "${RED}Java linting failed${NC}"
fi

# C/C++
if [ -d "cpp" ] || [ -d "c" ]; then
    echo -e "${YELLOW}Linting C/C++ files...${NC}"
    find cpp c -name "*.cpp" -o -name "*.c" -exec clang-tidy {} + || echo -e "${RED}C/C++ linting failed${NC}"
fi

# C#
if [ -d "csharp" ]; then
    echo -e "${YELLOW}Linting C# files...${NC}"
    dotnet format csharp/ || echo -e "${RED}C# linting failed${NC}"
fi

# Dart
if [ -d "dart" ]; then
    echo -e "${YELLOW}Linting Dart files...${NC}"
    dart analyze dart/ || echo -e "${RED}Dart linting failed${NC}"
fi

# PHP
if [ -d "php" ]; then
    echo -e "${YELLOW}Linting PHP files...${NC}"
    php-cs-fixer fix php/ --dry-run --diff || echo -e "${RED}PHP linting failed${NC}"
fi

# Go
if [ -d "go" ]; then
    echo -e "${YELLOW}Linting Go files...${NC}"
    golangci-lint run go/... || echo -e "${RED}Go linting failed${NC}"
fi

# Rust
if [ -d "rust" ]; then
    echo -e "${YELLOW}Linting Rust files...${NC}"
    cargo clippy --all-targets --all-features -- -D warnings || echo -e "${RED}Rust linting failed${NC}"
fi

# Ruby
if [ -d "ruby" ]; then
    echo -e "${YELLOW}Linting Ruby files...${NC}"
    rubocop ruby/ || echo -e "${RED}Ruby linting failed${NC}"
fi

# Swift
if [ -d "swift" ]; then
    echo -e "${YELLOW}Linting Swift files...${NC}"
    swiftlint swift/ || echo -e "${RED}Swift linting failed${NC}"
fi

# Kotlin
if [ -d "kotlin" ]; then
    echo -e "${YELLOW}Linting Kotlin files...${NC}"
    ktlint "kotlin/**/*.kt" || echo -e "${RED}Kotlin linting failed${NC}"
fi

echo -e "\n${GREEN}Linting process completed!${NC}"
