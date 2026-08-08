import path from "path";
import { spawn } from "child_process";
import chalk from "chalk";
import { createSpinner, Spinner } from "nanospinner";
import { DownloadOptions } from "./types.js";

export function buildArguments(options: DownloadOptions): string[] {
  const isPlaylistMode = [
    "playlist_video",
    "playlist_audio",
  ].includes(options.format);

  const outputTemplate = isPlaylistMode
    ? path.join(options.outputFolder, "%(playlist_title)s", "%(playlist_index)s - %(title)s.%(ext)s")
    : path.join(options.outputFolder, "%(title)s.%(ext)s");

  const args: string[] = [options.url, "-o", outputTemplate];

  if (isPlaylistMode) {
    args.push("--yes-playlist");
    if (
      options.playlistItemSelection === "specific" &&
      options.playlistItems
    ) {
      args.push("--playlist-items", options.playlistItems.trim());
    }
  } else {
    args.push("--no-playlist");
  }

  switch (options.format) {
    case "mp3":
    case "playlist_audio":
      args.push("-x", "--audio-format", "mp3");
      break;

    case "video_only":
      if (options.quality === "1080") {
        args.push("-f", "bestvideo[height<=1080]");
      } else if (options.quality === "720") {
        args.push("-f", "bestvideo[height<=720]");
      } else {
        args.push("-f", "bestvideo");
      }
      break;

    case "mp4":
    case "playlist_video":
      args.push("--merge-output-format", "mp4");
      if (options.quality === "1080") {
        args.push("-f", "bestvideo[height<=1080]+bestaudio/best");
      } else if (options.quality === "720") {
        args.push("-f", "bestvideo[height<=720]+bestaudio/best");
      } else {
        args.push("-f", "bestvideo+bestaudio/best");
      }
      break;
  }

  return args;
}

export async function executeDownload(options: DownloadOptions): Promise<void> {
  const args: string[] = buildArguments(options);

  console.log("");
  const spinner: Spinner = createSpinner("Initializing yt-dlp process...").start();

  const ytdlp = spawn("yt-dlp", args);

  ytdlp.stdout.on("data", (data: Buffer) => {
    const output: string = data.toString();
    const match: RegExpMatchArray | null = output.match(
      /\[download\]\s+(\d+\.\d+%\s+of\s+~\s*[\d\.\w]+)/
    );
    if (match) {
      spinner.update({ text: `Downloading: ${chalk.yellow(match[1])}` });
    }
  });

  ytdlp.on("close", (code: number | null) => {
    if (code === 0) {
      spinner.success({
        text: chalk.bold.green("Download complete! Saved to target directory."),
      });
    } else {
      spinner.error({
        text: chalk.bold.red(
          `Process failed with exit code ${code}. Check yt-dlp installation.`
        ),
      });
    }
  });
}