import { existsSync } from "fs"
import { YT_DLP_PLUGIN_DEST_FILE } from "../constants/yt-dlp"

export const ytDlpPluginExists = () => {
  return existsSync(YT_DLP_PLUGIN_DEST_FILE)
}
