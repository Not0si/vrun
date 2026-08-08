export interface DownloadOptions {
  url: string;
  format:
    | "mp4"
    | "video_only"
    | "mp3"
    | "playlist_video"
    | "playlist_audio";
  playlistItemSelection?: "all" | "specific";
  playlistItems?: string;
  quality?: "best" | "1080" | "720";
  outputFolder: string;
}