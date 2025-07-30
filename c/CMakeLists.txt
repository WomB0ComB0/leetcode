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
add_library(leetcode_lib ${SOURCES})
target_include_directories(leetcode_lib PUBLIC include)

# Create test executable
add_executable(leetcode_tests ${TEST_SOURCES})
target_link_libraries(leetcode_tests PRIVATE leetcode_lib unity)

# Register tests
add_test(NAME unit_tests COMMAND leetcode_tests)
