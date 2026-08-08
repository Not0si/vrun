import os from "os";
import path from "path";

export function getDefaultOutputDir(): string {
  const homeDir = os.homedir();
  if (process.platform === "linux" || process.platform === "darwin") {
    return path.join(homeDir, "Videos");
  }
  return path.join(homeDir, "Downloads");
}

export function isPlaylistUrl(url: string): boolean {
  return /[?&]list=|^https?:\/\/.*playlist.*/i.test(url.trim());
}