import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Utility functions for cleaning and standardizing filenames across programming language directories.
 * Handles conversion to kebab-case, roman numeral suffixes, and ensures unique filenames.
 */

/** List of programming language directories to process */
const PROGRAMMING_DIRECTORIES = [
  "python",
  "typescript",
  "javascript",
  "java",
  "cpp",
  "c",
  "csharp",
  "dart",
  "php",
  "go",
  "rust",
  "ruby",
  "swift",
  "kotlin",
];

/**
 * Converts a string to kebab-case format.
 * @param str - The input string to convert
 * @returns The kebab-cased string with only alphanumeric characters and hyphens
 */
function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2") // Convert camelCase to kebab-case
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^a-zA-Z0-9-]/g, "") // Remove non-alphanumeric characters except hyphens
    .toLowerCase();
}

/**
 * Checks if a string is already in valid kebab-case format.
 * @param str - The string to validate
 * @returns True if the string is valid kebab-case, false otherwise
 */
function isKebabCase(str: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(str);
}

/**
 * Converts a number to its Roman numeral representation.
 * @param num - The number to convert (must be positive)
 * @returns The Roman numeral string, or empty string if num <= 0
 */
function toRoman(num: number): string {
  if (num <= 0) return "";
  const romanNumerals: [string, number][] = [
    ["M", 1000],
    ["CM", 900],
    ["D", 500],
    ["CD", 400],
    ["C", 100],
    ["XC", 90],
    ["L", 50],
    ["XL", 40],
    ["X", 10],
    ["IX", 9],
    ["V", 5],
    ["IV", 4],
    ["I", 1],
  ];

  return romanNumerals.reduce((result, [roman, value]) => {
    let currentResult = result;
    let currentNum = num;
    while (currentNum >= value) {
      currentResult += roman;
      currentNum -= value;
    }
    num = currentNum;
    return currentResult;
  }, "");
}

/**
 * Processes a single directory, cleaning and standardizing all filenames within it.
 * - Converts filenames to kebab-case
 * - Converts numeric suffixes to Roman numerals
 * - Ensures unique filenames by adding numbered suffixes if needed
 * - Preserves file extensions
 *
 * @param directory - The full path to the directory to process
 * @throws Error if directory operations fail
 */
async function cleanFilenames(directory: string): Promise<void> {
  try {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    const seenNames = new Set<string>();

    for (const entry of entries) {
      if (!entry.isFile()) continue;

      const file = entry.name;
      const ext = path.extname(file);
      const baseName = path.basename(file, ext);
      const parts = baseName.split(".");
      const namePart = parts.slice(1).join(".");
      const kebabName = toKebabCase(namePart);

      if (isKebabCase(baseName)) {
        console.log(`Skipping already kebab-case file: ${file}`);
        continue;
      }

      const postfixMatch = kebabName.match(/-(\d+)$/);
      let finalName = kebabName;
      if (postfixMatch) {
        const number = Number.parseInt(postfixMatch[1], 10);
        if (number > 0) {
          const roman = toRoman(number);
          finalName = kebabName.replace(/-\d+$/, `-${roman}`);
        }
      }

      let uniqueName = finalName;
      let counter = 1;
      while (
        seenNames.has(uniqueName) ||
        (await fs
          .access(path.join(directory, `${uniqueName}${ext}`))
          .then(() => true)
          .catch(() => false))
      ) {
        uniqueName = `${finalName}-duplicate-${counter}`;
        counter++;
      }
      seenNames.add(uniqueName);

      const oldFilePath = path.join(directory, file);
      const newFilePath = path.join(directory, `${uniqueName}${ext}`);

      await fs.rename(oldFilePath, newFilePath);
      console.log(`Renamed: ${file} → ${uniqueName}${ext}`);
    }
  } catch (error) {
    console.error(`Error processing directory ${directory}:`, error);
  }
}

/**
 * Main entry point for the filename cleaning process.
 * Processes all configured programming language directories in parallel.
 *
 * @param baseDirectory - The root directory containing language subdirectories (defaults to current working directory)
 * @throws Error if the overall process fails
 */
async function run(baseDirectory: string = process.cwd()): Promise<void> {
  console.time("Filename Cleaning Duration");

  try {
    await Promise.all(
      PROGRAMMING_DIRECTORIES.map(async (dir) => {
        const fullPath = path.join(baseDirectory, dir);
        console.log(`Processing directory: ${dir}`);
        await cleanFilenames(fullPath);
      }),
    );
  } catch (error) {
    console.error("Unexpected error in filename cleaning process:", error);
  } finally {
    console.timeEnd("Filename Cleaning Duration");
  }
}

if (require.main === module) {
  run().catch(console.error);
}

export default {
  run,
  cleanFilenames,
  toKebabCase,
  isKebabCase,
  toRoman,
  PROGRAMMING_DIRECTORIES,
};
