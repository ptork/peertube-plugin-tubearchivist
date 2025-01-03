import { writeFileSync } from "fs"
import { YT_DLP_PLUGIN_DEST_CONFIG } from "../constants/yt-dlp"

export const saveConfig = (config: any) => {
  if (config) {
    writeFileSync(YT_DLP_PLUGIN_DEST_CONFIG, config, "utf8")
  }
}
