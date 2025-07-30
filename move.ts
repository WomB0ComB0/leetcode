/**
 * @fileoverview Utility for sorting LeetCode problem files into difficulty-based directories.
 * Fetches problem metadata from LeetCode's GraphQL API and organizes local solution files.
 */

import axios from "axios";
import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Represents a LeetCode problem with essential metadata.
 * @interface LeetCodeProblem
 * @property {string} titleSlug - The URL-friendly title of the problem
 * @property {string} difficulty - The difficulty level of the problem (easy/medium/hard)
 */
interface LeetCodeProblem {
  titleSlug: string;
  difficulty: string;
}

/**
 * Handles fetching LeetCode problem metadata and sorting solution files by difficulty.
 * @class ProblemSorter
 */
class ProblemSorter {
  /** GraphQL endpoint for LeetCode's API */
  private static readonly LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql";

  /** Supported programming language directories to process */
  private static readonly PROGRAMMING_DIRECTORIES = [
    "python",
    "typescript",
    "javascript",
    "java",
    "cpp",
    "c",
    "c#",
    "c++",
    "dart",
    "php",
    "csharp",
    "go",
    "rust",
    "ruby",
    "swift",
    "kotlin",
  ];

  /**
   * Fetches all problems from LeetCode's GraphQL API.
   * @returns {Promise<LeetCodeProblem[]>} Array of problem metadata
   * @throws {Error} If the API request fails
   */
  static async fetchAllProblems(): Promise<LeetCodeProblem[]> {
    const query = {
      query: `
        query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
          problemsetQuestionList: questionList(
            categorySlug: $categorySlug
            limit: $limit
            skip: $skip
            filters: $filters
          ) {
            questions: data {
              titleSlug
              difficulty
            }
          }
        }
      `,
      variables: {
        categorySlug: "",
        limit: 3500,
        skip: 0,
        filters: {},
      },
    };

    try {
      const response = await axios.post(this.LEETCODE_GRAPHQL_URL, query, {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0",
        },
        timeout: 10000, // 10-second timeout
      });

      return response.data.data.problemsetQuestionList.questions || [];
    } catch (error) {
      console.error(
        "Failed to fetch LeetCode problems:",
        error instanceof Error ? error.message : error,
      );
      return [];
    }
  }

  /**
   * Sorts problem solution files into difficulty-based subdirectories.
   * @param {string} baseDirectory - Root directory containing language folders
   * @param {LeetCodeProblem[]} problems - Array of problem metadata from LeetCode
   * @returns {Promise<void>}
   * @throws {Error} If file operations fail
   */
  static async sortProblemFiles(
    baseDirectory: string,
    problems: LeetCodeProblem[],
  ): Promise<void> {
    // Create difficulty map for efficient lookup
    const difficultyMap = new Map(
      problems.map((problem) => [
        problem.titleSlug,
        problem.difficulty.toLowerCase(),
      ]),
    );

    try {
      const directories = await Promise.all(
        this.PROGRAMMING_DIRECTORIES.map(async (dir) => {
          const fullPath = path.join(baseDirectory, dir);
          try {
            return { dir, files: await fs.readdir(fullPath), path: fullPath };
          } catch (error) {
            console.warn(
              `Skipping directory ${dir}: ${error instanceof Error ? error.message : error}`,
            );
            return null;
          }
        }),
      );

      // Filter out null directories and process concurrently
      await Promise.all(
        directories
          .filter(
            (dirInfo): dirInfo is NonNullable<typeof dirInfo> =>
              dirInfo !== null,
          )
          .map(async ({ dir, files, path: dirPath }) => {
            for (const file of files) {
              const ext = path.extname(file);
              const baseName = path.basename(file, ext);
              const slug = baseName.split(".")[0];

              const difficulty = difficultyMap.get(slug);
              if (difficulty) {
                const difficultyDirPath = path.join(dirPath, difficulty);
                await fs.mkdir(difficultyDirPath, { recursive: true });

                const sourcePath = path.join(dirPath, file);
                const destPath = path.join(difficultyDirPath, file);

                try {
                  await fs.rename(sourcePath, destPath);
                  console.log(`Moved ${file} to ${difficulty} difficulty`);
                } catch (moveError) {
                  console.error(`Failed to move ${file}:`, moveError);
                }
              }
            }
          }),
      );
    } catch (error) {
      console.error("Error processing problem directories:", error);
    }
  }

  /**
   * Main execution method that orchestrates the problem sorting process.
   * @param {string} [baseDirectory=process.cwd()] - Root directory to process
   * @returns {Promise<void>}
   * @throws {Error} If the sorting process fails
   */
  static async run(baseDirectory: string = process.cwd()): Promise<void> {
    console.time("Problem Sorting Duration");

    try {
      const problems = await this.fetchAllProblems();

      if (problems.length === 0) {
        console.warn("No problems retrieved. Exiting.");
        return;
      }

      await this.sortProblemFiles(baseDirectory, problems);
    } catch (error) {
      console.error("Unexpected error in problem sorting process:", error);
    } finally {
      console.timeEnd("Problem Sorting Duration");
    }
  }
}

// Allow direct execution or import
if (require.main === module) {
  ProblemSorter.run().catch(console.error);
}

export default ProblemSorter;
