# LeetCode Solutions Repository

This repository contains solutions to LeetCode problems in multiple programming languages, along with configuration and utility scripts.

## Setup and Configuration

### Prerequisites

- Git
- Bash shell (Git Bash for Windows users)
- Internet connection
- Language-specific tools (will be installed automatically as needed)

### Initial Setup

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd leetcode-solutions
    ```

2. Run the configuration script to set up language-specific configurations:

    ```bash
    chmod +x config.sh
    ./config.sh
    ```

This will create necessary configuration files for all supported languages:

- Python (pyproject.toml, setup.cfg, .flake8)
- TypeScript/JavaScript (tsconfig.json, biome.json)
- Rust (Cargo.toml, src structure)
- Go (go.mod, .golangci.yml)
- Java (pom.xml, .editorconfig)
- C++ (CMakeLists.txt, .clang-format)
- C (CMakeLists.txt, .clang-format, .clang-tidy)
- C# (Directory.Build.props, stylecop.json)
- Dart (pubspec.yaml, analysis_options.yaml)
- PHP (composer.json, .php-cs-fixer.php)
- Ruby (Gemfile, .rubocop.yml)
- Swift (Package.swift, .swiftlint.yml)
- Kotlin (build.gradle.kts, settings.gradle.kts)

### Code Linting

The repository includes a linting script to ensure code quality. To use it:

```bash
chmod +x lint.sh
./lint.sh
```

The linting script will:

1. Check internet connectivity
2. Install required package managers if missing
3. Install language-specific linters
4. Run linting for all supported languages present in the repository

Supported linters:

- Python: Black
- TypeScript/JavaScript: Biome
- Java: Checkstyle
- C/C++: clang-tidy
- C#: dotnet format
- Dart: dart analyze
- PHP: php-cs-fixer
- Go: golangci-lint
- Ruby: RuboCop
- Swift: SwiftLint
- Kotlin: ktlint

### Social Media Posting

The repository includes functionality to post code solutions to social media platforms. The posting script supports:

- Code formatting
- Syntax highlighting
- Multiple programming languages
- Image generation of code
- Social media platform integration (currently supports Bluesky)

To post a solution:

```bash
bun post.ts <problem-id>
```

Example:

```bash
bun post.ts 2684-maximum-number-of-moves-in-a-grid
```

The script will:

1. Locate the solution file
2. Prompt for language selection
3. Generate formatted code images
4. Post to configured social media platforms

### Daily Leetcode Challenge

```bash
bun run daily
```

### Get specific problem

```bash
bun run problem
```

## Directory Structure

```text
leetcode-solutions/
├── python/
│   ├── easy/
│   ├── medium/
│   └── hard/
├── typescript/
├── java/
├── cpp/
├── c/
├── csharp/
├── dart/
├── php/
├── go/
├── rust/
├── ruby/
├── swift/
└── kotlin/
```

Each language directory contains:

- Solution files organized by difficulty
- Language-specific configuration files
- Test files (where applicable)
- Generated images for social media posts

## Contributing

1. Create a new branch for your solution
2. Add your solution in the appropriate language directory
3. Run the linting script to ensure code quality
4. Create a pull request

## License

[Add your license information here]
