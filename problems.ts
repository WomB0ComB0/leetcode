import axios from "axios";
import { promises as fs } from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline";

/**
 * Interface mapping programming languages to their file extensions
 * @interface
 */
interface LanguageExtensions {
  [key: string]: string;
}

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
  questionFrontendId: string;
}

async function fetchProblemDetails(
  titleSlug: string,
): Promise<ProblemDetails | null> {
  const url: string = "https://leetcode.com/graphql";

  try {
    const [contentResponse, snippetsResponse, problemInfoResponse] =
      await Promise.all([
        axios.post(url, {
          query: `
                    query questionContent($titleSlug: String!) {
                        question(titleSlug: $titleSlug) {
                            content
                            mysqlSchemas
                        }
                    }
                `,
          variables: { titleSlug },
        }),
        axios.post(url, {
          query: `
                    query questionEditorData($titleSlug: String!) {
                        question(titleSlug: $titleSlug) {
                            questionId
                            questionFrontendId
                            codeSnippets {
                                lang
                                langSlug
                                code
                            }
                        }
                    }
                `,
          variables: { titleSlug },
        }),
        axios.post(url, {
          query: `
                    query questionInfo($titleSlug: String!) {
                        question(titleSlug: $titleSlug) {
                            difficulty
                            questionId
                            questionFrontendId
                        }
                    }
                `,
          variables: { titleSlug },
        }),
      ]);

    return {
      content: contentResponse.data.data.question.content,
      codeSnippets: snippetsResponse.data.data.question.codeSnippets,
      difficulty: problemInfoResponse.data.data.question.difficulty,
      questionId: problemInfoResponse.data.data.question.questionId,
      questionFrontendId:
        problemInfoResponse.data.data.question.questionFrontendId,
    };
  } catch (error) {
    console.error(`Error fetching details for ${titleSlug}:`, error);
    return null;
  }
}

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

async function promptYesNo(
  question: string,
  nonInteractive = false,
): Promise<boolean> {
  if (nonInteractive) {
    // Assume "yes" in non-interactive mode
    return true;
  }

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`${question} (y/n): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase().startsWith("y"));
    });
  });
}

/**
 * Main execution function that orchestrates the problem fetching, sorting and file creation
 * @returns {Promise<void>}
 */
async function main(): Promise<void> {
  const titleSlug = Bun.argv[2];
  const language = Bun.argv[3];
  const nonInteractive = Bun.argv.includes("--non-interactive"); // Add a flag for non-interactive mode

  if (!titleSlug) {
    console.error("Please provide a problem slug as an argument");
    console.error("Example: bun problems.ts two-sum");
    process.exit(1);
  }

  try {
    const details = await fetchProblemDetails(titleSlug);
    if (!details) {
      console.error(`Failed to fetch details for problem: ${titleSlug}`);
      process.exit(1);
    }

    const languages: LanguageExtensions = {
      python: "py",
      typescript: "ts",
      javascript: "js",
      java: "java",
      cpp: "cpp",
      c: "c",
      dart: "dart",
      php: "php",
      csharp: "cs",
      go: "go",
      rust: "rs",
      ruby: "rb",
      swift: "swift",
      kotlin: "kt",
    };

    const difficulty = details.difficulty.toLowerCase();
    const fileName = `${details.questionFrontendId}-${titleSlug}`;

    console.log(
      `Creating files for problem: ${fileName} (${details.difficulty})`,
    );

    if (!languages[language]) {
      for (const [language, extension] of Object.entries(languages)) {
        const dirPath = path.join(language, difficulty);
        const modifiedFileName =
          language === "dart"
            ? `${details.questionId}_${titleSlug.replace(/-/g, "_")}.${extension}`
            : `${fileName}.${extension}`;
        const filePath = path.join(dirPath, modifiedFileName);

        try {
          await fs.access(filePath);
          const shouldReplace = await promptYesNo(
            `File already exists: ${filePath}. Replace it?`,
            nonInteractive,
          );

          if (!shouldReplace) {
            console.log(`Skipping: ${filePath}`);
            continue;
          }
        } catch {
          // File doesn't exist, continue with creation
        }

        await fs.mkdir(dirPath, { recursive: true });
        const snippet = details.codeSnippets.find(
          (s) => s.langSlug === language,
        );
        const content = formatProblemFile(
          language,
          details.content,
          snippet?.code || "",
        );

        await fs.writeFile(filePath, content);
        console.log(`Created file: ${filePath}`);
      }
    } else {
      const extension = languages[language];
      const dirPath = path.join(language, difficulty);
      const modifiedFileName =
        language === "dart"
          ? `${details.questionId}_${titleSlug.replace(/-/g, "_")}.${extension}`
          : `${fileName}.${extension}`;
      const filePath = path.join(dirPath, modifiedFileName);

      try {
        await fs.access(filePath);
        const shouldReplace = await promptYesNo(
          `File already exists: ${filePath}. Replace it?`,
          nonInteractive,
        );

        if (!shouldReplace) {
          console.log(`Skipping: ${filePath}`);
        }
      } catch {
        // File doesn't exist, continue with creation
      }
    }
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

const run = async (): Promise<void> {
    await main();
}

if (require.main === module) {
  run().catch(console.error);
}
