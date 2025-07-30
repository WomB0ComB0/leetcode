import { promises as fs } from "node:fs";
import path from "node:path";
import axios, { AxiosError } from "axios";

interface QuestionData {
  titleSlug: string;
  questionFrontendId: string;
  difficulty: string;
}

const LANGUAGE_EXTENSIONS: { [key: string]: string } = {
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

const DIFFICULTIES = ["easy", "medium", "hard"];
const MAX_RETRIES = 5;
const INITIAL_DELAY = 500; // ms

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchQuestionData(titleSlug: string): Promise<QuestionData> {
  const query = `
    query questionData($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        questionFrontendId
        titleSlug
        difficulty
      }
    }
  `;

  let attempts = 0;
  let delayTime = INITIAL_DELAY;

  while (attempts < MAX_RETRIES) {
    try {
      const response = await axios.post(
        "https://leetcode.com/graphql",
        {
          query,
          variables: { titleSlug },
        },
        {
          headers: {
            "Content-Type": "application/json",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          },
        },
      );

      return response.data.data.question;
    } catch (error) {
      if (error instanceof Error && error.message.includes("429")) {
        console.warn(
          `Rate limit hit for ${titleSlug}. Retrying in ${delayTime}ms...`,
        );
        await delay(delayTime);
        delayTime *= 2; // Exponential backoff
        attempts++;
      } else {
        console.error(`API request failed for ${titleSlug}:`, error);
        throw error;
      }
    }
  }

  throw new Error(
    `Failed to fetch data for ${titleSlug} after ${MAX_RETRIES} attempts`,
  );
}

async function processFile(
  file: string,
  langDir: string,
  difficulty: string,
  extension: string,
  questionId: string,
) {
  const difficultyDir = path.join(langDir, difficulty);

  try {
    const titleSlug = file.replace(`.${extension}`, "").replace(/^\d+-/, "");
    const newFilename = `${questionId}-${titleSlug}.${extension}`;
    const sourcePath = path.join(difficultyDir, file);
    const targetPath = path.join(difficultyDir, newFilename);

    await fs.rename(sourcePath, targetPath);
    console.log(`Renamed: ${file} -> ${newFilename}`);
  } catch (error) {
    console.error(
      `Error processing ${file}:`,
      error instanceof Error ? error.message : String(error),
    );
  }
}

async function processAllLanguages(titleSlug: string, questionId: string) {
  const currentDir = process.cwd();

  for (const [lang, ext] of Object.entries(LANGUAGE_EXTENSIONS)) {
    for (const difficulty of DIFFICULTIES) {
      const difficultyDir = path.join(currentDir, lang, difficulty);

      try {
        const files = await fs.readdir(difficultyDir);
        const relevantFiles = files.filter(
          (file) => file.includes(titleSlug) && file.endsWith(`.${ext}`),
        );

        for (const file of relevantFiles) {
          await processFile(
            file,
            path.join(currentDir, lang),
            difficulty,
            ext,
            questionId,
          );
        }
      } catch (error) {
        if (error instanceof Error && error.message.includes("ENOENT")) {
          console.error(
            `Error processing directory ${difficultyDir}:`,
            error.message,
          );
        }
      }
    }
  }
}

async function run() {
  const currentDir = process.cwd();
  console.log("Starting filename revision process...");

  const titleToQuestionIdMap: { [key: string]: string } = {};

  for (const [lang, ext] of Object.entries(LANGUAGE_EXTENSIONS)) {
    for (const difficulty of DIFFICULTIES) {
      const difficultyDir = path.join(currentDir, lang, difficulty);

      try {
        const files = await fs.readdir(difficultyDir);
        const relevantFiles = files.filter(
          (file) => file.endsWith(`.${ext}`) && file !== "revision.ts",
        );

        for (const file of relevantFiles) {
          const titleSlug = file.replace(`.${ext}`, "").replace(/^\d+-/, "");
          if (!titleToQuestionIdMap[titleSlug]) {
            const questionData = await fetchQuestionData(titleSlug);
            titleToQuestionIdMap[titleSlug] = questionData.questionFrontendId;
          }
        }
      } catch (error) {
        if (error instanceof Error && error.message.includes("ENOENT")) {
          console.error(
            `Error processing directory ${difficultyDir}:`,
            error.message,
          );
        }
      }
    }
  }

  for (const [titleSlug, questionId] of Object.entries(titleToQuestionIdMap)) {
    await processAllLanguages(titleSlug, questionId);
  }

  console.log("Filename revision process completed");
}

const Revision = { run };

if (require.main === module) {
  Revision.run().catch(console.error);
}
