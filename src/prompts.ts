import chalk from "chalk";
import inquirer from "inquirer";
import { DownloadOptions } from "./types.js";
import { getDefaultOutputDir, isPlaylistUrl } from "./utils.js";

export async function getDownloadDetails(): Promise<DownloadOptions> {
  console.log(chalk.bold.red("\n--- YouTube Downloader CLI ---\n"));

  const defaultDir = getDefaultOutputDir();

  return inquirer.prompt<DownloadOptions>([
    {
      type: "input",
      name: "url",
      message: "Enter the video or playlist URL:",
      validate: (input: string): boolean | string =>
        input.trim() ? true : "Please enter a valid URL.",
    },
    {
      type: "select",
      name: "format",
      message: "Choose a format:",
      choices: (answers) => {
        const isPlaylist = isPlaylistUrl(answers.url || "");

        if (isPlaylist) {
          return [
            { name: "Entire Playlist: Video + Audio (MP4)", value: "playlist_video" },
            { name: "Entire Playlist: Audio Only (MP3)", value: "playlist_audio" },
            { name: "Single Video: Best Video + Audio (MP4)", value: "mp4" },
            { name: "Single Video: Video Only (No Audio)", value: "video_only" },
            { name: "Single Video: Audio Only (MP3)", value: "mp3" },
          ];
        }

        return [
          { name: "Best Video + Audio (MP4)", value: "mp4" },
          { name: "Video Only (No Audio)", value: "video_only" },
          { name: "Audio Only (MP3)", value: "mp3" },
        ];
      },
    },
    {
      type: "select",
      name: "playlistItemSelection",
      message: "Playlist selection strategy:",
      choices: [
        { name: "Download All Items", value: "all" },
        { name: "Select Specific Items / Range", value: "specific" },
      ],
      when: (answers: Partial<DownloadOptions>): boolean =>
        ["playlist_video", "playlist_audio"].includes(answers.format || ""),
    },
    {
      type: "input",
      name: "playlistItems",
      message: "Enter item numbers or ranges:",
      when: (answers: Partial<DownloadOptions>): boolean =>
        answers.playlistItemSelection === "specific",
      transformer: (input: string): string => {
        if (!input) {
          return chalk.dim(
            "\n  " +
            chalk.cyan("Syntax Guide:") + "\n" +
            "  • " + chalk.yellow("1,3,5") + "     : Single items separated by commas\n" +
            "  • " + chalk.yellow("1-10") + "      : Inclusive range from item 1 to 10\n" +
            "  • " + chalk.yellow("1,3,5-8") + "   : Mix individual items and ranges\n" +
            "  • " + chalk.yellow("1-10:2") + "    : Range with step size (items 1, 3, 5, 7, 9)\n" +
            "  • " + chalk.yellow("-1, -2") + "    : Negative indices count backward from end"
          );
        }
        return input;
      },
      validate: (input: string): boolean | string => {
        const validPattern = /^([~-]?\d+(:[~-]?\d+)*(-\d+)?)(,\s*([~-]?\d+(:[~-]?\d+)*(-\d+)?))*$/;
        return validPattern.test(input.trim())
          ? true
          : "Invalid format. Examples: 1,3,5 | 1-10 | 1,3,5-8 | 1-10:2";
      },
    },
    {
      type: "select",
      name: "quality",
      message: "Select quality preference:",
      choices: [
        { name: "Best Available", value: "best" },
        { name: "1080p Max", value: "1080" },
        { name: "720p Max", value: "720" },
      ],
      when: (answers: Partial<DownloadOptions>): boolean =>
        ["mp4", "video_only", "playlist_video"].includes(answers.format || ""),
    },
    {
      type: "input",
      name: "outputFolder",
      message: "Output directory path:",
      default: defaultDir,
      filter: (input: string): string => input.trim() || defaultDir,
    },
  ]);
}