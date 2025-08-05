import { promises as fs } from "node:fs";
import axios, { AxiosResponse } from "axios";
import path from "node:path";
import puppeteer, { Browser, Page } from "puppeteer";
import { spawn } from "node:child_process";

// Types and Interfaces
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
  titleSlug: string;
}

interface DailyChallenge {
  questionId: string;
  title: string;
  titleSlug: string;
  difficulty: string;
}

interface FileOperationResult {
  created: string[];
  updated: string[];
  skipped: string[];
}

// Configuration
const CONFIG = {
  LEETCODE_BASE_URL: "https://leetcode.com",
  GRAPHQL_ENDPOINT: "https://leetcode.com/graphql",
  REQUEST_DELAY: 1500,
  TIMEOUT: 15000,
  USER_AGENT: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  LANGUAGE_EXTENSIONS: {
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
  } as const,
  COMMENT_STYLES: {
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
  } as const,
} as const;

// Utility Functions
class LeetCodeError extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = "LeetCodeError";
  }
}

const logger = {
  info: (message: string) => console.log(`[INFO] ${message}`),
  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${message}`);
    if (error) console.error(error);
  },
  warn: (message: string) => console.warn(`[WARN] ${message}`),
  success: (message: string) => console.log(`[SUCCESS] ${message}`),
};

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const toKebabCase = (str: string): string =>
  str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

const htmlToText = (html: string): string =>
  html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .trim();

// Core Classes
class GraphQLClient {
  private csrfToken: string | null = null;

  private get headers() {
    return {
      "Content-Type": "application/json",
      "User-Agent": CONFIG.USER_AGENT,
      Referer: `${CONFIG.LEETCODE_BASE_URL}/problemset/all/`,
      Origin: CONFIG.LEETCODE_BASE_URL,
      "X-Requested-With": "XMLHttpRequest",
      Accept: "application/json, text/javascript, */*; q=0.01",
      "Accept-Language": "en-US,en;q=0.9",
      Connection: "keep-alive",
      ...(this.csrfToken && { "X-CSRFToken": this.csrfToken }),
    };
  }

  async initialize(): Promise<void> {
    try {
      logger.info("Fetching CSRF token...");
      const response = await axios.get(CONFIG.LEETCODE_BASE_URL, {
        headers: {
          "User-Agent": CONFIG.USER_AGENT,
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          Connection: "keep-alive",
          "Upgrade-Insecure-Requests": "1",
        },
        timeout: CONFIG.TIMEOUT,
      });

      const csrfTokenMatch = response.data.match(/var csrfToken = '([^']+)'/);
      if (!csrfTokenMatch) {
        throw new LeetCodeError("CSRF token not found in response");
      }

      this.csrfToken = csrfTokenMatch[1];
      logger.success("CSRF token acquired");
    } catch (error) {
      throw new LeetCodeError("Failed to fetch CSRF token", error as Error);
    }
  }

  async query<T>(query: string, variables?: Record<string, any>): Promise<T> {
    try {
      await delay(CONFIG.REQUEST_DELAY);

      const response: AxiosResponse = await axios.post(
        CONFIG.GRAPHQL_ENDPOINT,
        { query, variables },
        {
          headers: this.headers,
          timeout: CONFIG.TIMEOUT,
        }
      );

      if (response.data.errors) {
        throw new LeetCodeError(
          `GraphQL errors: ${JSON.stringify(response.data.errors)}`
        );
      }

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new LeetCodeError(
          `GraphQL request failed: ${error.response?.status} ${error.response?.statusText}`,
          error
        );
      }
      throw error;
    }
  }
}

class PuppeteerScraper {
  private browser: Browser | null = null;

  async initialize(): Promise<void> {
    logger.info("Launching Puppeteer browser...");
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor",
      ],
    });
  }

  async getDailyChallenge(): Promise<string> {
    if (!this.browser) {
      throw new LeetCodeError("Browser not initialized");
    }

    const page: Page = await this.browser.newPage();

    try {
      await page.setUserAgent(CONFIG.USER_AGENT);
      await page.setViewport({ width: 1920, height: 1080 });

      logger.info("Navigating to LeetCode problemset...");
      await page.goto(`${CONFIG.LEETCODE_BASE_URL}/problemset/all/`, {
        waitUntil: "networkidle2",
        timeout: CONFIG.TIMEOUT * 2,
      });

      // Wait for the daily challenge element to load
      await page.waitForSelector('[href^="/problems/"]', {
        timeout: CONFIG.TIMEOUT,
      });

      logger.info("Extracting daily challenge slug...");
      const titleSlug = await page.evaluate(() => {
        // Look for the daily challenge indicator (green background or specific class)
        const dailyChallengeElement = document
          .querySelector('[href^="/problems/"] span[class*="bg-green"]')
          ?.closest("a") ||
          document.querySelector('a[href^="/problems/"]:first-child');

        if (!dailyChallengeElement) return null;

        const href = dailyChallengeElement.getAttribute("href");
        const match = href?.match(/\/problems\/([^/]+)/);
        return match ? match[1] : null;
      });

      if (!titleSlug) {
        throw new LeetCodeError("Failed to extract daily challenge slug");
      }

      logger.success(`Daily challenge slug extracted: ${titleSlug}`);
      return titleSlug;
    } finally {
      await page.close();
    }
  }

  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

class FileManager {
  private formatProblemFile(
    language: string,
    problemContent: string,
    code: string
  ): string {
    const [start, end] = CONFIG.COMMENT_STYLES[language as keyof typeof CONFIG.COMMENT_STYLES] || ["/*", "*/"];
    const commentedContent = `${start}\n${htmlToText(problemContent)}\n${end}\n\n`;
    return `${commentedContent}${code}`;
  }

  private async hasNonCommentContent(filePath: string): Promise<boolean> {
    try {
      const content = await fs.readFile(filePath, "utf-8");
      const lines = content.split("\n");
      
      let inBlockComment = false;
      for (const line of lines) {
        const trimmed = line.trim();
        
        // Skip empty lines
        if (!trimmed) continue;
        
        // Handle block comments
        if (trimmed.includes("/*")) inBlockComment = true;
        if (inBlockComment) {
          if (trimmed.includes("*/")) inBlockComment = false;
          continue;
        }
        
        // Skip single-line comments and block comment markers
        if (
          trimmed.startsWith("//") ||
          trimmed.startsWith("#") ||
          trimmed.startsWith("=begin") ||
          trimmed.startsWith("=end") ||
          trimmed === '"""'
        ) {
          continue;
        }
        
        // If we reach here, we found non-comment content
        return true;
      }
      
      return false;
    } catch {
      return false;
    }
  }

  private getFileName(
    language: string,
    details: ProblemDetails,
    kebabTitle: string
  ): string {
    const { questionId } = details;
    const extension = CONFIG.LANGUAGE_EXTENSIONS[language as keyof typeof CONFIG.LANGUAGE_EXTENSIONS];
    
    return language === "dart"
      ? `${questionId}_${kebabTitle.replace(/-/g, "_")}.${extension}`
      : `${questionId}-${kebabTitle}.${extension}`;
  }

  async createSolutionFiles(details: ProblemDetails): Promise<FileOperationResult> {
    const kebabTitle = toKebabCase(details.title);
    const result: FileOperationResult = {
      created: [],
      updated: [],
      skipped: [],
    };

    logger.info(`Creating solution files for: ${details.title}`);

    for (const [language, extension] of Object.entries(CONFIG.LANGUAGE_EXTENSIONS)) {
      const dirPath = path.join(language, details.difficulty.toLowerCase());
      const fileName = this.getFileName(language, details, kebabTitle);
      const filePath = path.join(dirPath, fileName);

      try {
        // Check if file exists and has content
        const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
        
        if (fileExists && await this.hasNonCommentContent(filePath)) {
          logger.info(`Skipping existing file with content: ${filePath}`);
          result.skipped.push(filePath);
          continue;
        }

        // Ensure directory exists
        await fs.mkdir(dirPath, { recursive: true });

        // Find code snippet for this language
        const snippet = details.codeSnippets.find(s => s.langSlug === language);
        const content = this.formatProblemFile(
          language,
          details.content,
          snippet?.code || ""
        );

        await fs.writeFile(filePath, content);

        if (fileExists) {
          logger.success(`Updated empty file: ${filePath}`);
          result.updated.push(filePath);
        } else {
          logger.success(`Created new file: ${filePath}`);
          result.created.push(filePath);
        }
      } catch (error) {
        logger.error(`Failed to create ${filePath}`, error as Error);
      }
    }

    return result;
  }
}

class CommandExecutor {
  async execute(
    command: string,
    args: string[],
    cwd: string,
    silent = false
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const process = spawn(command, args, {
        stdio: silent ? "pipe" : "inherit",
        cwd,
        shell: true,
      });

      let output = "";
      let errorOutput = "";

      if (silent) {
        process.stdout?.on("data", (data) => {
          output += data.toString();
        });

        process.stderr?.on("data", (data) => {
          errorOutput += data.toString();
        });
      }

      process.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          const error = new Error(
            `Command "${command} ${args.join(" ")}" failed with code ${code}`
          );
          if (silent) {
            logger.error(`Command output: ${output}`);
            logger.error(`Command error: ${errorOutput}`);
          }
          reject(error);
        }
      });

      process.on("error", (err) => {
        reject(new LeetCodeError("Process spawn failed", err));
      });
    });
  }
}

// Main Application Class
class LeetCodeDailyChallenge {
  private graphqlClient = new GraphQLClient();
  private puppeteerScraper = new PuppeteerScraper();
  private fileManager = new FileManager();
  private commandExecutor = new CommandExecutor();

  private async getDailyChallengeViaAPI(): Promise<DailyChallenge> {
    await this.graphqlClient.initialize();

    const query = `
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
    `;

    const data = await this.graphqlClient.query<{
      activeDailyCodingChallengeQuestion: { question: DailyChallenge };
    }>(query);

    return data.activeDailyCodingChallengeQuestion.question;
  }

  private async getDailyChallengeViaPuppeteer(): Promise<DailyChallenge> {
    try {
      await this.puppeteerScraper.initialize();
      const titleSlug = await this.puppeteerScraper.getDailyChallenge();
      
      // We need to get additional details via API
      const details = await this.getProblemDetails(titleSlug);
      
      return {
        questionId: details.questionId,
        title: details.title,
        titleSlug: details.titleSlug,
        difficulty: details.difficulty,
      };
    } finally {
      await this.puppeteerScraper.cleanup();
    }
  }

  private async getProblemDetails(titleSlug: string): Promise<ProblemDetails> {
    const queries = [
      {
        query: `
          query questionContent($titleSlug: String!) {
            question(titleSlug: $titleSlug) {
              content
              questionId
              title
              difficulty
            }
          }
        `,
        variables: { titleSlug },
      },
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
    ];

    const [contentResponse, snippetsResponse] = await Promise.all(
      queries.map(({ query, variables }) =>
        this.graphqlClient.query<{ question: any }>(query, variables)
      )
    );

    return {
      content: contentResponse.question.content,
      codeSnippets: snippetsResponse.question.codeSnippets,
      difficulty: contentResponse.question.difficulty,
      questionId: contentResponse.question.questionId,
      title: contentResponse.question.title,
      titleSlug,
    };
  }

  private logResults(result: FileOperationResult): void {
    const { created, updated, skipped } = result;

    if (skipped.length > 0) {
      logger.info(`\nSkipped files (already have content): ${skipped.length}`);
      skipped.forEach(file => console.log(`  - ${file}`));
    }

    if (updated.length > 0) {
      logger.info(`\nUpdated empty files: ${updated.length}`);
      updated.forEach(file => console.log(`  - ${file}`));
    }

    if (created.length > 0) {
      logger.info(`\nCreated new files: ${created.length}`);
      created.forEach(file => console.log(`  - ${file}`));
    }

    const totalProcessed = created.length + updated.length + skipped.length;
    logger.success(`\nProcessed ${totalProcessed} files total`);
  }

  async run(): Promise<void> {
    try {
      logger.info("Starting LeetCode Daily Challenge fetch...");

      let dailyChallenge: DailyChallenge;

      try {
        // Try API approach first
        logger.info("Attempting API approach...");
        dailyChallenge = await this.getDailyChallengeViaAPI();
        logger.success("Successfully fetched via API");
      } catch (apiError) {
        logger.warn("API approach failed, trying Puppeteer...");
        dailyChallenge = await this.getDailyChallengeViaPuppeteer();
        logger.success("Successfully fetched via Puppeteer");
      }

      logger.info(`Daily Challenge: ${dailyChallenge.title} (${dailyChallenge.difficulty})`);

      // Get detailed problem information
      const problemDetails = await this.getProblemDetails(dailyChallenge.titleSlug);

      // Create solution files
      const result = await this.fileManager.createSolutionFiles(problemDetails);
      this.logResults(result);

      // Try to run additional command if available
      try {
        await this.commandExecutor.execute(
          "node",
          ["./node_modules/.bin/bun", "run", "problems", dailyChallenge.titleSlug, "all"],
          process.cwd(),
          true
        );
        logger.success("Additional command executed successfully");
      } catch (cmdError) {
        logger.warn("Additional command execution failed (non-critical)");
      }

      logger.success("Daily challenge processing completed!");
    } catch (error) {
      logger.error("Failed to process daily challenge", error as Error);
      throw error;
    }
  }
}

// Export and CLI execution
export default LeetCodeDailyChallenge;

if (require.main === module) {
  const app = new LeetCodeDailyChallenge();
  app.run().catch((error) => {
    console.error("Application failed:", error);
    process.exit(1);
  });
}
