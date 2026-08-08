#!/usr/bin/env node
import { getDownloadDetails } from "./prompts.js";
import { executeDownload } from "./downloader.js";

async function run(): Promise<void> {
  try {
    const options = await getDownloadDetails();
    await executeDownload(options);
  } catch (error) {
    console.error("An error occurred during execution:", error);
  }
}

run();