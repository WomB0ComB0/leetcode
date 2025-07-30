import { RaySo } from "rayso";

const raySoConfig = (options = {}) => ({
  theme: options.theme || "candy",
  background: options.background || false,
  darkMode: options.darkMode || true,
  padding: options.padding || 32,
  language: options.language || "auto",
  title: options.title,
});

export async function generateRaySoImage(code, options = {}) {
  try {
    if (!code) {
      throw new Error("Code parameter is missing.");
    }

    const raySo = new RaySo(raySoConfig(options));
    const response = await raySo.cook(code);
    return new Uint8Array(response);
  } catch (error) {
    console.error("RaySo generation error:", error);
    throw error;
  }
}
