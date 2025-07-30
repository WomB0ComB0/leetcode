import { promises as fs } from "node:fs";
import axios from "axios";
import path from "node:path";
import puppeteer from "puppeteer";
import { spawn } from "node:child_process";

/**
 * Converts a string to kebab-case format
 * @param {string} str - The input string to convert
 * @returns {Promise<string>} The kebab-cased string with only lowercase letters, numbers, and hyphens
 */
async function toKebabCase(str: string): Promise<string> {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/**
 * Executes a shell command
 * @param {string} command - The command to execute
 * @param {string[]} args - Arguments for the command
 * @param {string} cwd - Current working directory
 * @param {boolean} silent - Whether to suppress output
 * @returns {Promise<void>}
 */
const executeCommand = async (
  command: string,
  args: string[],
  cwd: string,
  silent = false,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const process = spawn(command, args, {
        stdio: silent ? "pipe" : "inherit", // Capture output if silent
        cwd,
        shell: true, // Use shell to ensure commands like 'bun' are found
      });

      let output = "";
      let errorOutput = "";

      process.stdout?.on("data", (data) => {
        output += data.toString();
      });

      process.stderr?.on("data", (data) => {
        errorOutput += data.toString();
      });

      process.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          console.error(`Command failed: ${command} ${args.join(" ")}`);
          console.error(`Exit code: ${code}`);
          console.error(`Output: ${output}`);
          console.error(`Error output: ${errorOutput}`);
          reject(
            new Error(
              `Command "${command} ${args.join(" ")}" failed with code ${code}`,
            ),
          );
        }
      });

      process.on("error", (err) => {
        console.error("Process error:", err);
        reject(err);
      });
    } catch (err) {
      console.error("Failed to spawn process:", err);
      reject(err);
    }
  });
};

interface CodeSnippet {
  lang: string;
  langSlug: string;
  code: string;
}

interface ProblemDetails {
  content: string;
  codeSnippets: CodeSnippet[];
  difficulty: string;
  questionId: string;
  title: string;
}

/**
 * Formats the problem content into a file with comments
 * @param {string} language - The programming language
 * @param {string} problemContent - The problem description in HTML
 * @param {string} code - The code snippet
 * @returns {string} The formatted file content
 */
function formatProblemFile(
  language: string,
  problemContent: string,
  code: string,
): string {
  const htmlToComment = (html: string) => {
    const text = html
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, "&");

    const commentMap: { [key: string]: [string, string] } = {
      python: ['"""', '"""'],
      typescript: ["/*", "*/"],
      javascript: ["/*", "*/"],
      java: ["/*", "*/"],
      cpp: ["/*", "*/"],
      c: ["/*", "*/"],
      csharp: ["/*", "*/"],
      dart: ["/*", "*/"],
      php: ["/*", "*/"],
      go: ["/*", "*/"],
      rust: ["/*", "*/"],
      ruby: ["=begin", "=end"],
      swift: ["/*", "*/"],
      kotlin: ["/*", "*/"],
    };

    const [start, end] = commentMap[language] || ["/*", "*/"];
    return `${start}\n${text.trim()}\n${end}\n\n`;
  };

  return `${htmlToComment(problemContent)}${code}`;
}

/**
 * Fetches the CSRF token from LeetCode's homepage
 * @returns {Promise<string>} The CSRF token
 */
async function fetchCsrfToken(): Promise<string> {
  const response = await axios.get("https://leetcode.com/", {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      Connection: "keep-alive",
      "Upgrade-Insecure-Requests": "1",
    },
  });

  // Extract the CSRF token from the response
  const csrfTokenMatch = response.data.match(/var csrfToken = '([^']+)'/);
  if (!csrfTokenMatch) {
    throw new Error("CSRF token not found");
  }

  return csrfTokenMatch[1];
}

/**
 * Fetches the daily LeetCode challenge using Puppeteer
 * @returns {Promise<any>} The daily challenge details
 */
async function getDailyLeetcodeChallengeWithPuppeteer(): Promise<any> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  try {
    // Set a more realistic user agent
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
    );

    console.log("Navigating to LeetCode...");
    await page.goto("https://leetcode.com/problemset/all/", {
      waitUntil: "networkidle2",
      timeout: 30000, // Increase timeout to 30 seconds
    });

    // Wait for the calendar to load
    await page.waitForSelector('[href^="/problems/"][class*="h-8 w-8"]', {
      timeout: 30000, // Increase timeout to 30 seconds
    });

    console.log("Extracting daily challenge...");
    const dailyChallenge = await page.evaluate(() => {
      // Find the element with the green background (current day)
      const dailyChallengeElement = document
        .querySelector('[href^="/problems/"] span[class*="bg-green-s"]')
        ?.closest("a");
      if (!dailyChallengeElement) return null;

      // Extract the problem slug from the href
      const href = dailyChallengeElement.getAttribute("href");
      const match = href?.match(/\/problems\/([^/]+)/);
      return match ? match[1] : null;
    });
    if (!dailyChallenge) {
      throw new Error("Failed to extract daily challenge");
    }

    // Extract cookies to help with API approaches
    const cookies = await page.cookies();
    console.log("Extracted cookies for potential API use");

    return {
      data: {
        activeDailyCodingChallengeQuestion: {
          question: {
            titleSlug: dailyChallenge,
          },
        },
      },
      cookies,
    };
  } finally {
    await browser.close();
  }
}
/**
 * Checks if a file has non-comment content
 * @param {string} filePath - The path to the file
 * @returns {Promise<boolean>} Whether the file has non-comment content
 */
async function hasContent(filePath: string): Promise<boolean> {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    const nonCommentContent = content
      .split("\n")
      .filter(
        (line) =>
          !line.trim().startsWith("/*") &&
          !line.trim().startsWith("*/") &&
          !line.trim().startsWith("//") &&
          line.trim().length > 0,
      )
      .join("")
      .trim();
    return nonCommentContent.length > 0;
  } catch {
    return false;
  }
}

/**
 * Creates solution files for a LeetCode problem directly
 * @param {string} titleSlug - The problem's title slug
 * @returns {Promise<void>}
 */
async function createSolutionFiles(titleSlug: string): Promise<void> {
  console.log(`Creating solution files for: ${titleSlug}`);

  // Fetch problem details
  const url = "https://leetcode.com/graphql";
  const headers = {
    "Content-Type": "application/json",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
  };

  try {
    const [contentResponse, snippetsResponse, questionResponse] =
      await Promise.all([
        axios.post(
          url,
          {
            query: `
            query questionContent($titleSlug: String!) {
              question(titleSlug: $titleSlug) {
                content
              }
            }
          `,
            variables: { titleSlug },
          },
          { headers },
        ),
        axios.post(
          url,
          {
            query: `
            query questionEditorData($titleSlug: String!) {
              question(titleSlug: $titleSlug) {
                codeSnippets {
                  lang
                  langSlug
                  code
                }
              }
            }
          `,
            variables: { titleSlug },
          },
          { headers },
        ),
        axios.post(
          url,
          {
            query: `
            query questionData($titleSlug: String!) {
              question(titleSlug: $titleSlug) {
                questionId
                title
                difficulty
              }
            }
          `,
            variables: { titleSlug },
          },
          { headers },
        ),
      ]);

    const details: ProblemDetails = {
      content: contentResponse.data.data.question.content,
      codeSnippets: snippetsResponse.data.data.question.codeSnippets,
      difficulty: questionResponse.data.data.question.difficulty,
      questionId: questionResponse.data.data.question.questionId,
      title: questionResponse.data.data.question.title,
    };

    console.log("Problem details fetched successfully");
    console.log(`Question ID: ${details.questionId}`);
    console.log(`Title: ${details.title}`);
    console.log(`Difficulty: ${details.difficulty}`);

    const kebabTitle = await toKebabCase(details.title);
    const filePrefix = `${details.questionId}-${kebabTitle}`;

    const extensions: { [key: string]: string } = {
      python: "py",
      typescript: "ts",
      javascript: "js",
      java: "java",
      cpp: "cpp",
      c: "c",
      csharp: "cs",
      dart: "dart",
      php: "php",
      go: "go",
      rust: "rs",
      ruby: "rb",
      swift: "swift",
      kotlin: "kt",
    };

    // Create files for each language
    for (const [language, extension] of Object.entries(extensions)) {
      const dirPath = path.join(language, details.difficulty.toLowerCase());
      const fileName =
        language === "dart"
          ? `${details.questionId}_${kebabTitle.replace(/-/g, "_")}.${extension}`
          : `${filePrefix}.${extension}`;
      const filePath = path.join(dirPath, fileName);

      try {
        await fs.mkdir(dirPath, { recursive: true });
        const snippet = details.codeSnippets.find(
          (s) => s.langSlug === language,
        );
        if (snippet) {
          const content = formatProblemFile(
            language,
            details.content,
            snippet.code || "",
          );
          await fs.writeFile(filePath, content);
          console.log(`Created file: ${filePath}`);
        }
      } catch (err) {
        console.error(`Error creating ${filePath}:`, err);
      }
    }
  } catch (err) {
    console.error("Error fetching problem details:", err);
    throw err;
  }
}

/**
 * Fetches the daily LeetCode challenge and creates solution files in multiple languages
 * @throws {Error} If the API request fails or file operations fail
 */
async function getDailyLeetcodeChallenge(): Promise<void> {
  console.log("Fetching daily LeetCode challenge...");
  const url = "https://leetcode.com/graphql";

  try {
    // Fetch the CSRF token
    const csrfToken = await fetchCsrfToken();
    console.log("Got CSRF token, attempting API request...");

    // Add delay to prevent rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const headers = {
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
      Referer: "https://leetcode.com/problemset/all/",
      Origin: "https://leetcode.com",
      "X-Requested-With": "XMLHttpRequest",
      "X-CSRFToken": csrfToken,
      Accept: "application/json, text/javascript, */*; q=0.01",
      "Accept-Language": "en-US,en;q=0.9",
      Connection: "keep-alive",
    };

    const dailyQuery = await axios.post(
      url,
      {
        query: `
          query questionOfToday {
            activeDailyCodingChallengeQuestion {
              question {
                questionId
                title
                titleSlug
                difficulty
              }
            }
          }
        `,
      },
      {
        headers,
        timeout: 10000, // Increase timeout to 10 seconds
      },
    );

    const question =
      dailyQuery.data.data.activeDailyCodingChallengeQuestion.question;
    console.log("Daily Challenge (API):", question);

    const titleSlug = question.titleSlug;

    // Add delay between API calls to prevent rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const [contentResponse, snippetsResponse] = await Promise.all([
      axios.post(
        url,
        {
          query: `
            query questionContent($titleSlug: String!) {
              question(titleSlug: $titleSlug) {
                content
                mysqlSchemas
              }
            }
          `,
          variables: { titleSlug },
        },
        {
          headers,
          timeout: 10000,
        },
      ),
      axios.post(
        url,
        {
          query: `
            query questionEditorData($titleSlug: String!) {
              question(titleSlug: $titleSlug) {
                codeSnippets {
                  lang
                  langSlug
                  code
                }
              }
            }
          `,
          variables: { titleSlug },
        },
        {
          headers,
          timeout: 10000,
        },
      ),
    ]);

    const details: ProblemDetails = {
      content: contentResponse.data.data.question.content,
      codeSnippets: snippetsResponse.data.data.question.codeSnippets,
      difficulty: question.difficulty,
      questionId: question.questionId,
      title: question.title,
    };

    console.log("Challenge details:");
    console.log(`Question ID: ${details.questionId}`);
    console.log(`Title: ${details.title}`);
    console.log(`Difficulty: ${details.difficulty}`);

    const kebabTitle = await toKebabCase(details.title);
    const filePrefix = `${details.questionId}-${kebabTitle}`;

    const extensions: { [key: string]: string } = {
      python: "py",
      typescript: "ts",
      javascript: "js",
      java: "java",
      cpp: "cpp",
      c: "c",
      csharp: "cs",
      dart: "dart",
      php: "php",
      go: "go",
      rust: "rs",
      ruby: "rb",
      swift: "swift",
      kotlin: "kt",
    };

    const existingFiles: string[] = [];
    const createdFiles: string[] = [];
    const skippedFiles: string[] = [];

    for (const [language, extension] of Object.entries(extensions)) {
      const dirPath = path.join(language, details.difficulty.toLowerCase());
      const fileName =
        language === "dart"
          ? `${details.questionId}_${kebabTitle.replace(/-/g, "_")}.${extension}`
          : `${filePrefix}.${extension}`;
      const filePath = path.join(dirPath, fileName);

      try {
        await fs.access(filePath);
        const hasExistingContent = await hasContent(filePath);

        if (hasExistingContent) {
          console.log(`File exists with content, skipping: ${filePath}`);
          skippedFiles.push(filePath);
          continue;
        }

        existingFiles.push(filePath);
        console.log(`File exists but empty, replacing: ${filePath}`);
      } catch {
        await fs.mkdir(dirPath, { recursive: true });
      }

      const snippet = details.codeSnippets.find((s) => s.langSlug === language);
      const content = formatProblemFile(
        language,
        details.content,
        snippet?.code || "",
      );
      await fs.writeFile(filePath, content);
      if (!existingFiles.includes(filePath)) {
        createdFiles.push(filePath);
      }
      console.log(
        `${existingFiles.includes(filePath) ? "Updated" : "Created"} file: ${filePath}`,
      );
    }

    if (skippedFiles.length > 0) {
      console.log("\nSkipped Files (already have content):");
      for (const file of skippedFiles) {
        console.log(file);
      }
    }

    if (existingFiles.length > 0) {
      console.log("\nUpdated Empty Files:");
      for (const file of existingFiles) {
        console.log(file);
      }
    }

    if (createdFiles.length > 0) {
      console.log("\nNewly Created Files:");
      for (const file of createdFiles) {
        console.log(file);
      }
    }

    try {
      // Try to execute external command, but don't fail if it doesn't work
      await executeCommand(
        "node",
        [
          "./node_modules/.bin/bun",
          "run",
          "problems",
          question.titleSlug,
          "all",
        ],
        process.cwd(),
        true,
      );
    } catch (cmdError) {
      console.log(
        "Note: Additional command execution failed, but files were created successfully.",
      );
    }
  } catch (initialError) {
    console.error("Direct API call failed:", (initialError as Error).message);
    console.log("Attempting with Puppeteer...");

    try {
      console.log(
        "Launching Puppeteer in headless mode with sandbox disabled...",
      );
      const puppeteerResult = await getDailyLeetcodeChallengeWithPuppeteer();
      const question =
        puppeteerResult.data.activeDailyCodingChallengeQuestion.question;
      console.log("Daily Challenge (Puppeteer):", question);

      // Create the files directly rather than using external commands
      await createSolutionFiles(question.titleSlug);
      console.log("Successfully created solution files for daily challenge!");
    } catch (puppeteerError) {
      console.error("Puppeteer error:", puppeteerError);
      throw new Error("Both API and Puppeteer approaches failed");
    }
  }
}

const run = async (): Promise<void> => {
  await getDailyLeetcodeChallenge();
};

if (require.main === module) {
  run().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
