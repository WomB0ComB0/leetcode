const dotenv = require("dotenv");
const path = require("node:path");
const { $ } = require("bun");

(async () => {
  await $`ls -la ${path.resolve(process.cwd(), ".env")}`;
})();

const result = dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
  debug: true,
});

if (result.error) {
  throw new Error(`Failed to load .env file: ${result.error}`);
}

const requiredEnvVars = ["BLUESKY_HANDLE", "BLUESKY_PASSWORD"];

const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName],
);

console.log("Current working directory:", process.cwd());
console.log("Resolved .env path:", path.resolve(process.cwd(), ".env"));
console.log("Entire process.env:", process.env);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`,
  );
}

console.log("Environment variables loaded successfully:");
console.log("BLUESKY_HANDLE:", process.env.BLUESKY_HANDLE);
console.log("BLUESKY_PASSWORD:", "[REDACTED]");

module.exports = {
  BLUESKY_HANDLE: process.env.BLUESKY_HANDLE,
  BLUESKY_PASSWORD: process.env.BLUESKY_PASSWORD,
};
