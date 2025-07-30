/**
 * @file social.ts
 * @fileoverview SocialPoster is a class that allows you to post to Bluesky.
 */
import { BskyAgent, RichText } from "@atproto/api";
import { promises as fs } from "node:fs";

interface SocialConfig {
  bluesky?: {
    handle: string;
    password: string;
  };
}

interface PostOptions {
  text: string;
  imagePath?: string;
  language: string;
  problemName: string;
}

export class SocialPoster {
  private config: SocialConfig;
  private clients: {
    bluesky?: BskyAgent;
  } = {};

  constructor(config: SocialConfig) {
    this.config = config;
  }

  async init(): Promise<void> {
    console.log("Starting initialization of social media clients...");
    const initPromises: Promise<void>[] = [];

    if (this.config.bluesky) {
      console.log("Bluesky config found, initializing...");
      initPromises.push(this.initBluesky());
    }

    const results = await Promise.allSettled(initPromises);
    console.log("Initialization complete. Results:", results);
  }

  private async initBluesky(): Promise<void> {
    if (!this.config.bluesky?.handle || !this.config.bluesky?.password) {
      console.log("Bluesky credentials not provided, skipping initialization");
      return;
    }

    try {
      console.log("Connecting to Bluesky...", this.config.bluesky.handle);
      const agent = new BskyAgent({
        service: "https://bsky.social",
      });

      const loginResponse = await agent.login({
        identifier: this.config.bluesky.handle,
        password: this.config.bluesky.password,
      });

      console.log("Bluesky login successful:", loginResponse.success);
      this.clients.bluesky = agent;
    } catch (error) {
      console.error("Bluesky initialization failed:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
        console.error("Stack trace:", error.stack);
      }
      throw error;
    }
  }

  async postToAll(options: PostOptions): Promise<void> {
    console.log("Starting to post to all platforms:", options);
    const postPromises = Object.entries(this.clients)
      .filter(([_, client]) => client)
      .map(([platform, _]) => {
        console.log(`Preparing to post to ${platform}...`);
        switch (platform) {
          case "bluesky":
            return this.postToBluesky(options);
          default:
            console.log(`Unknown platform: ${platform}`);
            return Promise.resolve();
        }
      });

    const results = await Promise.allSettled(postPromises);
    console.log("All posts completed. Results:", results);

    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(`Post to platform failed:`, result.reason);
      } else {
        console.log(`Post ${index + 1} succeeded`);
      }
    });
  }

  private async postToBluesky(options: PostOptions): Promise<void> {
    if (!this.clients.bluesky) {
      console.log("Bluesky client not initialized, skipping post");
      return;
    }

    try {
      console.log("Creating RichText for Bluesky post...");
      const rt = new RichText({ text: options.text });
      await rt.detectFacets(this.clients.bluesky);

      let images;
      if (options.imagePath) {
        console.log("Processing image for Bluesky:", options.imagePath);
        const imageData = await fs.readFile(options.imagePath);
        console.log("Image loaded, uploading to Bluesky...");
        const response = await this.clients.bluesky.uploadBlob(
          new Uint8Array(imageData),
          {
            encoding: "image/png",
          },
        );
        console.log("Image upload successful");

        images = [
          {
            image: response.data.blob,
            alt: `Code solution for ${options.problemName} in ${options.language}`,
          },
        ];
      }

      console.log("Sending post to Bluesky...");
      await this.clients.bluesky.post({
        text: rt.text,
        facets: rt.facets,
        embed: images
          ? {
              $type: "app.bsky.embed.images",
              images,
            }
          : undefined,
      });

      console.log(
        `Successfully posted to Bluesky: ${options.problemName} (${options.language})`,
      );
    } catch (error) {
      console.error("Bluesky post failed:", error);
      throw new Error(`${error instanceof Error ? error.message : error}`);
    }
  }
}
