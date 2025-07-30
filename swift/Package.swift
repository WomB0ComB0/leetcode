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
